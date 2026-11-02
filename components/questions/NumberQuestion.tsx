"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  value?: number;
  onChange: (v: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

// Question à curseur SEUL : aucun champ texte — la personne DOIT glisser la barre
// pour choisir. La barre est volontairement grosse et évidente.
export default function NumberQuestion({
  value,
  onChange,
  min = 0,
  max = 60,
  step = 1,
  suffix = "años",
}: Props) {
  const touched = typeof value === "number";
  // Position du curseur : la valeur choisie, sinon un point de départ bas.
  const pos = touched ? (value as number) : Math.round((max - min) * 0.12) + min;
  const pct = ((pos - min) / (max - min)) * 100;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      {/* Grand chiffre piloté par la barre */}
      <div className="flex items-end justify-center gap-3 mb-2">
        <span
          className={`font-serif text-6xl sm:text-7xl leading-none tabular-nums transition-colors ${
            touched ? "text-[var(--color-gold-soft)]" : "text-slate-600"
          }`}
        >
          {pos}
        </span>
        <span className="text-lg text-slate-400 mb-2">{suffix}</span>
      </div>

      {/* Consigne d'usage — disparaît une fois la barre utilisée */}
      <div className="h-6 flex items-center justify-center">
        {!touched && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-gold-soft)] font-medium"
          >
            <motion.svg
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 6L3 10l4 4M13 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            Desliza la barra para elegir
          </motion.div>
        )}
      </div>

      {/* La barre — grosse, remplissage doré, gros bouton */}
      <div className="mt-4 px-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={pos}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Número de años"
          style={{
            background: `linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold) ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`,
          }}
          className="
            w-full appearance-none h-3 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--color-gold)]
            [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#0a0a0a]
            [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-[var(--color-gold-soft)]
            [&::-webkit-slider-thumb]:shadow-[0_6px_20px_-2px_rgba(212,175,55,0.6)]
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-gold)]
            [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#0a0a0a]
            [&::-moz-range-thumb]:shadow-[0_6px_20px_-2px_rgba(212,175,55,0.6)]
            [&::-moz-range-thumb]:cursor-grab
          "
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-3">
          <span>{min} año</span>
          <span>{max}+ años</span>
        </div>
      </div>
    </div>
  );
}
