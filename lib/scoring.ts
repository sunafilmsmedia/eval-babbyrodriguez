import type { Answers, ScoringFactor, ScoringResult, Verdict } from "./types";

const BASE_SCORE = 50;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Umbrales :
//  > 65   → favorable      "¡Es el momento ideal!"
//  50-65  → moyen          "¡Está listo para vender!"
//  < 50   → defavorable    "Todavía no está listo..."
function verdictFor(score: number): Verdict {
  if (score > 65) return "favorable";
  if (score >= 50) return "moyen";
  return "defavorable";
}

export function computeScoring(answers: Answers): ScoringResult {
  const factors: ScoringFactor[] = [];
  let score = BASE_SCORE;

  const years = Math.max(0, answers.yearsOwned ?? 0);
  const value = Math.max(0, answers.estimatedValue ?? 0);

  // Années de possession (proxy d'équité accumulée)
  if (years >= 10) {
    score += 15;
    factors.push({
      label: `Patrimonio bien establecido (${years} años de posesión)`,
      delta: 15,
      tone: "positive",
    });
  } else if (years >= 6) {
    score += 10;
    factors.push({
      label: `Patrimonio sólido (${years} años de posesión)`,
      delta: 10,
      tone: "positive",
    });
  } else if (years >= 3) {
    score += 2;
    factors.push({
      label: `Patrimonio en construcción (${years} años)`,
      delta: 2,
      tone: "neutral",
    });
  } else if (years > 0) {
    score -= 10;
    factors.push({
      label: `Posesión reciente (${years} años) — patrimonio limitado`,
      delta: -10,
      tone: "negative",
    });
  }

  // Motivation de vente (signal le plus fort de la nouvelle version)
  switch (answers.sellingMotivation) {
    case "relocation":
      score += 14;
      factors.push({
        label: "Mudanza planificada — intención clara",
        delta: 14,
        tone: "positive",
      });
      break;
    case "upsize":
      score += 12;
      factors.push({
        label: "Necesidad de espacio identificada — momento natural para mudarse",
        delta: 12,
        tone: "positive",
      });
      break;
    case "downsize":
      score += 11;
      factors.push({
        label: "Deseo de simplificar — momento natural para vender",
        delta: 11,
        tone: "positive",
      });
      break;
    // "no_sell" est court-circuité avant le scoring — n'arrive pas ici
  }

  // Situation familiale
  if (answers.childrenStatus === "partis") {
    score += 10;
    factors.push({
      label: "Nido vacío — momento natural para vender",
      delta: 10,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "partent_3_ans") {
    score += 6;
    factors.push({
      label: "Hijos en transición hacia la independencia",
      delta: 6,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "manque_espace") {
    score += 8;
    factors.push({
      label: "Necesidad de espacio adicional identificada",
      delta: 8,
      tone: "positive",
    });
  } else if (answers.childrenStatus === "encore_maison") {
    score -= 2;
    factors.push({
      label: "Hijos todavía en casa — la estabilidad es prioritaria",
      delta: -2,
      tone: "neutral",
    });
  }

  if (answers.noChildrenPlan === "oui_bientot") {
    score += 5;
    factors.push({
      label: "Planea ampliar la familia pronto",
      delta: 5,
      tone: "positive",
    });
  } else if (answers.noChildrenPlan === "peut_etre") {
    score += 1;
    factors.push({
      label: "Planes familiares en evaluación",
      delta: 1,
      tone: "neutral",
    });
  }

  // Profil financier
  switch (answers.financialProfile) {
    case "salarie":
    case "retraite":
      score += 10;
      factors.push({
        label: "Perfil financiero estable ante los prestamistas",
        delta: 10,
        tone: "positive",
      });
      break;
    case "placements":
      score += 8;
      factors.push({
        label: "Ingresos por inversiones — buena flexibilidad",
        delta: 8,
        tone: "positive",
      });
      break;
    case "autonome":
    case "entrepreneur":
      score += 4;
      factors.push({
        label: "Ingresos independientes — se recomienda 2 años de historial para los prestamistas",
        delta: 4,
        tone: "neutral",
      });
      break;
    case "transition":
      score -= 12;
      factors.push({
        label: "Período de transición — prudencia antes de comprometerse",
        delta: -12,
        tone: "negative",
      });
      break;
  }

  const finalScore = Math.round(clamp(score, 0, 100));
  return {
    score: finalScore,
    verdict: verdictFor(finalScore),
    factors,
    metrics: {
      yearsOwned: years,
      estimatedValue: value,
    },
  };
}
