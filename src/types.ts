export type AnswerValue = 0 | 1 | 2;
export type QuizStep = 'intro' | 'quiz' | 'results';

export interface Question {
  id: number;
  themeId: number;
  themeName: string;
  title: string;
  description: string;
  examples?: string[];
}

export interface Theme {
  id: number;
  name: string;
  questionIds: number[];
}

export interface ScoreLevel {
  min: number;
  max: number;
  label: string;
  tagline: string;
  message: string;
  recommendations: string[];
  colorKey: 'mint' | 'amber' | 'coral-light' | 'coral';
}

export interface ThemeRecommendation {
  themeId: number;
  themeName: string;
  headline: string;
  actions: string[];
}

export interface Answers {
  [questionId: number]: AnswerValue;
}
