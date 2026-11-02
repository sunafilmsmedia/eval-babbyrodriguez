"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

interface HeroProps {
  onStart: () => void;
}

// Police douce commune aux segments mis en valeur (serif italique, casse normale).
const SOFT = "font-serif italic font-normal normal-case tracking-normal";

// Rend le titre en enveloppant certains segments dans une police douce :
//  - `highlight` → or shimmer (rainbow doré)
//  - `soft` → doré doux
function renderTitle(title: string, highlight?: string, soft?: string) {
  const segs = [
    highlight ? { text: highlight, className: `${SOFT} ai-shimmer` } : null,
    soft ? { text: soft, className: `${SOFT} text-[var(--color-gold-soft)]` } : null,
  ].filter(Boolean) as { text: string; className: string }[];

  if (segs.length === 0) return title;

  const nodes: ReactNode[] = [];
  let rest = title;
  let key = 0;
  while (rest.length) {
    // Trouve le prochain segment à styler (le plus proche du début).
    let best: { idx: number; seg: (typeof segs)[number] } | null = null;
    for (const seg of segs) {
      const idx = rest.indexOf(seg.text);
      if (idx !== -1 && (best === null || idx < best.idx)) best = { idx, seg };
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (best.idx > 0) nodes.push(rest.slice(0, best.idx));
    nodes.push(
      <span key={key++} className={best.seg.className}>
        {best.seg.text}
      </span>
    );
    rest = rest.slice(best.idx + best.seg.text.length);
  }
  return <>{nodes}</>;
}

export default function Hero({ onStart }: HeroProps) {
  const h = BRAND.hero;
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-5 sm:px-8 pt-20 sm:pt-28 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl text-center"
      >
        {/* Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs sm:text-sm text-[var(--color-brand-200)] mb-7 sm:mb-9">
          <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--color-gold)] text-[var(--color-gold)] pulse-dot" />
          <span className="font-medium tracking-wide">{h.chip}</span>
        </div>

        {/* Titre H1 */}
        <h1 className="display-title text-[2.1rem] sm:text-5xl lg:text-6xl text-[var(--color-brand-100)] text-balance">
          {renderTitle(h.title, h.titleHighlight, h.titleSoft)}
        </h1>

        {/* Sous-titre */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto leading-relaxed text-balance">
          {h.subtitle}
        </p>

        {/* Hook signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 font-serif italic text-xl sm:text-2xl ai-shimmer inline-block"
        >
          {h.signature}
        </motion.p>

        {/* Divider doré */}
        <div className="mt-8 sm:mt-10 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 sm:mt-12 flex flex-col items-center gap-3"
        >
          <button
            onClick={onStart}
            className="
              group relative inline-flex items-center justify-center gap-2
              px-8 sm:px-10 py-4
              rounded-full
              bg-gradient-to-b from-[var(--color-gold-soft)] to-[var(--color-gold)]
              text-[#0a0a0a] font-semibold text-base
              shadow-[0_20px_50px_-15px_rgba(255,255,255,0.55),0_0_0_1px_rgba(0,0,0,0.15)_inset]
              hover:shadow-[0_25px_60px_-10px_rgba(255,255,255,0.7),0_0_0_1px_rgba(0,0,0,0.2)_inset]
              transition-all duration-300
              hover:-translate-y-0.5
              active:translate-y-0
            "
          >
            <span className="uppercase tracking-wide text-sm sm:text-base">{h.cta}</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="text-xs text-slate-500">{h.ctaHint}</p>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 uppercase tracking-[0.2em]"
      >
        {h.scrollHint}
      </motion.div>
    </section>
  );
}
