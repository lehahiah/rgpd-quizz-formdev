import { Clock, FileText, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TOTAL_QUESTIONS } from '../utils/scoring';

interface Props {
  onStart: () => void;
}

export function Introduction({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Header */}
      <header className="py-3 px-6 bg-white border-b border-brand-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* FormDev — marque principale */}
          <img
            src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png"
            alt="FormDev"
            className="h-12 w-auto object-contain"
          />
          {/* FormaSwift — partenaire secondaire */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-text-muted font-medium hidden sm:block">En partenariat avec</span>
            <img
              src="https://www.formaswift.com/images/logo-formaswift.png"
              alt="FormaSwift"
              className="h-7 w-auto object-contain opacity-60"
            />
          </div>
        </div>
      </header>

      {/* Hero — 2-col layout on desktop */}
      <main id="main-content" className="flex-1 flex items-center px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left column: content ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary-light text-brand-primary-dark text-sm font-semibold border border-brand-border">
                Organisme de formation · Autodiagnostic RGPD
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-title text-4xl md:text-5xl font-bold text-brand-primary leading-tight mb-4">
              Votre RGPD{' '}
              <span className="text-brand-accent">dort-il</span>{' '}
              dans un placard&nbsp;?
            </h1>

            <p className="text-lg text-brand-text-muted mb-8 leading-relaxed">
              Vérifiez si vos accès, outils, fichiers, sous-traitants, formulaires et usages IA
              sont encore alignés avec vos pratiques actuelles.
            </p>

            {/* Feature list — compact on intro */}
            <ul className="space-y-3 mb-8 w-full max-w-sm mx-auto lg:mx-0">
              {[
                { icon: Clock,         label: '10 minutes',       sub: `${TOTAL_QUESTIONS} questions en 5 thèmes` },
                { icon: CheckCircle2,  label: 'Score instantané', sub: 'Niveau calculé automatiquement' },
                { icon: FileText,      label: 'Export PDF',       sub: 'Résultat et recommandations à conserver' },
                { icon: ShieldCheck,   label: 'Aucune donnée transmise', sub: 'Tout est calculé dans votre navigateur' },
              ].map(({ icon: Icon, label, sub }) => (
                <li key={label} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 w-8 h-8 rounded-lg bg-brand-accent-light flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-accent" />
                  </span>
                  <span>
                    <span className="font-semibold text-brand-text text-sm">{label}</span>
                    <span className="block text-xs text-brand-text-muted mt-0.5">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Privacy notice */}
            <div className="bg-brand-primary-light border border-brand-border rounded-xl px-4 py-3 mb-8 flex items-center gap-3 w-full max-w-sm mx-auto lg:mx-0 text-left">
              <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0" aria-hidden="true" />
              <p className="text-sm text-brand-primary-dark leading-relaxed">
                <strong>Cet outil ne vous demandera jamais de données personnelles.</strong>
              </p>
            </div>

            {/* CTA */}
            <div>
              <button
                onClick={onStart}
                className="group inline-flex items-center gap-3 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                Démarrer le diagnostic
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-brand-text-muted mt-3">
                Destiné aux organismes ayant déjà engagé une démarche RGPD.
              </p>
            </div>
          </div>

          {/* ── Right column: illustration ── */}
          {/* Place intro.png in /public to activate. SVG placeholder shown otherwise. */}
          <div className="hidden lg:flex items-center justify-center">
            <img
              src="/intro.png"
              alt="Illustration du diagnostic RGPD — quiz, score, PDF"
              className="w-full max-w-[520px] h-auto object-contain drop-shadow-sm"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

        </div>
      </main>

      {/* Feature cards — visible on mobile where illustration is hidden */}
      <section className="lg:hidden px-4 pb-10">
        <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Clock,        label: '10 minutes',       sub: `${TOTAL_QUESTIONS} questions en 5 thèmes` },
            { icon: CheckCircle2, label: 'Score instantané', sub: 'Résultat calculé automatiquement' },
            { icon: FileText,     label: 'Export PDF',       sub: 'Résultat à conserver' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-brand-border flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-brand-accent-light rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-accent" />
              </div>
              <p className="font-semibold text-brand-text text-sm">{label}</p>
              <p className="text-brand-text-muted text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-6 bg-white border-t border-brand-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-text-muted">
            Outil d'auto-évaluation pédagogique — Ne remplace pas l'analyse d'un DPO ou d'un conseil spécialisé.
          </p>
          <div className="flex items-center gap-3">
            <img src="https://www.form-dev.fr/wp-content/uploads/2025/06/formdev-logo-carre.png" alt="FormDev" className="h-8 w-auto object-contain opacity-50" />
            <span className="text-brand-border text-xs">×</span>
            <img src="https://www.formaswift.com/images/logo-formaswift.png" alt="FormaSwift" className="h-5 w-auto object-contain opacity-35" />
          </div>
        </div>
      </footer>
    </div>
  );
}
