"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { REGIONS } from "@/lib/regions";

interface Props {
  value?: string;
  onChange: (id: string) => void;
}

// Normalise pour une recherche insensible aux accents et à la casse.
const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function RegionSearch({ value, onChange }: Props) {
  const [query, setQuery] = useState("");

  // Une fois le secteur choisi : confirmation « Bien reçu » (le formulaire
  // enchaîne automatiquement vers l'analyse ~1,1 s plus tard). Le secteur peut
  // venir de la liste OU être un texte libre saisi par la personne.
  if (value) {
    const displayName = REGIONS.find((r) => r.id === value)?.name ?? value;
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 shadow-[0_16px_40px_-12px_rgba(16,185,129,0.55)] mb-5">
          <svg className="w-7 h-7 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4 10.5L8.5 15L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="font-serif text-2xl sm:text-3xl text-[var(--color-brand-100)]">
          ¡Recibido!
        </p>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Sector: <span className="font-medium text-[var(--color-brand-200)]">{displayName}</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">Iniciando su análisis…</p>
      </motion.div>
    );
  }

  const q = query.trim();
  const nq = norm(q);
  const matches = nq ? REGIONS.filter((r) => norm(r.name).includes(nq)) : REGIONS;

  // La personne peut toujours valider exactement ce qu'elle a écrit — même si
  // ce n'est pas dans la liste. On ne dit jamais « pas trouvé ».
  const exact = REGIONS.some((r) => norm(r.name) === nq);
  const showCustom = q.length >= 2 && !exact;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (matches.length === 1) onChange(matches[0].id);
    else if (q.length >= 2) onChange(q);
  };

  return (
    <div className="space-y-3">
      {/* Champ de recherche / saisie libre */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14L17 17" strokeLinecap="round" />
        </svg>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escriba su sector (ej. su ciudad, su barrio…)"
          className="
            w-full glass-card rounded-xl pl-11 pr-4 py-3.5
            text-[var(--color-brand-100)] placeholder:text-slate-400/70
            text-base
            focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40
          "
        />
      </div>

      {/* Liste : secteurs correspondants + option « utiliser ce que j'ai écrit » */}
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
        {matches.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onChange(r.id)}
            className="
              w-full text-left glass-card rounded-xl px-4 py-3
              flex items-center justify-between gap-3
              hover:bg-white/[0.08] hover:border-[var(--color-slate-accent)]/35
              transition-colors group
            "
          >
            <span className="font-medium text-[var(--color-brand-100)]">{r.name}</span>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-brand-300)] transition-colors shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}

        {showCustom && (
          <button
            type="button"
            onClick={() => onChange(q)}
            className="
              w-full text-left rounded-xl px-4 py-3
              flex items-center gap-3
              bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30
              hover:bg-[var(--color-gold)]/16
              transition-colors
            "
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-gold)] shrink-0">
              <svg className="w-3.5 h-3.5 text-[#0a0a0a]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M10 4v12M4 10h12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-[var(--color-brand-100)] truncate">
                Usar «&nbsp;{q}&nbsp;»
              </span>
              <span className="block text-[11px] text-slate-500">Su sector</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
