import { QUESTIONS, THEMES, SCORE_LEVELS, THEME_RECOMMENDATIONS } from '../data/questions';
import type { Answers, ScoreLevel, ThemeRecommendation } from '../types';

export function computeTotalScore(answers: Answers): number {
  return Object.values(answers).reduce((sum, val) => sum + val, 0);
}

export function getScoreLevel(score: number): ScoreLevel {
  return SCORE_LEVELS.find((l) => score >= l.min && score <= l.max) ?? SCORE_LEVELS[SCORE_LEVELS.length - 1];
}

export function computeThemeScore(themeId: number, answers: Answers): { score: number; max: number; percent: number } {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return { score: 0, max: 0, percent: 0 };
  const max = theme.questionIds.length * 2;
  const score = theme.questionIds.reduce((sum, qId) => sum + (answers[qId] ?? 0), 0);
  return { score, max, percent: max > 0 ? (score / max) * 100 : 0 };
}

export function getTriggeredThemeRecommendations(answers: Answers): ThemeRecommendation[] {
  return THEME_RECOMMENDATIONS.filter((rec) => {
    const { percent } = computeThemeScore(rec.themeId, answers);
    return percent >= 50;
  });
}

export function getTopActions(answers: Answers): string[] {
  // Map each answered question to its specific remediation action (1:1 index match within theme)
  const scored: { score: number; action: string }[] = [];

  for (const theme of THEMES) {
    const rec = THEME_RECOMMENDATIONS.find((r) => r.themeId === theme.id);
    if (!rec) continue;

    theme.questionIds.forEach((qId, idx) => {
      const score = answers[qId] ?? 0;
      if (score > 0 && idx < rec.actions.length) {
        scored.push({ score, action: rec.actions[idx] });
      }
    });
  }

  // Worst answers first (score 2 > score 1)
  scored.sort((a, b) => b.score - a.score);

  const actions = scored.slice(0, 3).map((s) => s.action);

  // Fallback for fully compliant users (all answers = 0)
  if (actions.length < 3) {
    const level = getScoreLevel(computeTotalScore(answers));
    for (const r of level.recommendations) {
      if (!actions.includes(r) && actions.length < 3) actions.push(r);
    }
  }

  return actions;
}

export function getThemeLabel(themeId: number): string {
  return THEMES.find((t) => t.id === themeId)?.name ?? '';
}

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const MAX_SCORE = QUESTIONS.length * 2;
