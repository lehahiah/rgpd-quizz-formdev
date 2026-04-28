import { Download, RotateCcw, CheckCircle, AlertTriangle, AlertCircle, Info, ChevronRight, Calendar } from 'lucide-react';
import type { Answers } from '../types';
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

// Donut SVG ring for the score — blue/orange split matching illustrations
function ScoreDonut({ percent, size = 120 }: { percent: number; size?: number }) {
  const r = 44;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  const blueLen = (percent / 100) * circ;
  const orangeLen = circ - blueLen;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E6E6E6" strokeWidth="12" />
      {/* Orange: risk portion */}
      {orangeLen > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#F39207"
          strokeWidth="12"
          strokeDasharray={`${orangeLen} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${-90 + (blueLen / circ) * 360} ${cx} ${cy})`}
        />
      )}
      {/* Blue: compliant portion (drawn last, on top at start) */}
      {blueLen > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
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
      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium ${isHighRisk ? 'text-brand-text' : 'text-brand-text-muted'}`}>
          Thème {themeId}
        </span>
        <span className={`text-xs font-semibold ${isHighRisk ? 'text-brand-text' : 'text-brand-text-muted'}`}>
          {score}/{max}
        </span>
      </div>
      <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isHighRisk ? color : 'bg-slate-200'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function Results({ answers, onRestart }: Props) {
  const totalScore = computeTotalScore(answers);
  const level = getScoreLevel(totalScore);
  const cfg = colorConfig[level.colorKey];
  const LevelIcon = cfg.icon;
  const triggeredThemes = getTriggeredThemeRecommendations(answers);
  const topActions = getTopActions(answers);
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const scorePercent = Math.round((totalScore / MAX_SCORE) * 100);
  // "compliance" ratio = inverse of risk (lower score = more compliant)
  const compliancePercent = Math.round(((MAX_SCORE - totalScore) / MAX_SCORE) * 100);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <>
      {/* ── Screen view (hidden on print) ── */}
      <div className="min-h-screen bg-brand-bg print:hidden">
        {/* Header */}
        <div className="bg-white border-b border-brand-border px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            {/* FormDev — marque principale */}
            <div className="flex items-center gap-3">
              <img
                src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
                alt="FormDev"
                className="h-10 w-auto object-contain"
              />
              <span className="text-brand-border hidden sm:block">|</span>
              <span className="text-sm font-medium text-brand-text-muted hidden sm:block">Résultat du diagnostic RGPD</span>
            </div>
            {/* Date + FormaSwift partenaire */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-brand-text-muted">
                <Calendar className="w-3.5 h-3.5" />
                {today}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-text-muted hidden md:block">En partenariat avec</span>
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
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Score hero card — illustration left on desktop ── */}
            <div className={`rounded-2xl border-2 overflow-hidden ${cfg.bg} ${cfg.border}`}>
              <div className="flex flex-col md:flex-row">
                {/* Illustration panel — resultats.png */}
                <div className="hidden md:flex md:w-52 lg:w-60 shrink-0 items-center justify-center rounded-l-2xl overflow-hidden"
                  style={{ background: '#EBEBEB' }}>
                  <img
                    src="/resultats.png"
                    alt="Illustration des résultats"
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                </div>

                {/* Score content */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    {/* Donut + score digit */}
                    <div className="relative shrink-0 w-28 h-28 mx-auto sm:mx-0">
                      <ScoreDonut percent={compliancePercent} size={112} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-score text-2xl leading-none text-brand-primary">{totalScore}</span>
                        <span className="text-xs text-brand-text-muted font-medium">/{MAX_SCORE}</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      {/* Level badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${cfg.badge}`}>
                        <LevelIcon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                        {level.label}
                      </span>
                      <p className="font-title font-semibold text-lg text-brand-text leading-snug mb-2">{level.tagline}</p>
                      <p className="text-brand-text-muted text-sm leading-relaxed">{level.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme scores */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
              <h3 className="font-title font-semibold text-brand-primary mb-5">Score par thème</h3>
              <div className="space-y-4">
                {THEMES.map((theme) => {
                  const { score, max, percent } = computeThemeScore(theme.id, answers);
                  return (
                    <div key={theme.id}>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-sm text-brand-text font-medium pr-4">{theme.name}</span>
                        <span className="text-xs font-semibold text-brand-text-muted shrink-0">{score}/{max}</span>
                      </div>
                      <ThemeScoreBar themeId={theme.id} score={score} max={max} percent={percent} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 3 actions */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
              <h3 className="font-title font-semibold text-brand-primary mb-4">Vos 3 priorités immédiates</h3>
              <ol className="space-y-3">
                {topActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-accent text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-brand-text-muted text-sm leading-relaxed">{action}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Global recommendations */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6">
              <h3 className="font-title font-semibold text-brand-primary mb-4">Recommandations générales</h3>
              <ul className="space-y-2.5">
                {level.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <span className="text-brand-text-muted text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Theme-specific recommendations */}
            {triggeredThemes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-title font-semibold text-brand-primary">Points d'attention par thème</h3>
                {triggeredThemes.map((rec) => (
                  <div key={rec.themeId} className="bg-white rounded-2xl border border-brand-amber-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-brand-accent" />
                      <span className="text-xs font-bold text-brand-accent uppercase tracking-wide">{rec.themeName}</span>
                    </div>
                    <p className="text-brand-text font-medium text-sm mb-3">{rec.headline}</p>
                    <ul className="space-y-1.5">
                      {rec.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0 mt-2" />
                          <span className="text-brand-text-muted text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* CTA — Webinaires FormDev */}
            <div className="bg-brand-primary-dark rounded-2xl p-6 md:p-8 text-white">
              <h3 className="font-title font-semibold text-lg mb-2">Passez du diagnostic à l'action</h3>
              <p className="text-brand-teal-100 text-sm leading-relaxed mb-2">
                Vous avez identifié des points à vérifier ? Ne laissez pas ce diagnostic sans suite.
              </p>
              <p className="text-brand-teal-100 text-sm leading-relaxed mb-2">
                Formdev propose, en collaboration avec FormaSwift, des webinaires action pour aider les organismes de formation à remettre à jour leurs pratiques RGPD sans repartir de zéro.
              </p>
              <p className="text-brand-teal-100 text-sm leading-relaxed mb-2">
                Au programme : accès, fichiers, données anciennes, registre, formulaires, sous-traitants, IA et outils métier.
              </p>
              <p className="text-brand-teal-100 text-sm leading-relaxed mb-5">
                Les prochaines dates seront annoncées sur la page LinkedIn de Formdev.
              </p>
              <a
                href="https://www.linkedin.com/company/form-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-amber-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Suivre Formdev sur LinkedIn
              </a>
            </div>

            {/* CTA — FormaSwift accompagnement */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 md:p-8">
              <h3 className="font-title font-semibold text-brand-primary text-lg mb-2">Vous voulez aller plus vite ?</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed mb-5">
                FormaSwift peut vous accompagner pour structurer ou mettre à jour votre plan d'action RGPD et vos procédures internes, à partir de vos pratiques réelles : outils utilisés, accès, fichiers, archives, sous-traitants et durées de conservation.
              </p>
              <a
                href="https://www.formaswift.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Demander un rendez-vous avec FormaSwift
              </a>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pb-8">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Télécharger mon résultat (PDF)
              </button>
              <button
                onClick={onRestart}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-primary-light text-brand-primary font-semibold text-sm px-6 py-3 rounded-xl border border-brand-border transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Recommencer le diagnostic
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-brand-text-muted text-center pb-6 leading-relaxed max-w-xl mx-auto">
              Ce diagnostic et les ressources associées sont des outils pédagogiques. Ils ne remplacent pas une analyse complète par un DPO, un juriste ou un conseil spécialisé.
            </p>
          </div>
        </main>
      </div>

      {/* ── Print / PDF view ── */}
      <div className="hidden print:block print-document">
        <PrintDocument
          totalScore={totalScore}
          level={level}
          answers={answers}
          triggeredThemes={triggeredThemes}
          topActions={topActions}
          today={today}
          scorePercent={scorePercent}
        />
      </div>
    </>
  );
}

// ── Inline print document component ──
import type { ScoreLevel, ThemeRecommendation } from '../types';

interface PrintProps {
  totalScore: number;
  level: ScoreLevel;
  answers: Answers;
  triggeredThemes: ThemeRecommendation[];
  topActions: string[];
  today: string;
  scorePercent: number;
}

function PrintDocument({ totalScore, level, answers, triggeredThemes, topActions, today }: PrintProps) {
  return (
    <div style={{ fontFamily: 'Ubuntu Sans, Ubuntu, Arial, sans-serif', color: '#000000', maxWidth: '680px', margin: '0 auto', padding: '40px 32px' }}>
      {/* Header */}
      <div style={{ borderBottom: '2.5px solid #0A69B3', paddingBottom: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          {/* FormDev en premier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
              alt="FormDev"
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
            />
            <span style={{ color: '#E6E6E6', fontSize: '18px' }}>×</span>
            <img
              src="https://www.formaswift.com/images/logo-formaswift.png"
              alt="FormaSwift"
              style={{ height: '28px', width: 'auto', objectFit: 'contain', opacity: 0.55 }}
            />
            <span style={{ fontSize: '10px', color: '#4a4a4a', marginLeft: '4px' }}>En partenariat</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: '#4a4a4a' }}>
            <p style={{ margin: 0 }}>Généré le</p>
            <p style={{ margin: 0, fontWeight: 600, color: '#0A69B3' }}>{today}</p>
          </div>
        </div>
        <h1 style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '21px', fontWeight: 700, color: '#0A69B3', margin: 0, lineHeight: 1.3 }}>
          Votre RGPD reflète-t-il encore vos pratiques actuelles ?
        </h1>
        <p style={{ fontSize: '12px', color: '#F39207', fontWeight: 600, margin: '4px 0 0 0', letterSpacing: '0.5px' }}>
          Diagnostic RGPD · Organisme de formation
        </p>
      </div>

      {/* Score block */}
      <div style={{ background: '#dbeeff', border: '1.5px solid #E6E6E6', borderRadius: '12px', padding: '24px', marginBottom: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', background: 'white', border: '2px solid #93c5f5', borderRadius: '12px', padding: '16px 20px', minWidth: '90px' }}>
          <div style={{ fontFamily: 'Russo One, Montserrat, Arial, sans-serif', fontSize: '36px', fontWeight: 800, color: '#0A69B3', lineHeight: 1 }}>{totalScore}</div>
          <div style={{ fontSize: '12px', color: '#4a4a4a', marginTop: '2px' }}>/{MAX_SCORE}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#F39207', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
            {level.label}
          </div>
          <p style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0A69B3', margin: '0 0 6px 0' }}>{level.tagline}</p>
          <p style={{ fontSize: '13px', color: '#4a4a4a', margin: 0, lineHeight: 1.6 }}>{level.message}</p>
        </div>
      </div>

      {/* Theme scores */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '13px', fontWeight: 700, color: '#0A69B3', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Score par thème
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
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
                <tr key={theme.id} style={{ borderBottom: '1px solid #F7F7F7', background: isHigh ? '#FEF3DC' : 'transparent' }}>
                  <td style={{ padding: '8px', color: '#000000' }}>{theme.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 600, color: isHigh ? '#F39207' : '#0A69B3' }}>
                    {score}/{max}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '20px',
                      background: isHigh ? '#fde68a' : '#dbeeff',
                      color: isHigh ? '#d97706' : '#0A69B3',
                    }}>
                      {isHigh ? 'À revoir' : 'OK'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top 3 priorities */}
      <div style={{ marginBottom: '24px', background: '#dbeeff', border: '1.5px solid #E6E6E6', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '13px', fontWeight: 700, color: '#0A69B3', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Vos 3 priorités
        </h2>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#000000', lineHeight: 1.8 }}>
          {topActions.map((action, i) => (
            <li key={i} style={{ marginBottom: '6px' }}>{action}</li>
          ))}
        </ol>
      </div>

      {/* Global recommendations */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '13px', fontWeight: 700, color: '#0A69B3', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Recommandations générales
        </h2>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#4a4a4a', lineHeight: 1.8 }}>
          {level.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Theme-specific recommendations */}
      {triggeredThemes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '13px', fontWeight: 700, color: '#0A69B3', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Points d'attention par thème
          </h2>
          {triggeredThemes.map((rec) => (
            <div key={rec.themeId} style={{ marginBottom: '14px', padding: '14px 16px', background: '#FEF3DC', border: '1px solid #fde68a', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#F39207', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {rec.themeName}
              </p>
              <p style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0A69B3', margin: '0 0 8px 0' }}>{rec.headline}</p>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#4a4a4a', lineHeight: 1.7 }}>
                {rec.actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ background: '#073d6b', color: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '14px', fontWeight: 600, margin: '0 0 6px 0' }}>Pour aller plus loin</p>
        <p style={{ fontSize: '12px', color: '#93c5f5', margin: '0 0 10px 0', lineHeight: 1.6 }}>
          Inscrivez-vous au prochain webinaire ou contactez-nous pour un accompagnement personnalisé.
        </p>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#F39207', margin: 0 }}>
          julie@formaswift.com
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ borderTop: '1px solid #E6E6E6', paddingTop: '16px' }}>
        <p style={{ fontSize: '11px', color: '#4a4a4a', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
          Ce diagnostic est un outil d'auto-évaluation pédagogique. Il ne remplace pas une analyse complète par un DPO, un juriste ou un conseil spécialisé.
        </p>
      </div>
    </div>
  );
}
