import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Info, ShieldCheck, ExternalLink } from 'lucide-react';
import type { Question, AnswerValue, Answers } from '../types';
import { ANSWER_OPTIONS, FORMDEV_RGPD_INFO } from '../data/questions';
import { TOTAL_QUESTIONS } from '../utils/scoring';
import { ProgressBar } from './ProgressBar';

interface Props {
  question: Question;
  questionIndex: number; // 0-based
  answers: Answers;
  onAnswer: (value: AnswerValue) => void;
  onBack: () => void;
  onNext: () => void;
}

const answerStyles: Record<number, { idle: string; selected: string; indicator: string; indicatorSelected: string }> = {
  0: {
    idle: 'border-brand-border bg-white hover:border-brand-teal-200 hover:bg-brand-primary-light',
    selected: 'border-brand-primary bg-brand-primary-light ring-2 ring-brand-teal-100',
    indicator: 'border-2 border-slate-300 bg-white',
    indicatorSelected: 'border-brand-primary bg-brand-primary',
  },
  1: {
    idle: 'border-brand-border bg-white hover:border-brand-amber-200 hover:bg-brand-accent-light',
    selected: 'border-brand-accent bg-brand-accent-light ring-2 ring-brand-amber-100',
    indicator: 'border-2 border-slate-300 bg-white',
    indicatorSelected: 'border-brand-accent bg-brand-accent',
  },
  2: {
    idle: 'border-brand-border bg-white hover:border-red-300 hover:bg-red-50',
    selected: 'border-red-400 bg-red-50 ring-2 ring-red-100',
    indicator: 'border-2 border-slate-300 bg-white',
    indicatorSelected: 'border-red-400 bg-red-400',
  },
};

