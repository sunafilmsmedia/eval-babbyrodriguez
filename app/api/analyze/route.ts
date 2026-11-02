import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeScoring } from "@/lib/scoring";
import { buildFallbackReport } from "@/lib/fallbackReport";
import { BRAND } from "@/lib/brand";
import type { AnalyzeResponse, Answers, Report } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Usted es un experto en bienes raíces residenciales de Quebec (región de ${BRAND.region}, sector de ${BRAND.city}) que redacta un informe personalizado, honesto y tranquilizador para un propietario que se pregunta si es un buen momento para vender.

Su tono: cálido, profesional, en ESPAÑOL con tratamiento formal (usted / su / sus — nunca tuteo), nunca alarmista, nunca comercial.

Recibirá las respuestas del formulario, un puntaje calculado (0-100) y los factores detectados. Debe producir un informe JSON ESTRICTAMENTE en el formato solicitado. No se desvíe del esquema.

Reglas clave:
- Si el veredicto es "defavorable", reconózcalo claramente y proponga un plan de espera constructivo (no impulse la venta).
- Si es "moyen", matice — proponga optimizaciones previas.
- Si es "favorable", confírmelo con una razón concreta y proponga pasos claros.
- "marketInsight": un dato plausible sobre el mercado inmobiliario de ${BRAND.region} (sin inventar cifras precisas imposibles de verificar).
- "steps": exactamente 4 pasos cortos y accionables.
- "stats": exactamente 4 entradas. La primera es siempre el puntaje. Use las cifras proporcionadas para las demás.
- Sin markdown, sin emojis, sin frases vacías.
- Redacte TODO el informe en ESPAÑOL, tratando al lector de "usted" (su / sus). Nunca tutee ("tú", "tu", "tus").`;

function extractJson(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // fallthrough
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
  return null;
}

function isValidReport(r: unknown): r is Report {
  if (!r || typeof r !== "object") return false;
  const x = r as Record<string, unknown>;
  return (
    typeof x.headline === "string" &&
    typeof x.summary === "string" &&
    Array.isArray(x.stats) &&
    x.stats.length >= 3 &&
    Array.isArray(x.steps) &&
    x.steps.length >= 3 &&
    typeof x.marketInsight === "string"
  );
}

export async function POST(req: Request) {
  let body: { answers?: Answers };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const answers = body.answers ?? {};
  const scoring = computeScoring(answers);
  const fallback = buildFallbackReport(answers, scoring);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const payload: AnalyzeResponse = {
      scoring,
      report: fallback,
      generatedBy: "fallback",
    };
    return NextResponse.json(payload);
  }

  try {
    const client = new Anthropic({ apiKey });
    const userMessage = {
      answers,
      scoring,
      fallbackHints: {
        headline: fallback.headline,
        marketInsight: fallback.marketInsight,
      },
      requiredSchema: {
        headline: "frase de apertura, 1 línea",
        summary: "resumen, 2-3 frases",
        stats: [
          { label: "Puntaje de oportunidad", value: `${scoring.score}/100`, detail: "..." },
          { label: "Plusvalía estimada", value: "+X%", detail: "..." },
          { label: "Años de posesión", value: "X años", detail: "..." },
          { label: "Rendimiento anualizado", value: "X%/año", detail: "..." },
        ],
        steps: [{ title: "...", description: "..." }],
        marketInsight: "dato relevante del mercado inmobiliario",
      },
    };

    const completion = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Aquí están los datos. Responda únicamente con un objeto JSON válido que respete el esquema.\n\n${JSON.stringify(userMessage, null, 2)}`,
        },
      ],
    });

    const textBlock = completion.content.find((c) => c.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const parsed = extractJson(text);

    if (isValidReport(parsed)) {
      const payload: AnalyzeResponse = {
        scoring,
        report: parsed,
        generatedBy: "claude",
      };
      return NextResponse.json(payload);
    }
  } catch (err) {
    console.error("[analyze] Claude error", err);
  }

  const payload: AnalyzeResponse = {
    scoring,
    report: fallback,
    generatedBy: "fallback",
  };
  return NextResponse.json(payload);
}
