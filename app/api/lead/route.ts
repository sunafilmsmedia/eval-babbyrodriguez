import { NextResponse } from "next/server";
import { computeScoring } from "@/lib/scoring";
import { REGIONS } from "@/lib/regions";
import { BRAND } from "@/lib/brand";
import type { Answers, LeadPayload, LeadType } from "@/lib/types";

export const runtime = "nodejs";

interface IncomingBody extends Partial<LeadPayload> {
  answers?: Answers;
  leadType?: LeadType;
  // Attribution Meta (capturés côté client)
  fbclid?: string;
  fbc?: string;
  fbp?: string;
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function POST(req: Request) {
  let body: IncomingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email, consent, answers } = body;
  const leadType: LeadType = body.leadType ?? "evaluation";

  if (!name || !email || !consent || !answers) {
    return NextResponse.json(
      { stored: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Scoring uniquement pour les leads d'évaluation (le market_info bypass).
  const scoring =
    leadType === "evaluation" ? computeScoring(answers) : null;

  // Promesse critique pour les évaluations : si verdict défavorable, on ne
  // stocke rien et on ne transmet rien. Les market_info (intérêt aux ventes
  // du secteur sans intention de vendre) sont toujours stockés.
  if (leadType === "evaluation" && scoring && scoring.verdict === "defavorable") {
    return NextResponse.json({
      stored: false,
      reason: "verdict_defavorable",
    });
  }

  const { firstName, lastName } = splitName(name);
  // Secteur de la liste → son nom ; sinon on garde le texte libre saisi.
  const regionName = REGIONS.find((r) => r.id === answers.region)?.name ?? answers.region ?? "";

  // Segmentation jour/nuit — heure du Québec (IANA gère l'été/hiver).
  // 8h→20h = jour, 20h→8h = nuit.
  const heureQuebec = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Montreal",
      hour: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }).format(new Date()),
    10
  );
  const jour = heureQuebec >= 8 && heureQuebec < 20;

  // Payload aplati pour mapping GHL direct + données brutes en complément.
  const payload = {
    source: BRAND.slug,
    receivedAt: new Date().toISOString(),

    // Type de lead — permet à GHL de router via le workflow
    leadType,

    // Contact
    firstName,
    lastName,
    fullName: name,
    phone: phone ?? "",
    email,

    // Segmentation jour/nuit (heure Québec)
    periode: jour ? "jour" : "nuit",
    lead_type: jour ? "lead_jour" : "lead_nuit",
    heureQuebec,

    // Attribution Meta
    fbclid: body.fbclid ?? "",
    fbc: body.fbc ?? "",
    fbp: body.fbp ?? "",

    // Scoring (vide pour market_info)
    score: scoring?.score ?? null,
    verdict: scoring?.verdict ?? null,

    // Détails propriété
    propertyType: answers.propertyType ?? "",
    sellingMotivation: answers.sellingMotivation ?? "",
    yearsOwned: answers.yearsOwned ?? 0,
    estimatedValue: answers.estimatedValue ?? 0,
    region: regionName,
    regionId: answers.region ?? "",
    financialProfile: answers.financialProfile ?? "",
    hasChildren: answers.hasChildren ?? false,
    childrenStatus: answers.childrenStatus ?? "",
    noChildrenPlan: answers.noChildrenPlan ?? "",
    // Signal critique : la personne est déjà sous contrat MAIS veut changer
    // (lead de "poaching" — info précieuse pour le courtier)
    hasContract: answers.hasContract ?? false,
    wantsToSwitch: answers.wantsToSwitch ?? false,

    // Données brutes
    lead: { name, phone, email },
    scoring: scoring
      ? { score: scoring.score, verdict: scoring.verdict }
      : null,
    answers,
  };

  // Webhook CRM (GHL) — à définir via CRM_WEBHOOK_URL (env Vercel / .env.local).
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const webhookSecret = process.env.CRM_WEBHOOK_SECRET;
  if (!webhookUrl) {
    console.warn("[lead] CRM_WEBHOOK_URL absent — lead NON transmis au CRM.");
  }

  if (webhookUrl) {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (webhookSecret) headers["X-Webhook-Secret"] = webhookSecret;
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[lead] Webhook returned", res.status);
      }
    } catch (err) {
      console.error("[lead] Webhook failed", err);
    }
  } else {
    console.log("[lead] Stored (no webhook configured):", JSON.stringify(payload));
  }

  return NextResponse.json({
    stored: true,
    verdict: scoring?.verdict ?? null,
    leadType,
  });
}
