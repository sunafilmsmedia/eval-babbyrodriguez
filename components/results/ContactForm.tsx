"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackLeadWithMatching } from "../MetaPixel";
import { trackStep } from "@/lib/track";
import { BRAND } from "@/lib/brand";
import type { Answers, Verdict } from "@/lib/types";

interface Props {
  answers: Answers;
  verdict: Verdict;
  onSubmitted: (result: { stored: boolean; firstName: string }) => void;
  // Mode "gated" — n'expose pas le verdict via le titre et utilise
  // toujours leadType=evaluation (la promesse de non-stockage si
  // défavorable reste honorée côté API).
  gated?: boolean;
}

// Attribution Meta : fbclid (URL ou cookie _fbc) + cookies _fbc/_fbp.
function getFbData(): { fbclid?: string; fbc?: string; fbp?: string } {
  if (typeof window === "undefined") return {};
  try {
    const cookie = (n: string) =>
      document.cookie.split("; ").find((c) => c.startsWith(n + "="))?.split("=")[1];
    const fbc = cookie("_fbc");
    const fbp = cookie("_fbp");
    let fbclid = new URLSearchParams(window.location.search).get("fbclid") ?? undefined;
    // Cookie _fbc = "fb.1.<timestamp>.<fbclid>" — repli si l'URL n'a plus le param.
    if (!fbclid && fbc) fbclid = fbc.split(".")[3] || undefined;
    return { fbclid, fbc: fbc ? decodeURIComponent(fbc) : undefined, fbp };
  } catch {
    return {};
  }
}

export default function ContactForm({ answers, verdict, onSubmitted, gated }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Étape « coordonnées » : le formulaire de contact est affiché.
  useEffect(() => {
    trackStep("coordonnees");
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) return setError("Su nombre es obligatorio.");
    if (!email.trim()) return setError("Su correo electrónico es obligatorio.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError("Formato de correo electrónico inválido.");
    }
    if (!phone.trim()) return setError("Su teléfono es obligatorio.");
    // Validation téléphone : au moins 10 chiffres (Amérique du Nord)
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      return setError("Número de teléfono inválido.");
    }
    if (!consent) return setError("Por favor marque la casilla de consentimiento.");

    setSubmitting(true);
    try {
      // Mode gated : la personne s'est engagée à recevoir l'analyse
      // avant de voir le verdict — on garde toujours leadType=evaluation
      // (et la promesse de non-stockage côté API s'applique si défavorable).
      // Mode standard : on bascule sur market_info pour les défavorables
      // (newsletter consentie explicitement).
      const leadType =
        gated || verdict !== "defavorable" ? "evaluation" : "market_info";
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          consent,
          answers,
          leadType,
          ...getFbData(),
        }),
      });
      const data = await res.json();

      // Meta Pixel — Lead standard avec Advanced Matching
      const [firstNameRaw, ...lastParts] = name.trim().split(/\s+/);
      trackLeadWithMatching(
        {
          email: email.trim(),
          phone: phone.trim() || undefined,
          firstName: firstNameRaw,
          lastName: lastParts.join(" ") || undefined,
        },
        {
          content_category: "real_estate_evaluation",
          verdict,
          currency: "CAD",
        }
      );

      trackStep("soumis");

      onSubmitted({
        stored: !!data.stored,
        firstName: firstNameRaw,
      });
    } catch {
      setError("Ocurrió un error. Inténtelo de nuevo en unos segundos.");
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="
        mt-12
        rounded-3xl p-6 sm:p-8
        bg-white/[0.05]
        border border-[var(--color-slate-accent)]/20
        shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]
      "
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1 h-1 rounded-full bg-[var(--color-gold)]" />
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
          {gated
            ? "Desbloquear mi análisis"
            : verdict === "defavorable"
            ? "Actualizaciones del mercado"
            : "Análisis gratuito"}
        </span>
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl text-[var(--color-brand-100)] leading-tight text-balance">
        {gated
          ? "¿Dónde desea recibir su análisis gratuito?"
          : verdict === "defavorable"
          ? "¿Desea recibir las ventas recientes de su sector?"
          : "¿Dónde desea recibir un análisis gratuito de su propiedad?"}
      </h3>
      <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
        {gated
          ? "Recibirá aquí un análisis completo, totalmente gratuito."
          : verdict === "defavorable"
          ? "Le enviamos una actualización cuando el mercado de su sector cambia — sin presión."
          : "Reciba su plan personalizado para vender su propiedad."}
      </p>

      <div className="mt-6 space-y-3">
        <Field
          label="Correo electrónico"
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="maria@ejemplo.com"
        />
        <Field
          label="Su nombre"
          required
          autoComplete="given-name"
          value={name}
          onChange={setName}
          placeholder="María"
        />
        <Field
          label="Teléfono"
          required
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
          placeholder="(450) 555-0123"
          helper="Para que un agente pueda contactarle rápidamente."
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group select-none mt-5">
        <span className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="peer sr-only"
          />
          <span className="block w-5 h-5 rounded-md border border-[var(--color-slate-accent)]/40 bg-white/[0.08] peer-checked:bg-[var(--color-gold)] peer-checked:border-[var(--color-gold-soft)] transition-colors" />
          <svg
            className="absolute inset-0 m-auto w-3 h-3 text-[#0a0a0a] opacity-0 peer-checked:opacity-100 transition-opacity"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 6.5L4.5 9L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {!gated && verdict === "defavorable" ? (
            <>
              Acepto recibir las actualizaciones del mercado de mi sector
              por correo electrónico. <span className="text-[var(--color-gold-soft)]">Ningún
              agente me llamará — es solo información.</span>
            </>
          ) : (
            <>
              Acepto que {BRAND.teamName} me envíe mi análisis gratuito
              y pueda contactarme respecto a mi evaluación.
            </>
          )}
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-rose-600 text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="
          mt-6 w-full
          inline-flex items-center justify-center gap-2
          px-6 py-4 rounded-full text-base font-semibold
          bg-gradient-to-b from-[var(--color-gold-soft)] to-[var(--color-gold)]
          text-[#0a0a0a]
          shadow-[0_15px_40px_-10px_rgba(255,255,255,0.5)]
          hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.65)]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all
        "
      >
        {submitting ? (
          <>
            <Spinner /> Enviando…
          </>
        ) : (
          <>
            {gated
              ? "Ver mis resultados"
              : verdict === "defavorable"
              ? "Recibir las actualizaciones"
              : "Recibir mi análisis gratuito"}
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </motion.section>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  helper?: string;
}

function Field({ label, value, onChange, placeholder, type = "text", required, autoComplete, helper }: FieldProps) {
  return (
    <div>
      <label className="block">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 block">
          {label} {required && <span className="text-[var(--color-gold)]">*</span>}
        </span>
        <input
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full glass-card rounded-xl px-4 py-3
            text-[var(--color-brand-100)] placeholder:text-slate-400/60
            focus-within:border-[var(--color-brand-400)]/60
            transition-colors
            text-base
          "
        />
      </label>
      {helper && <p className="text-[11px] text-slate-500 mt-1.5">{helper}</p>}
    </div>
  );
}
