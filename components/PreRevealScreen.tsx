"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type RevealChoice = "yes" | "no";

interface Props {
  onContinue: (choice: RevealChoice) => void;
}

// Délai avant que les boutons soient cliquables.
// Empêche les clics fantômes de l'étape précédente de traverser cet écran.
const CLICK_GUARD_MS = 700;

export default function PreRevealScreen({ onContinue }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), CLICK_GUARD_MS);
    return () => clearTimeout(t);
  }, []);

  const handleClick = (choice: RevealChoice) => {
    if (!ready) return;
    onContinue(choice);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 sm:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full text-center"
      >
        {/* Icône check */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 160, damping: 14 }}
          className="mx-auto mb-7 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/25 to-[var(--color-brand-500)]/15 border border-emerald-500/40 flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]"
        >
          <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 10L8 14L16 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-3">
          Análisis completo
        </p>
        <h1 className="display-title text-[2rem] sm:text-5xl lg:text-6xl text-[var(--color-brand-100)] text-balance">
          Su respuesta está lista.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed text-balance max-w-md mx-auto">
          Ingrese sus datos para desbloquear su respuesta y recibir su análisis
          completo, totalmente gratis.
        </p>

        {/* Bouton primaire — option recommandée */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={() => handleClick("yes")}
          disabled={!ready}
          className="
            group mt-10 w-full
            relative overflow-hidden
            rounded-2xl
            bg-gradient-to-b from-[var(--color-gold-soft)] to-[var(--color-gold)]
            text-[#0a0a0a]
            px-6 py-5
            shadow-[0_20px_50px_-15px_rgba(255,255,255,0.55)]
            hover:shadow-[0_25px_60px_-10px_rgba(255,255,255,0.7)]
            hover:-translate-y-0.5
            transition-all duration-300
            disabled:opacity-70 disabled:cursor-wait disabled:translate-y-0
          "
        >
          <span className="block font-medium text-base sm:text-lg">
            Ver mi respuesta
          </span>
          <span className="block text-xs sm:text-sm text-[#0a0a0a]/65 mt-1">
            Análisis completo y gratuito
          </span>
          <span className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
            {ready ? (
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#0a0a0a]/60 animate-pulse" />
                <span className="w-1 h-1 rounded-full bg-[#0a0a0a]/60 animate-pulse" style={{ animationDelay: "0.15s" }} />
                <span className="w-1 h-1 rounded-full bg-[#0a0a0a]/60 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </span>
            )}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
