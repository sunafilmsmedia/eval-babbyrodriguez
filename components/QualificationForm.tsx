"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { getVisibleQuestions, isAnswered } from "@/lib/questions";
import { trackStep } from "@/lib/track";
import { BRAND } from "@/lib/brand";
import type { Answers } from "@/lib/types";
import ProgressBar from "./ProgressBar";
import ChoiceQuestion from "./questions/ChoiceQuestion";
import BooleanQuestion from "./questions/BooleanQuestion";
import NumberQuestion from "./questions/NumberQuestion";
import CurrencyQuestion from "./questions/CurrencyQuestion";
import RegionSearch from "./questions/RegionSearch";
import ExistingBrokerBlocker from "./questions/ExistingBrokerBlocker";

interface Props {
  onComplete: (answers: Answers) => void;
  onNoSell: (answers: Answers) => void;
  onExit: () => void;
}

const AUTO_ADVANCE_MS = 220;

// Libellé d'étape (Clarity Scanner) par question. Le secteur est volontairement
// suivi sans valeur (peut être une saisie libre — jamais de texte en clair).
const STEP_NAMES: Record<string, string> = {
  propertyType: "type_propriete",
  sellingMotivation: "motivation_vente",
  yearsOwned: "annees_possession",
  estimatedValue: "valeur_estimee",
  hasChildren: "enfants",
  childrenStatus: "statut_enfants",
  noChildrenPlan: "plan_enfants",
  financialProfile: "profil_financier",
  hasContract: "courtier_existant",
  region: "secteur",
};
// Champs dont la valeur est un choix prédéfini → sûr à transmettre comme "value".
const CHOICE_FIELDS = new Set([
  "propertyType", "sellingMotivation", "hasChildren", "childrenStatus",
  "noChildrenPlan", "financialProfile", "hasContract",
]);

// Émet l'événement d'étape à partir de la réponse fournie (jamais de PII).
function trackAnswer(partial: Partial<Answers>) {
  const field = Object.keys(partial).find((k) => k in STEP_NAMES);
  if (!field) return;
  const raw = (partial as Record<string, unknown>)[field];
  const value = CHOICE_FIELDS.has(field) && raw != null ? String(raw) : undefined;
  trackStep(STEP_NAMES[field], value);
}

export default function QualificationForm({ onComplete, onNoSell, onExit }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(() => getVisibleQuestions(answers), [answers]);
  const current = visible[Math.min(index, visible.length - 1)];
  const isLast = index >= visible.length - 1;
  const canProceed = current ? isAnswered(current, answers) : false;

  // Le blocker "tu as déjà un courtier" remplace la question pour ce step.
  const isBlocked =
    current?.id === "hasContract" &&
    answers.hasContract === true &&
    answers.wantsToSwitch !== true;

  const submit = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    onComplete(answers);
  }, [answers, onComplete]);

  const goNext = useCallback(() => {
    // Étapes à avance manuelle (nombre / montant) : on suit le passage ici.
    // Les choix à auto-avance sont déjà suivis dans updateAndMaybeAdvance.
    if (current && !current.autoAdvance) {
      trackStep(STEP_NAMES[current.id] ?? current.id);
    }
    setDirection(1);
    if (isLast) {
      submit();
    } else {
      setIndex((i) => Math.min(visible.length - 1, i + 1));
    }
  }, [current, isLast, submit, visible.length]);

  const goPrev = useCallback(() => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const updateAndMaybeAdvance = useCallback(
    (partial: Partial<Answers>, autoAdvance: boolean, delayMs: number = AUTO_ADVANCE_MS) => {
      // Calculé de façon SYNCHRONE (pas via le callback updater de setAnswers) :
      // React ne garantit pas que ce callback s'exécute avant la lecture de
      // nextAnswers qui suit, ce qui causait un échec silencieux de l'auto-avance.
      const nextAnswers: Answers = { ...answers, ...partial };
      if ("hasChildren" in partial) {
        if (partial.hasChildren === true) delete nextAnswers.noChildrenPlan;
        if (partial.hasChildren === false) delete nextAnswers.childrenStatus;
      }
      // Réinitialiser wantsToSwitch si on change la réponse à hasContract
      if ("hasContract" in partial && partial.hasContract !== true) {
        delete nextAnswers.wantsToSwitch;
      }
      setAnswers(nextAnswers);

      // Court-circuit : si la personne dit qu'elle ne veut pas vendre,
      // on saute le reste du questionnaire.
      if (partial.sellingMotivation === "no_sell") {
        trackStep("motivation_vente", "no_sell");
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = setTimeout(() => {
          onNoSell(nextAnswers);
        }, AUTO_ADVANCE_MS);
        return;
      }

      // Bloque l'auto-advance quand hasContract=true sans wantsToSwitch :
      // le composant ExistingBrokerBlocker prend le relais.
      const wouldBeBlocked =
        nextAnswers.hasContract === true && nextAnswers.wantsToSwitch !== true;

      if (autoAdvance && !wouldBeBlocked) {
        trackAnswer(partial);
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = setTimeout(() => {
          setDirection(1);
          setIndex((i) => {
            const visibleAfter = getVisibleQuestions(nextAnswers);
            if (i >= visibleAfter.length - 1) {
              onComplete(nextAnswers);
              return i;
            }
            return i + 1;
          });
        }, delayMs);
      }
    },
    [answers, onComplete, onNoSell]
  );

  if (!current) return null;

  return (
    <div className="min-h-screen flex flex-col px-5 sm:px-8 py-6 sm:py-10 max-w-2xl mx-auto w-full">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
        <button
          onClick={onExit}
          className="text-xs text-slate-500 hover:text-[var(--color-brand-200)] transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 2L2 6L5 10M2 6H10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver
        </button>
        <div className="font-serif italic text-sm text-[var(--color-brand-300)]">
          {BRAND.teamName}
        </div>
      </header>

      <ProgressBar current={index} total={visible.length} />

      {/* Slide container */}
      <div className="flex-1 mt-10 sm:mt-14 relative">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {!isBlocked && (
              <div className="mb-7 sm:mb-9">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--color-brand-100)] leading-tight tracking-tight text-balance">
                  {current.title}
                </h2>
                {current.subtitle && (
                  <p className="mt-2.5 text-sm sm:text-base text-slate-400">{current.subtitle}</p>
                )}
              </div>
            )}

            <QuestionRenderer
              questionId={current.id}
              answers={answers}
              onUpdate={updateAndMaybeAdvance}
              autoAdvance={!!current.autoAdvance}
              choices={current.choices}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <footer className="mt-8 sm:mt-10 pt-6 border-t border-[var(--color-slate-accent)]/10">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="
              px-5 py-2.5 rounded-full text-sm font-medium
              text-slate-400 hover:text-[var(--color-brand-200)]
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors
            "
          >
            Anterior
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={!canProceed}
              className="
                inline-flex items-center gap-2
                px-6 sm:px-8 py-3 rounded-full text-sm font-medium
                bg-gradient-to-b from-[var(--color-gold-soft)] to-[var(--color-gold)]
                text-[#0a0a0a] font-semibold
                shadow-[0_15px_40px_-10px_rgba(255,255,255,0.5)]
                hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.65)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
            >
              Ver mi análisis
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed}
              className="
                inline-flex items-center gap-2
                px-6 py-2.5 rounded-full text-sm font-medium
                bg-white/[0.06] border border-[var(--color-slate-accent)]/25
                text-[var(--color-brand-100)]
                hover:bg-white/[0.12] hover:border-[var(--color-slate-accent)]/45
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all
              "
            >
              Siguiente
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

