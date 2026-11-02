import type { Answers } from "./types";

export type QuestionId =
  | "propertyType"
  | "sellingMotivation"
  | "yearsOwned"
  | "estimatedValue"
  | "hasChildren"
  | "childrenStatus"
  | "noChildrenPlan"
  | "financialProfile"
  | "hasContract"
  | "region";

export type QuestionKind =
  | "choice"
  | "number"
  | "currency"
  | "boolean"
  | "region";

export interface Choice<V extends string = string> {
  value: V;
  label: string;
  hint?: string;
}

export interface QuestionDef {
  id: QuestionId;
  kind: QuestionKind;
  title: string;
  subtitle?: string;
  choices?: Choice[];
  autoAdvance?: boolean;
  showIf?: (a: Answers) => boolean;
}

export const QUESTIONS: QuestionDef[] = [
  {
    id: "propertyType",
    kind: "choice",
    title: "¿Qué tipo de propiedad posee?",
    subtitle: "Empecemos por lo más sencillo.",
    autoAdvance: true,
    choices: [
      { value: "maison", label: "Casa unifamiliar", hint: "Separada o adosada" },
      { value: "condo", label: "Condominio", hint: "Propiedad en condominio" },
      { value: "plex", label: "Plex", hint: "Dúplex, tríplex, multivivienda" },
      { value: "chalet", label: "Chalet", hint: "Residencia secundaria" },
    ],
  },
  {
    id: "sellingMotivation",
    kind: "choice",
    title: "¿Por qué está pensando en vender?",
    subtitle: "Esto nos ayuda a entender su motivación.",
    autoAdvance: true,
    choices: [
      { value: "upsize", label: "Para pasar a un espacio más grande", hint: "Necesita más espacio" },
      { value: "downsize", label: "Para reducir o simplificar", hint: "Menos mantenimiento, más pequeño" },
      { value: "relocation", label: "Para mudarse a otro lugar", hint: "Otro sector u otra región" },
      { value: "no_sell", label: "No quiero vender", hint: "Solo tengo curiosidad" },
    ],
  },
  {
    id: "yearsOwned",
    kind: "number",
    title: "¿Hace cuántos años posee la propiedad?",
    subtitle: "Basta con un estimado.",
  },
  {
    id: "estimatedValue",
    kind: "currency",
    title: "¿Cuánto cree que vale hoy?",
    subtitle: "Su propia estimación — no necesita ser exacta.",
  },
  {
    id: "hasChildren",
    kind: "boolean",
    title: "¿Tiene hijos?",
    subtitle: "La dinámica familiar es un factor clave.",
    autoAdvance: true,
  },
  {
    id: "childrenStatus",
    kind: "choice",
    title: "¿En qué etapa están?",
    subtitle: "Elija la opción que más se parezca a su situación.",
    autoAdvance: true,
    showIf: (a) => a.hasChildren === true,
    choices: [
      { value: "partis", label: "Ya se independizaron" },
      { value: "partent_3_ans", label: "Se independizarán en los próximos 3 años" },
      { value: "encore_maison", label: "Todavía viven en casa" },
      { value: "manque_espace", label: "Nos falta espacio" },
    ],
  },
  {
    id: "noChildrenPlan",
    kind: "choice",
    title: "¿Piensa tener hijos pronto y necesitar más espacio?",
    subtitle: "Para anticipar mejor sus necesidades de espacio.",
    autoAdvance: true,
    showIf: (a) => a.hasChildren === false,
    choices: [
      { value: "oui_bientot", label: "Sí, pronto" },
      { value: "peut_etre", label: "Tal vez" },
      { value: "non", label: "No" },
    ],
  },
  {
    id: "financialProfile",
    kind: "choice",
    title: "¿Cuál es su situación financiera?",
    subtitle: "Para evaluar su flexibilidad frente a los prestamistas.",
    autoAdvance: true,
    choices: [
      { value: "salarie", label: "Empleo estable (asalariado)" },
      { value: "autonome", label: "Trabajador independiente" },
      { value: "entrepreneur", label: "Emprendedor" },
      { value: "placements", label: "Ingresos por inversiones" },
      { value: "retraite", label: "Jubilado" },
      { value: "transition", label: "En transición" },
    ],
  },
  {
    id: "hasContract",
    kind: "boolean",
    title: "¿Ya trabaja con un agente inmobiliario?",
    subtitle: "Pregunta legal — no podemos evaluar una propiedad que ya está bajo contrato.",
    autoAdvance: true,
  },
  {
    id: "region",
    kind: "region",
    title: "¿En qué sector se encuentra su propiedad?",
    subtitle: "Escriba su sector y selecciónelo de la lista.",
  },
];

export function getVisibleQuestions(answers: Answers): QuestionDef[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function isAnswered(q: QuestionDef, a: Answers): boolean {
  switch (q.id) {
    case "propertyType": return !!a.propertyType;
    case "sellingMotivation": return !!a.sellingMotivation;
    case "yearsOwned": return typeof a.yearsOwned === "number" && a.yearsOwned >= 0;
    case "estimatedValue": return typeof a.estimatedValue === "number" && a.estimatedValue > 0;
    case "hasChildren": return typeof a.hasChildren === "boolean";
    case "childrenStatus": return !!a.childrenStatus;
    case "noChildrenPlan": return !!a.noChildrenPlan;
    case "financialProfile": return !!a.financialProfile;
    case "hasContract":
      // "Non" = on peut continuer. "Oui" = bloqué SAUF si la personne
      // clique "Je veux changer" (wantsToSwitch = true).
      if (a.hasContract === false) return true;
      if (a.hasContract === true && a.wantsToSwitch === true) return true;
      return false;
    case "region": return !!a.region;
  }
}
