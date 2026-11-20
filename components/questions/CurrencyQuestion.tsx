"use client";

import { useEffect, useState } from "react";
import { groupedNumber } from "@/lib/format";

interface Props {
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  helper?: string;
}

export default function CurrencyQuestion({
  value,
  onChange,
  placeholder = "350 000",
  helper,
}: Props) {
  const [display, setDisplay] = useState<string>(value ? groupedNumber(value) : "");
  // Pendant la frappe, on affiche les chiffres BRUTS (sans séparateur de
  // milliers) : reformater à chaque touche réinsère un "." au milieu de la
  // chaîne et déplace le curseur, ce qui bloquait la saisie au-delà d'un
  // certain nombre de chiffres sur plusieurs claviers (notamment mobile).
  // Le format groupé (ex. "450.000") n'est appliqué qu'au blur, pour la
  // lisibilité une fois la saisie terminée.
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) {
      setDisplay(typeof value === "number" ? groupedNumber(value) : "");
    }
  }, [value, editing]);

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl sm:text-4xl text-[var(--color-gold)]">$</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={display}
          onFocus={() => {
            setEditing(true);
            setDisplay(typeof value === "number" ? String(value) : "");
          }}
          onBlur={() => setEditing(false)}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, "");
            setDisplay(digitsOnly);
            onChange(digitsOnly ? parseInt(digitsOnly, 10) : undefined);
          }}
          placeholder={placeholder}
          className="
            flex-1 font-serif text-4xl sm:text-5xl text-[var(--color-brand-100)] bg-transparent
            placeholder:text-[var(--color-slate-400)]/50 focus:outline-none w-full
            tracking-wide
          "
        />
        <span className="text-sm text-[var(--color-slate-400)]">CAD</span>
      </div>
      {helper && <p className="text-xs text-[var(--color-slate-500)] mt-3">{helper}</p>}
    </div>
  );
}