interface RendererProps {
  questionId: string;
  answers: Answers;
  choices?: { value: string; label: string; hint?: string }[];
  autoAdvance: boolean;
  onUpdate: (partial: Partial<Answers>, autoAdvance: boolean, delayMs?: number) => void;
}

function QuestionRenderer({
  questionId,
  answers,
  choices,
  autoAdvance,
  onUpdate,
}: RendererProps) {
  switch (questionId) {
    case "propertyType":
      return (
        <ChoiceQuestion
          choices={choices!}
          value={answers.propertyType}
          onChange={(v) => onUpdate({ propertyType: v as Answers["propertyType"] }, autoAdvance)}
        />
      );
    case "sellingMotivation":
      return (
        <ChoiceQuestion
          choices={choices!}
          value={answers.sellingMotivation}
          onChange={(v) => onUpdate({ sellingMotivation: v as Answers["sellingMotivation"] }, autoAdvance)}
        />
      );
    case "yearsOwned":
      return (
        <NumberQuestion
          value={answers.yearsOwned}
          onChange={(v) => onUpdate({ yearsOwned: v }, false)}
          min={0}
          max={60}
          suffix="años"
        />
      );
    case "estimatedValue":
      return (
        <CurrencyQuestion
          value={answers.estimatedValue}
          onChange={(v) => onUpdate({ estimatedValue: v }, false)}
          placeholder="450 000"
          helper="Sin juicios — es solo para calibrar el análisis."
        />
      );
    case "hasChildren":
      return (
        <BooleanQuestion
          value={answers.hasChildren}
          onChange={(v) => onUpdate({ hasChildren: v }, autoAdvance)}
        />
      );
    case "childrenStatus":
      return (
        <ChoiceQuestion
          choices={choices!}
          value={answers.childrenStatus}
          onChange={(v) => onUpdate({ childrenStatus: v as Answers["childrenStatus"] }, autoAdvance)}
        />
      );
    case "noChildrenPlan":
      return (
        <ChoiceQuestion
          choices={choices!}
          value={answers.noChildrenPlan}
          onChange={(v) => onUpdate({ noChildrenPlan: v as Answers["noChildrenPlan"] }, autoAdvance)}
        />
      );
    case "financialProfile":
      return (
        <ChoiceQuestion
          choices={choices!}
          value={answers.financialProfile}
          onChange={(v) => onUpdate({ financialProfile: v as Answers["financialProfile"] }, autoAdvance)}
        />
      );
    case "hasContract":
      // Quand hasContract=true sans wantsToSwitch, on remplace la question
      // par le blocker légal qui propose "Je veux changer" pour débloquer.
      if (answers.hasContract === true && answers.wantsToSwitch !== true) {
        return (
          <ExistingBrokerBlocker
            onWantsToSwitch={() => onUpdate({ wantsToSwitch: true }, true)}
            onCancel={() => onUpdate({ hasContract: undefined, wantsToSwitch: undefined }, false)}
          />
        );
      }
      return (
        <BooleanQuestion
          value={answers.hasContract}
          onChange={(v) => onUpdate({ hasContract: v }, autoAdvance)}
        />
      );
    case "region":
      return (
        <RegionSearch
          value={answers.region}
          onChange={(id) => onUpdate({ region: id }, true, 1100)}
        />
      );
    default:
      return null;
  }
}
