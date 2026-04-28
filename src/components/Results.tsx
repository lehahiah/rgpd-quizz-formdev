import { useRef, useState } from 'react';
import { Download, RotateCcw, CheckCircle, AlertTriangle, AlertCircle, Info, ChevronRight, Calendar } from 'lucide-react';
import type { Answers, ScoreLevel, ThemeRecommendation } from '../types';
import { THEMES } from '../data/questions';
import {
  computeTotalScore,
  getScoreLevel,
  computeThemeScore,
  getTriggeredThemeRecommendations,
  getTopActions,
  MAX_SCORE,
} from '../utils/scoring';

interface Props {
  answers: Answers;
  onRestart: () => void;
}

function ScoreDonut({ percent, size = 120 }: { percent: number; size?: number }) {
  const r = 44;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  const blueLen = (percent / 100) * circ;
  const orangeLen = circ - blueLen;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E6E6E6" strokeWidth="12" />
      {orangeLen > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#F39207"
          strokeWidth="12"
          strokeDasharray={`${orangeLen} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${-90 + (blueLen / circ) * 360} ${cx} ${cy})`}
        />
      )}
      {blueLen > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#0A69B3"
          strokeWidth="12"
          strokeDasharray={`${blueLen} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
    </svg>
  );
}

const colorConfig = {
  mint: {
    bg: 'bg-brand-primary-light',
    border: 'border-brand-border',
    score: 'text-brand-primary',
    ring: 'ring-brand-teal-100',
    icon: CheckCircle,
    iconColor: 'text-brand-primary',
    badge: 'bg-brand-primary-light text-brand-primary',
  },
  amber: {
    bg: 'bg-brand-accent-light',
    border: 'border-brand-amber-200',
    score: 'text-brand-accent',
    ring: 'ring-brand-amber-100',
    icon: Info,
    iconColor: 'text-brand-accent',
    badge: 'bg-brand-accent-light text-brand-accent',
  },
  'coral-light': {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    score: 'text-orange-600',
    ring: 'ring-orange-100',
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
    badge: 'bg-orange-100 text-orange-700',
  },
  coral: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    score: 'text-red-600',
    ring: 'ring-red-100',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
  },
};

const themeBarColors = [
  'bg-brand-primary',
  'bg-brand-action',
  'bg-brand-accent',
  'bg-brand-primary-dark',
  'bg-brand-teal-200',
];

function ThemeScoreBar({ themeId, score, max, percent }: { themeId: number; score: number; max: number; percent: number }) {
  const color = themeBarColors[themeId - 1] ?? 'bg-brand-primary';
  const isHighRisk = percent >= 50;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isHighRisk ? 'text-brand-text' : 'text-brand-text-muted'}`}>
          Theme {themeId}
        </span>
        <span className={`text-xs font-semibold ${isHighRisk ? 'text-brand-text' : 'text-brand-text-muted'}`}>
          {score}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-border">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isHighRisk ? color : 'bg-slate-200'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function Results({ answers, onRestart }: Props) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const totalScore = computeTotalScore(answers);
  const level = getScoreLevel(totalScore);
  const cfg = colorConfig[level.colorKey];
  const LevelIcon = cfg.icon;
  const triggeredThemes = getTriggeredThemeRecommendations(answers);
  const topActions = getTopActions(answers);
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const compliancePercent = Math.round(((MAX_SCORE - totalScore) / MAX_SCORE) * 100);

  const handleExportPDF = async () => {
    if (!pdfRef.current || isExporting) return;

    setIsExporting(true);

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const filename = `diagnostic-rgpd-${today.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase()}.pdf`;

      await html2pdf()
        .set({
          margin: [8, 10, 8, 10],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2.2,
            useCORS: true,
            backgroundColor: '#ffffff',
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
          pagebreak: {
            mode: ['css', 'legacy'],
            avoid: ['.pdf-avoid-break', '.pdf-card', '.pdf-cta', 'table', 'tr'],
          },
        })
        .from(pdfRef.current)
        .save();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-brand-bg">
        <div className="border-b border-brand-border bg-white px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
                alt="FormDev"
                className="h-10 w-auto object-contain"
              />
              <span className="hidden text-brand-border sm:block">|</span>
              <span className="hidden text-sm font-medium text-brand-text-muted sm:block">Resultat du diagnostic RGPD</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 text-xs text-brand-text-muted sm:flex">
                <Calendar className="h-3.5 w-3.5" />
                {today}
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-brand-text-muted md:block">En partenariat avec</span>
                <img
                  src="https://www.formaswift.com/images/logo-formaswift.png"
                  alt="FormaSwift"
                  className="h-6 w-auto object-contain opacity-55"
                />
              </div>
            </div>
          </div>
        </div>

        <main id="main-content" className="px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className={`overflow-hidden rounded-2xl border-2 ${cfg.bg} ${cfg.border}`}>
              <div className="flex flex-col md:flex-row">
                <div
                  className="hidden shrink-0 items-center justify-center overflow-hidden rounded-l-2xl md:flex md:w-52 lg:w-60"
                  style={{ background: '#F3F4F6' }}
                >
                  <img
                    src="/resultats.png"
                    alt="Illustration des resultats"
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      const parent = (e.currentTarget as HTMLImageElement).parentElement;
                      if (parent) parent.style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex-1 p-6 md:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0">
                      <ScoreDonut percent={compliancePercent} size={112} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-score text-2xl leading-none text-brand-primary">{totalScore}</span>
                        <span className="text-xs font-medium text-brand-text-muted">/{MAX_SCORE}</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${cfg.badge}`}>
                        <LevelIcon className={`h-3.5 w-3.5 ${cfg.iconColor}`} />
                        {level.label}
                      </span>
                      <p className="mb-2 font-title text-lg font-semibold leading-snug text-brand-text">{level.tagline}</p>
                      <p className="text-sm leading-relaxed text-brand-text-muted">{level.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
              <h3 className="mb-5 font-title font-semibold text-brand-primary">Score par theme</h3>
              <div className="space-y-4">
                {THEMES.map((theme) => {
                  const { score, max, percent } = computeThemeScore(theme.id, answers);
                  return (
                    <div key={theme.id}>
                      <div className="mb-1.5 flex items-start justify-between">
                        <span className="pr-4 text-sm font-medium text-brand-text">{theme.name}</span>
                        <span className="shrink-0 text-xs font-semibold text-brand-text-muted">{score}/{max}</span>
                      </div>
                      <ThemeScoreBar themeId={theme.id} score={score} max={max} percent={percent} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-title font-semibold text-brand-primary">Vos 3 priorites immediates</h3>
              <ol className="space-y-3">
                {topActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-brand-text-muted">{action}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-title font-semibold text-brand-primary">Recommandations generales</h3>
              <ul className="space-y-2.5">
                {level.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                    <span className="text-sm text-brand-text-muted">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {triggeredThemes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-title font-semibold text-brand-primary">Points d&apos;attention par theme</h3>
                {triggeredThemes.map((rec) => (
                  <div key={rec.themeId} className="rounded-2xl border border-brand-amber-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-brand-accent" />
                      <span className="text-xs font-bold uppercase tracking-wide text-brand-accent">{rec.themeName}</span>
                    </div>
                    <p className="mb-3 text-sm font-medium text-brand-text">{rec.headline}</p>
                    <ul className="space-y-1.5">
                      {rec.actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                          <span className="text-sm text-brand-text-muted">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl bg-brand-primary-dark p-6 text-white md:p-8">
              <h3 className="mb-2 font-title text-lg font-semibold">Passez du diagnostic a l&apos;action</h3>
              <p className="mb-2 text-sm leading-relaxed text-brand-teal-100">
                Vous avez identifie des points a verifier ? Ne laissez pas ce diagnostic sans suite.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-brand-teal-100">
                Formdev propose, en collaboration avec FormaSwift, des webinaires action pour aider les organismes de
                formation a remettre a jour leurs pratiques RGPD sans repartir de zero.
              </p>
              <p className="mb-2 text-sm leading-relaxed text-brand-teal-100">
                Au programme : acces, fichiers, donnees anciennes, registre, formulaires, sous-traitants, IA et outils metier.
              </p>
              <p className="mb-5 text-sm leading-relaxed text-brand-teal-100">
                Les prochaines dates seront annoncees sur la page LinkedIn de Formdev.
              </p>
              <a
                href="https://www.linkedin.com/company/form-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-amber-600"
              >
                Suivre Formdev sur LinkedIn
              </a>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
              <h3 className="mb-2 font-title text-lg font-semibold text-brand-primary">Vous voulez aller plus vite ?</h3>
              <p className="mb-5 text-sm leading-relaxed text-brand-text-muted">
                FormaSwift peut vous accompagner pour structurer ou mettre a jour votre plan d&apos;action RGPD et vos
                procedures internes, a partir de vos pratiques reelles : outils utilises, acces, fichiers, archives,
                sous-traitants et durees de conservation.
              </p>
              <a
                href="https://www.formaswift.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
              >
                Demander un rendez-vous avec FormaSwift
              </a>
            </div>

            <div className="flex flex-col justify-center gap-3 pb-8 sm:flex-row">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-dark disabled:cursor-wait disabled:bg-brand-primary/70"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Generation du PDF...' : 'Telecharger mon resultat (PDF)'}
              </button>
              <button
                onClick={onRestart}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary-light"
              >
                <RotateCcw className="h-4 w-4" />
                Recommencer le diagnostic
              </button>
            </div>

            <p className="mx-auto max-w-xl pb-6 text-center text-xs leading-relaxed text-brand-text-muted">
              Ce diagnostic et les ressources associees sont des outils pedagogiques. Ils ne remplacent pas une analyse
              complete par un DPO, un juriste ou un conseil specialise.
            </p>
          </div>
        </main>
      </div>

      <div className="pdf-capture-shell" aria-hidden="true">
        <div ref={pdfRef} className="pdf-capture-page">
          <PrintDocument
            totalScore={totalScore}
            level={level}
            answers={answers}
            triggeredThemes={triggeredThemes}
            topActions={topActions}
            today={today}
          />
        </div>
      </div>
    </>
  );
}

interface PrintProps {
  totalScore: number;
  level: ScoreLevel;
  answers: Answers;
  triggeredThemes: ThemeRecommendation[];
  topActions: string[];
  today: string;
}

const pdfAvoidBreakStyle = {
  breakInside: 'avoid',
  pageBreakInside: 'avoid',
  WebkitColumnBreakInside: 'avoid',
} as const;

function PrintDocument({ totalScore, level, answers, triggeredThemes, topActions, today }: PrintProps) {
  return (
    <div
      className="pdf-section"
      style={{
        fontFamily: 'Ubuntu Sans, Ubuntu, Arial, sans-serif',
        color: '#000000',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 28px',
      }}
    >
      <div
        className="pdf-section pdf-avoid-break"
        style={{ borderBottom: '2.5px solid #0A69B3', paddingBottom: '16px', marginBottom: '20px', ...pdfAvoidBreakStyle }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            minHeight: '72px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minHeight: '52px' }}>
            <img
              src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
              alt="FormDev"
              crossOrigin="anonymous"
              style={{ height: '52px', width: '52px', objectFit: 'contain', display: 'block' }}
            />
            <span style={{ color: '#0A69B3', fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>×</span>
            <img
              src="https://www.formaswift.com/images/logo-formaswift.png"
              alt="FormaSwift"
              crossOrigin="anonymous"
              style={{ height: '34px', width: '150px', objectFit: 'contain', opacity: 1, display: 'block' }}
            />
            </div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#0A69B3', letterSpacing: '0.4px' }}>
              FormDev × FormaSwift
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#4a4a4a', paddingTop: '6px' }}>
            <p style={{ margin: 0 }}>Généré le</p>
            <p style={{ margin: 0, fontWeight: 600, color: '#0A69B3' }}>{today}</p>
          </div>
        </div>
        <h1
          style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontSize: '21px',
            fontWeight: 700,
            color: '#0A69B3',
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Votre RGPD reflète-t-il encore vos pratiques actuelles ?
        </h1>
        <p style={{ fontSize: '12px', color: '#F39207', fontWeight: 600, margin: '4px 0 0 0', letterSpacing: '0.5px' }}>
          Diagnostic RGPD · Organisme de formation
        </p>
      </div>

      <div
        className="pdf-card pdf-avoid-break"
        style={{
          background: '#dbeeff',
          border: '1.5px solid #E6E6E6',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '18px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          ...pdfAvoidBreakStyle,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            background: 'white',
            border: '2px solid #93c5f5',
            borderRadius: '12px',
            padding: '14px 18px',
            minWidth: '90px',
          }}
        >
          <div
            style={{
              fontFamily: 'Russo One, Montserrat, Arial, sans-serif',
              fontSize: '36px',
              fontWeight: 800,
              color: '#0A69B3',
              lineHeight: 1,
            }}
          >
            {totalScore}
          </div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginTop: '2px' }}>/{MAX_SCORE}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#F39207',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            {level.label}
          </div>
          <p
            style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A69B3',
              margin: '0 0 6px 0',
            }}
          >
            {level.tagline}
          </p>
          <p style={{ fontSize: '13px', color: '#4a4a4a', margin: 0, lineHeight: 1.55 }}>{level.message}</p>
        </div>
      </div>

      <div className="pdf-section pdf-card pdf-avoid-break" style={{ marginBottom: '18px', ...pdfAvoidBreakStyle }}>
        <h2
          style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0A69B3',
            marginBottom: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
          }}
        >
          Score par thème
        </h2>
        <table className="pdf-avoid-break" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', ...pdfAvoidBreakStyle }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #E6E6E6' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px', color: '#4a4a4a', fontWeight: 600 }}>Thème</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#4a4a4a', fontWeight: 600, width: '80px' }}>Score</th>
              <th style={{ textAlign: 'center', padding: '6px 8px', color: '#4a4a4a', fontWeight: 600, width: '80px' }}>Niveau</th>
            </tr>
          </thead>
          <tbody>
            {THEMES.map((theme) => {
              const { score, max, percent } = computeThemeScore(theme.id, answers);
              const isHigh = percent >= 50;

              return (
                <tr
                  key={theme.id}
                  className="pdf-avoid-break"
                  style={{ borderBottom: '1px solid #F7F7F7', background: isHigh ? '#FEF3DC' : 'transparent', ...pdfAvoidBreakStyle }}
                >
                  <td style={{ padding: '8px', color: '#000000' }}>{theme.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 600, color: isHigh ? '#F39207' : '#0A69B3' }}>
                    {score}/{max}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        background: isHigh ? '#fde68a' : '#dbeeff',
                        color: isHigh ? '#d97706' : '#0A69B3',
                      }}
                    >
                      {isHigh ? 'À revoir' : 'OK'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="pdf-card pdf-avoid-break"
        style={{ marginBottom: '18px', background: '#dbeeff', border: '1.5px solid #E6E6E6', borderRadius: '12px', padding: '18px', ...pdfAvoidBreakStyle }}
      >
        <h2
          style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0A69B3',
            marginBottom: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
          }}
        >
          Vos 3 priorités
        </h2>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#000000', lineHeight: 1.7 }}>
          {topActions.map((action, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {action}
            </li>
          ))}
        </ol>
      </div>

      <div className="pdf-card pdf-avoid-break" style={{ marginBottom: '18px', ...pdfAvoidBreakStyle }}>
        <h2
          style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0A69B3',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
          }}
        >
          Recommandations générales
        </h2>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#4a4a4a', lineHeight: 1.7 }}>
          {level.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {triggeredThemes.length > 0 && (
        <div className="pdf-section" style={{ marginBottom: '18px' }}>
          <h2
            style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              color: '#0A69B3',
              marginBottom: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}
          >
            Points d&apos;attention par thème
          </h2>
          {triggeredThemes.map((rec) => (
            <div
              key={rec.themeId}
              className="pdf-card pdf-avoid-break"
              style={{
                marginBottom: '12px',
                padding: '12px 14px',
                background: '#FEF3DC',
                border: '1px solid #fde68a',
                borderRadius: '10px',
                ...pdfAvoidBreakStyle,
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#F39207',
                  margin: '0 0 6px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {rec.themeName}
              </p>
              <p
                style={{
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0A69B3',
                  margin: '0 0 8px 0',
                }}
              >
                {rec.headline}
              </p>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#4a4a4a', lineHeight: 1.6 }}>
                {rec.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div
        className="pdf-card pdf-avoid-break pdf-cta"
        style={{
          background: '#073d6b',
          color: 'white',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '18px',
          textAlign: 'center',
          ...pdfAvoidBreakStyle,
        }}
      >
        <p style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '14px', fontWeight: 600, margin: '0 0 6px 0' }}>
          Pour aller plus loin
        </p>
        <p style={{ fontSize: '12px', color: '#93c5f5', margin: '0 0 8px 0', lineHeight: 1.55 }}>
          Inscrivez-vous au prochain webinaire ou contactez-nous pour un accompagnement personnalisé.
        </p>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#F39207', margin: 0 }}>julie@formaswift.com</p>
      </div>

      <div className="pdf-section pdf-avoid-break" style={{ borderTop: '1px solid #E6E6E6', paddingTop: '14px', ...pdfAvoidBreakStyle }}>
        <p style={{ fontSize: '11px', color: '#4a4a4a', lineHeight: 1.55, margin: 0, textAlign: 'center' }}>
          Ce diagnostic est un outil d&apos;auto-évaluation pédagogique. Il ne remplace pas une analyse complète par un
          DPO, un juriste ou un conseil spécialisé.
        </p>
      </div>
    </div>
  );
}
