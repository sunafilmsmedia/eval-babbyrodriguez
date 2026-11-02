"use client";

import { motion } from "framer-motion";
import type { Answers } from "@/lib/types";

interface Props {
  answers: Answers;
  onRestart: () => void;
}

// Page terminale pour les visiteurs qui choisissent "Je ne veux pas vendre"
// dans la question de motivation. AUCUNE capture de lead n'est faite ici :
// ces visiteurs ne sont pas la cible commerciale et ne doivent pas finir
// dans le CRM.
//
// `answers` reste en prop pour cohérence avec l'orchestration de page.tsx
// (et un futur usage analytique éventuel), mais n'est pas transmis ailleurs.
export default function NoSellScreen({ answers: _answers, onRestart }: Props) {
  void _answers;

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl text-center"
      >
        {/* Icône cœur — bienveillant, pas commercial */}
        <div className="mx-auto mb-7 w-14 h-14 rounded-full bg-[var(--color-brand-500)]/15 border border-[var(--color-brand-400)]/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-[var(--color-brand-300)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M10 17 C5 13 2 10 2 7 C2 4.5 4 3 6 3 C7.5 3 9 4 10 5.5 C11 4 12.5 3 14 3 C16 3 18 4.5 18 7 C18 10 15 13 10 17 Z"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-3">
          Entendido
        </p>
        <h1 className="display-title text-[1.9rem] sm:text-5xl text-[var(--color-brand-100)] text-balance">
          ¿No tiene prisa por vender? Sin problema.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed text-balance max-w-md mx-auto">
          No le contactaremos. Vuelva cuando esté listo(a) para explorar
          seriamente la venta — el análisis seguirá disponible, gratis y en 3 minutos.
        </p>

        <button
          onClick={onRestart}
          className="
            mt-10 inline-flex items-center gap-2
            px-6 py-3 rounded-full text-sm font-medium
            bg-white/[0.06] border border-[var(--color-slate-accent)]/25
            text-[var(--color-brand-100)]
            hover:bg-white/[0.12] hover:border-[var(--color-slate-accent)]/45
            transition-all
          "
        >
          Volver al inicio
        </button>
      </motion.div>
    </div>
  );
}
