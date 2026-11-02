"use client";

import { motion } from "framer-motion";
import type { Choice } from "@/lib/questions";

interface Props {
  choices: Choice[];
  value?: string;
  onChange: (v: string) => void;
}

export default function ChoiceQuestion({ choices, value, onChange }: Props) {
  return (
    <div className="grid gap-3">
      {choices.map((c, i) => {
        const selected = value === c.value;
        return (
          <motion.button
            key={c.value}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onChange(c.value)}
            className={`
              group relative text-left
              rounded-2xl px-5 py-4 sm:py-5
              transition-all duration-200
              ${
                selected
                  ? "bg-gradient-to-br from-[var(--color-gold-soft)] to-[var(--color-gold)] border border-[var(--color-gold-soft)] shadow-[0_12px_30px_-10px_rgba(255,255,255,0.5)]"
                  : "glass-card hover:border-[var(--color-slate-accent)]/30 hover:bg-white/[0.08]"
              }
            `}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className={`font-medium ${selected ? "text-[#0a0a0a]" : "text-[var(--color-brand-100)]"}`}>
                  {c.label}
                </p>
                {c.hint && (
                  <p className={`text-xs mt-0.5 ${selected ? "text-[#0a0a0a]/70" : "text-slate-400"}`}>{c.hint}</p>
                )}
              </div>
              <span
                className={`
                  shrink-0 w-5 h-5 rounded-full border transition-all
                  ${
                    selected
                      ? "bg-[#0a0a0a] border-[#0a0a0a] shadow-[0_0_10px_rgba(0,0,0,0.35)]"
                      : "border-[var(--color-slate-accent)]/35 group-hover:border-[var(--color-slate-accent)]/55"
                  }
                `}
                aria-hidden
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
