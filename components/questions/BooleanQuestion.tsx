"use client";

import { motion } from "framer-motion";

interface Props {
  value?: boolean;
  onChange: (v: boolean) => void;
}

export default function BooleanQuestion({ value, onChange }: Props) {
  const opts: { v: boolean; label: string }[] = [
    { v: true, label: "Sí" },
    { v: false, label: "No" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {opts.map((o, i) => {
        const selected = value === o.v;
        return (
          <motion.button
            key={String(o.v)}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onChange(o.v)}
            className={`
              rounded-2xl py-6 sm:py-8
              font-medium text-lg
              transition-all duration-200
              ${
                selected
                  ? "bg-gradient-to-br from-[var(--color-gold-soft)] to-[var(--color-gold)] border border-[var(--color-gold-soft)] text-[#0a0a0a] shadow-[0_12px_30px_-10px_rgba(255,255,255,0.5)]"
                  : "glass-card text-[var(--color-brand-100)] hover:border-[var(--color-slate-accent)]/30 hover:bg-white/[0.08]"
              }
            `}
          >
            {o.label}
          </motion.button>
        );
      })}
    </div>
  );
}
