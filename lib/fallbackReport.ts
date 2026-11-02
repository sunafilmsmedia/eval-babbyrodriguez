import type { Answers, Report, ScoringResult } from "./types";
import { formatCurrency } from "./format";
import { BRAND, brokersInlineNames } from "./brand";

const VERDICT_HEADLINE = {
  favorable: "¡Es el momento ideal!",
  moyen: "¡Está listo(a) para vender!",
  defavorable: "Todavía no está listo(a).",
} as const;

const PROPERTY_LABEL: Record<string, string> = {
  maison: "Casa unifamiliar",
  condo: "Condominio",
  plex: "Plex",
  chalet: "Chalet",
};

const MOTIVATION_LABEL: Record<string, string> = {
  upsize: "Pasar a un espacio más grande",
  downsize: "Reducir / simplificar",
  relocation: "Mudarse a otro lugar",
  no_sell: "Sin venta prevista",
};

export function buildFallbackReport(answers: Answers, scoring: ScoringResult): Report {
  const { score, verdict, metrics } = scoring;

  const summaryByVerdict = {
    favorable: `Con ${metrics.yearsOwned} año${metrics.yearsOwned > 1 ? "s" : ""} de posesión y su situación actual, todas las señales apuntan hacia una venta ventajosa. Es poco común tener una alineación tan completa — aproveche esta ventana de oportunidad mientras está abierta.`,
    moyen: `Ha acumulado un buen patrimonio y su situación es favorable. Algunas optimizaciones previas podrían maximizar su retorno, pero puede avanzar claramente hacia poner su propiedad en el mercado.`,
    defavorable: `Algunos elementos todavía frenan la oportunidad — patrimonio, situación familiar o financiera. Es mejor consolidar su posición antes de poner la propiedad en el mercado. Vuelva a consultarnos en 12 a 24 meses.`,
  };

  const marketInsightByVerdict = {
    favorable: `El mercado de ${BRAND.region} sigue sostenido por la demanda de compradores de ${BRAND.city} y los grandes centros urbanos. Las propiedades bien preparadas suelen venderse en menos de 45 días.`,
    moyen: `El mercado de ${BRAND.region} está en transición: los compradores se toman un poco más de tiempo, pero las buenas propiedades siempre encuentran comprador al precio justo.`,
    defavorable:
      "El mercado actual favorece más a los compradores en ciertos segmentos. Esperar puede permitirle capitalizar una recuperación en las valoraciones.",
  };

  const stats = [
    {
      label: "Puntaje de oportunidad",
      value: `${score}/100`,
      detail:
        verdict === "favorable"
          ? "Condiciones generalmente reunidas."
          : verdict === "moyen"
          ? "Por optimizar antes de poner en el mercado."
          : "Mejor esperar.",
    },
    {
      label: "Años de posesión",
      value: `${metrics.yearsOwned} año${metrics.yearsOwned > 1 ? "s" : ""}`,
      detail:
        metrics.yearsOwned >= 6
          ? "Patrimonio bien establecido."
          : metrics.yearsOwned >= 3
          ? "Patrimonio en construcción."
          : "Patrimonio aún joven.",
    },
    {
      label: "Valor estimado",
      value: metrics.estimatedValue ? formatCurrency(metrics.estimatedValue) : "—",
      detail: "Según su estimación actual del mercado.",
    },
    {
      label: "Motivación",
      value: answers.sellingMotivation ? MOTIVATION_LABEL[answers.sellingMotivation] : "—",
      detail: `Tipo: ${answers.propertyType ? PROPERTY_LABEL[answers.propertyType] : "—"}`,
    },
  ];

  const stepsFavorable = [
    {
      title: "Preparar su expediente financiero",
      description:
        "Reunir sus documentos hipotecarios y fiscales para evaluar rápidamente su neto después de la venta.",
    },
    {
      title: "Análisis comparativo de mercado (CMA)",
      description: `${brokersInlineNames()} le enviará un análisis comparativo de las ventas más recientes en su sector.`,
    },
    {
      title: "Plan de comercialización",
      description:
        "Fotos profesionales, home staging ligero, estrategia multiplataforma adaptada a su tipo de propiedad.",
    },
    {
      title: "Estrategia de reubicación",
      description:
        "Planificamos la transición antes de la venta para evitar cualquier presión al firmar una oferta.",
    },
  ];

  const stepsMoyen = [
    {
      title: "Aclarar su objetivo financiero",
      description:
        "Definir el neto deseado después de la venta para validar si el mercado actual lo permite.",
    },
    {
      title: "Optimizar la propiedad",
      description:
        "Identificar 2-3 mejoras de alto impacto (pintura, luminosidad, espacios exteriores).",
    },
    {
      title: "Probar el valor",
      description:
        "Un análisis comparativo reciente le dará un rango realista antes de incurrir en gastos.",
    },
    {
      title: "Decidir juntos el momento",
      description:
        "Si las cifras no son las esperadas, esperar de 6 a 12 meses puede marcar una diferencia notable.",
    },
  ];

  const stepsDefavorable = [
    {
      title: "Mantener su patrimonio trabajando",
      description:
        "Seguir pagando su hipoteca refuerza su posición para la próxima ventana de oportunidad.",
    },
    {
      title: "Seguir el mercado de lejos",
      description:
        "Podemos enviarle una actualización anual sin ningún compromiso, únicamente a modo informativo.",
    },
    {
      title: "Mejorar el valor percibido",
      description:
        "Pequeñas mejoras específicas que aumentan el valor sin sobreinvertir.",
    },
    {
      title: "Reevaluar en 12 a 24 meses",
      description:
        "Sus datos de contacto serán eliminados como prometido. Vuelva a consultarnos cuando esté listo(a).",
    },
  ];

  const steps =
    verdict === "favorable" ? stepsFavorable : verdict === "moyen" ? stepsMoyen : stepsDefavorable;

  return {
    headline: VERDICT_HEADLINE[verdict],
    summary: summaryByVerdict[verdict],
    stats,
    steps,
    marketInsight: marketInsightByVerdict[verdict],
  };
}