export function QuizQuestion({ question, questionIndex, answers, onAnswer, onBack, onNext }: Props) {
  const currentAnswer = answers[question.id];
  const hasAnswer = currentAnswer !== undefined;
  const isLast = questionIndex === TOTAL_QUESTIONS - 1;
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to question heading when question changes (RGAA 12.8)
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-brand-border px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            {/* FormDev — marque principale */}
            <img
              src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
              alt="FormDev"
              className="h-10 w-auto object-contain"
            />
            {/* FormaSwift — partenaire secondaire */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-text-muted hidden sm:block">En partenariat avec</span>
              <img
                src="https://www.formaswift.com/images/logo-formaswift.png"
                alt="FormaSwift"
                className="h-6 w-auto object-contain opacity-60"
              />
            </div>
          </div>
          <ProgressBar current={questionIndex + 1} />
        </div>
      </header>

      <main id="main-content" className="flex-1 flex flex-col items-center px-4 py-6 pb-28 sm:pb-10 lg:pb-10">
        {/* 2-col layout on desktop: question left, illustration right */}
        <div className="w-full max-w-5xl flex gap-8 items-start">
        <div className="w-full max-w-2xl flex-1 min-w-0">
          {/* Theme badge */}
          <div className="mb-4" aria-hidden="true">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary-dark text-xs font-bold tracking-wide uppercase border border-brand-border">
              Thème {question.themeId} / 5 · {question.themeName}
            </span>
          </div>

          {/* Question card */}
          <section
            aria-label={`Question ${questionIndex + 1} sur ${TOTAL_QUESTIONS}`}
            className="bg-white rounded-2xl shadow-sm border border-brand-border p-5 sm:p-7 mb-4"
          >
            {/* Question heading — receives focus on change */}
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-title text-lg sm:text-xl font-semibold text-brand-text leading-snug mb-4 outline-none"
            >
              {question.title}
            </h1>

            {question.description && (
              <div
                className="flex gap-2.5 bg-brand-primary-light border border-brand-border rounded-xl p-3.5 mb-5"
                role="note"
                aria-label="Précision"
              >
                <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-brand-text-muted leading-relaxed">{question.description}</p>
              </div>
            )}

            {question.examples && question.examples.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-2" id={`examples-label-${question.id}`}>
                  Exemples
                </p>
                <ul
                  className="flex flex-wrap gap-2"
                  aria-labelledby={`examples-label-${question.id}`}
                >
                  {question.examples.map((ex) => (
                    <li
                      key={ex}
                      className="px-2.5 py-1 bg-brand-primary-light text-brand-primary-dark rounded-lg text-xs font-medium list-none"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Answers — RGAA radio group semantics */}
            <fieldset>
              <legend className="sr-only">
                Choisissez votre réponse pour : {question.title}
              </legend>
              <div className="space-y-2.5" role="radiogroup">
                {ANSWER_OPTIONS.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  const styles = answerStyles[opt.value];
                  const inputId = `q${question.id}-opt${opt.value}`;

                  return (
                    <label
                      key={opt.value}
                      htmlFor={inputId}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none min-h-[56px] ${
                        isSelected ? styles.selected : styles.idle
                      }`}
                    >
                      {/* Visually styled radio */}
                      <span
                        className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-all duration-150 ${
                          isSelected ? styles.indicatorSelected : styles.indicator
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-white block" />
                        )}
                      </span>

                      {/* Native radio (visually hidden but accessible) */}
                      <input
                        type="radio"
                        id={inputId}
                        name={`question-${question.id}`}
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => onAnswer(opt.value)}
                        className="sr-only"
                      />

                      <span
                        className={`font-medium text-sm sm:text-base flex-1 ${
                          isSelected ? 'text-brand-text' : 'text-brand-text-muted'
                        }`}
                      >
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>

          {/* FormDev info card — shown only on question 22 */}
          {question.id === 22 && (
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
                  alt="FormDev"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wide">
                  {FORMDEV_RGPD_INFO.title}
                </span>
              </div>
              <p className="text-sm text-brand-text-muted leading-relaxed mb-3">{FORMDEV_RGPD_INFO.text}</p>
              <ul className="space-y-1.5 mb-4">
                {FORMDEV_RGPD_INFO.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-1.5" aria-hidden="true" />
                    <span className="text-sm text-brand-text-muted">{bullet}</span>
                  </li>
                ))}
              </ul>
              <a
                href={FORMDEV_RGPD_INFO.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
              >
                {FORMDEV_RGPD_INFO.linkLabel}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}

          {/* Privacy assurance */}
          <div className="flex items-center gap-2 justify-center mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" aria-hidden="true" />
            <p className="text-xs text-brand-text-muted">
              Cet outil ne vous demandera jamais de données personnelles.
            </p>
          </div>
        </div>

        {/* Illustration panel — quizz.png — desktop only */}
        <aside className="hidden lg:flex shrink-0 w-72 xl:w-80 sticky top-24 self-start">
          <div className="w-full rounded-2xl bg-[#F4F4F5] flex items-center justify-center p-4 min-h-[420px]">
            <img
              src="/quizz.png"
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-contain max-h-96"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
              }}
            />
          </div>
        </aside>

        </div>
      </main>

      {/* Bottom navigation — fixed on mobile, static on desktop */}
      <nav
        aria-label="Navigation du questionnaire"
        className="fixed sm:relative bottom-0 left-0 right-0 bg-white border-t border-brand-border px-4 py-3 sm:border-none sm:bg-transparent sm:py-0 sm:pb-8 z-10"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            aria-label={questionIndex === 0 ? "Retour à l'introduction" : "Question précédente"}
            className="flex items-center gap-2 text-brand-text-muted hover:text-brand-primary-dark font-medium text-sm transition-colors px-4 py-3 rounded-xl hover:bg-brand-primary-light min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Précédent</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasAnswer}
            aria-label={
              !hasAnswer
                ? 'Sélectionnez une réponse pour continuer'
                : isLast
                ? 'Voir mon résultat'
                : 'Question suivante'
            }
            aria-disabled={!hasAnswer}
            className={`flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 min-h-[44px] ${
              hasAnswer
                ? 'bg-brand-primary hover:bg-brand-primary-dark text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isLast ? 'Voir mon résultat' : 'Suivant'}</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>
  );
}
