"use client";

import { motion } from "framer-motion";

interface Props {
  onWantsToSwitch: () => void;
  onCancel: () => void;
}

export default function ExistingBrokerBlocker({ onWantsToSwitch, onCancel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="
        rounded-3xl
        bg-gradient-to-br from-[var(--color-gold)]/[0.08] to-transparent
        border border-[var(--color-gold)]/40
        p-6 sm:p-7
      "
    >
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-[var(--color-gold)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            d="M10 2 L17 6 L17 11 C17 14.5 14 17.5 10 18 C6 17.5 3 14.5 3 11 L3 6 Z"
            strokeLinejoin="round"
          />
          <path d="M10 7 V11 M10 13.5 V13.6" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
          Restricción legal
        </span>
      </div>

      <h3 className="font-serif text-xl sm:text-2xl text-[var(--color-brand-100)] leading-tight text-balance">
        Ya tiene un contrato con un agente inmobiliario.
      </h3>
      <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
        Legalmente, no podemos ayudarle a evaluar una propiedad que ya está bajo
        contrato de corretaje con otro profesional. Es una
        protección tanto para usted como para el agente actual.
      </p>

      <p className="mt-5 text-sm text-slate-400 leading-relaxed">
        Si no está <strong className="text-[var(--color-brand-100)]">satisfecho(a)</strong> con
        su agente actual y desea explorar un cambio, de todas formas puede
        continuar su evaluación.
      </p>

      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={onWantsToSwitch}
          className="
            inline-flex items-center justify-center gap-2
            px-6 py-3.5 rounded-full text-sm font-medium
            bg-gradient-to-b from-[var(--color-gold-soft)] to-[var(--color-gold)]
            text-[#0a0a0a] font-semibold
            shadow-[0_15px_40px_-10px_rgba(255,255,255,0.5)]
            hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.65)]
            transition-all
          "
        >
          Quiero cambiar, no estoy satisfecho(a)
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="
            text-xs text-slate-500
            hover:text-slate-300
            transition-colors
            underline underline-offset-4 decoration-white/15
          "
        >
          Modificar mi respuesta
        </button>
      </div>
    </motion.div>
  );
}
