import { useState, useCallback, useRef, useEffect } from 'react';
import type { QuizStep, Answers, AnswerValue } from './types';
import { QUESTIONS } from './data/questions';
import { Introduction } from './components/Introduction';
import { QuizQuestion } from './components/QuizQuestion';
import { Results } from './components/Results';

export default function App() {
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to top on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex, step]);

  const advance = useCallback((index: number) => {
    if (index < QUESTIONS.length - 1) {
      setCurrentIndex(index + 1);
    } else {
      setStep('results');
    }
  }, []);

  const handleStart = useCallback(() => {
    setStep('quiz');
    setCurrentIndex(0);
  }, []);

  const handleAnswer = useCallback((value: AnswerValue) => {
    const question = QUESTIONS[currentIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

    // Cancel any pending advance before scheduling a new one
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    // Auto-advance after brief visual feedback (350ms)
    advanceTimer.current = setTimeout(() => {
      advance(currentIndex);
    }, 350);
  }, [currentIndex, advance]);

  const handleNext = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advance(currentIndex);
  }, [currentIndex, advance]);

  const handleBack = useCallback(() => {
    // Cancel any pending auto-advance
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    if (currentIndex === 0) {
      setStep('intro');
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAnswers({});
    setCurrentIndex(0);
    setStep('intro');
  }, []);

  if (step === 'intro') {
    return <Introduction onStart={handleStart} />;
  }

  if (step === 'quiz') {
    const question = QUESTIONS[currentIndex];
    return (
      <QuizQuestion
        question={question}
        questionIndex={currentIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onBack={handleBack}
        onNext={handleNext}
      />
    );
  }

  return <Results answers={answers} onRestart={handleRestart} />;
}
