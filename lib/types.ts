export type PropertyType = "maison" | "condo" | "plex" | "chalet";

export type SellingMotivation = "upsize" | "downsize" | "relocation" | "no_sell";

export type ChildrenStatus = "partis" | "partent_3_ans" | "encore_maison" | "manque_espace";

export type NoChildrenPlan = "oui_bientot" | "peut_etre" | "non";

export type FinancialProfile =
  | "salarie"
  | "autonome"
  | "entrepreneur"
  | "placements"
  | "retraite"
  | "transition";

export type Region = {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
};

export interface Answers {
  propertyType?: PropertyType;
  sellingMotivation?: SellingMotivation;
  yearsOwned?: number;
  estimatedValue?: number;
  hasChildren?: boolean;
  childrenStatus?: ChildrenStatus;
  noChildrenPlan?: NoChildrenPlan;
  financialProfile?: FinancialProfile;
  // hasContract = true bloque le formulaire (la personne est déjà
  // sous contrat avec un autre courtier — légalement on ne peut pas
  // l'évaluer). wantsToSwitch = true permet de débloquer (l'utilisateur
  // veut changer de courtier).
  hasContract?: boolean;
  wantsToSwitch?: boolean;
  region?: string;
}

export type Verdict = "favorable" | "moyen" | "defavorable";

export interface ScoringResult {
  score: number;
  verdict: Verdict;
  factors: ScoringFactor[];
  metrics: {
    yearsOwned: number;
    estimatedValue: number;
  };
}

export interface ScoringFactor {
  label: string;
  delta: number;
  tone: "positive" | "negative" | "neutral";
}

export interface ReportStat {
  label: string;
  value: string;
  detail: string;
}

export interface ReportStep {
  title: string;
  description: string;
}

export interface Report {
  headline: string;
  summary: string;
  stats: ReportStat[];
  steps: ReportStep[];
  marketInsight: string;
}

export interface AnalyzeResponse {
  scoring: ScoringResult;
  report: Report;
  generatedBy: "claude" | "fallback";
}

export type LeadType = "evaluation" | "market_info";

export interface LeadPayload {
  name: string;
  phone?: string;
  email: string;
  consent: boolean;
  answers: Answers;
  leadType?: LeadType;
}
