"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl text-center"
      >
        {/* Pulse anneau */}
        <div className="relative mx-auto mb-10 w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[var(--color-gold)]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[var(--color-gold)]/20" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold-soft)] to-[var(--color-gold)] shadow-[0_8px_30px_-4px_rgba(255,255,255,0.5)]" />
        </div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-brand-300)] mb-5">
          Análisis en curso
        </p>

        <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl ai-shimmer-fast leading-tight text-balance">
          La IA está evaluando su situación
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-sm text-slate-400"
        >
          Unos segundos — combinamos su plusvalía, su patrimonio y su situación
          para darle una respuesta honesta.
        </motion.p>

        {/* Petits points qui dansent */}
        <div className="mt-10 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-2 h-2 rounded-full bg-[var(--color-brand-300)]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
