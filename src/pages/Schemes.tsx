import { useState, useMemo } from 'react';
import {
  Landmark, Search, CheckCircle2, FileText, IndianRupee, Calendar, ExternalLink,
  Phone, ChevronDown, X, Users, Shield, ArrowRight, Tag, Lightbulb,
} from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { GOVERNMENT_SCHEMES, SCHEME_CATEGORIES } from '@/lib/data';
import type { Scheme } from '@/lib/types';

export function Schemes() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Scheme | null>(null);

  const filtered = useMemo(() => {
    return GOVERNMENT_SCHEMES.filter((s) => {
      const matchCat = category === 'All' || s.category === category;
      const title = lang === 'te' ? (s.title_te ?? s.title) : lang === 'hi' ? (s.title_hi ?? s.title) : s.title;
      const matchQ = !query ||
        title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        (s.tags ?? []).some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQ;
    });
  }, [query, category, lang]);

  const schemeIcon = (cat: string) => {
    const icons: Record<string, string> = {
      Agriculture: '🌾', 'Women Welfare': '👩', Housing: '🏠', Healthcare: '🏥',
      Scholarships: '🎓', 'Pension Schemes': '👴', Employment: '💼', Insurance: '🛡️',
    };
    return icons[cat] ?? '📋';
  };

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'ప్రభుత్వ పథకాలు' : lang === 'hi' ? 'सरकारी योजनाएँ' : 'Government Schemes'}
        subtitle={lang === 'te'
          ? 'ఆంధ్రప్రదేశ్ & కేంద్ర ప్రభుత్వ సంక్షేమ పథకాలు — అర్హత, ప్రయోజనాలు, దరఖాస్తు దశలు'
          : lang === 'hi'
            ? 'AP और केंद्र सरकार की कल्याणकारी योजनाएँ — पात्रता, लाभ, आवेदन चरण'
            : 'AP & Central government welfare schemes — eligibility, benefits, how to apply'}
        icon={Landmark}
        image="https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12">
        {/* Stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Landmark, label: lang === 'te' ? 'మొత్తం పథకాలు' : lang === 'hi' ? 'कुल योजनाएँ' : 'Total Schemes', value: GOVERNMENT_SCHEMES.length },
            { icon: Users, label: lang === 'te' ? 'వర్గాలు' : 'Categories', value: SCHEME_CATEGORIES.length - 1 },
            { icon: IndianRupee, label: lang === 'te' ? 'ఆర్థిక సహాయం' : 'Financial Aid', value: '₹13.5K+' },
            { icon: Shield, label: lang === 'te' ? 'బీమా కవర్' : 'Insurance Cover', value: '₹5L' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'te' ? 'పథకం పేరు లేదా కీవర్డ్ వెతకండి...' : lang === 'hi' ? 'योजना खोजें...' : 'Search scheme name or keyword...'}
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? (lang === 'te' ? 'అన్నీ' : lang === 'hi' ? 'सभी' : 'All') : cat}
            </button>
          ))}
        </div>

        {/* Scheme cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            {lang === 'te' ? 'మీ వెతుకులాటకు అనుగుణమైన పథకాలు లేవు.' : lang === 'hi' ? 'कोई योजना नहीं मिली।' : 'No schemes match your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((scheme) => {
              const title = lang === 'te' ? (scheme.title_te ?? scheme.title) : lang === 'hi' ? (scheme.title_hi ?? scheme.title) : scheme.title;
              const isOpen = expanded === scheme.id;
              return (
                <Card key={scheme.id} className="p-5 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-2xl shrink-0">
                      {schemeIcon(scheme.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{scheme.category}</span>
                        {scheme.tags?.slice(0, 1).map((t) => (
                          <span key={t} className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{t}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">{scheme.description}</p>

                  {/* Quick benefits preview */}
                  <div className="flex items-center gap-2 text-xs text-brand-700 dark:text-brand-300 font-medium mb-3">
                    <IndianRupee className="w-4 h-4" />
                    <span className="line-clamp-1">{scheme.benefits.split('.')[0]}</span>
                  </div>

                  {/* Tags */}
                  {scheme.tags && scheme.tags.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {scheme.tags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                          <Tag className="w-2.5 h-2.5" />{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expandable quick details */}
                  {isOpen && (
                    <div className="space-y-3 mb-4 animate-fade-in-fast border-t border-slate-100 dark:border-slate-800 pt-3">
                      <DetailRow icon={Users} label={lang === 'te' ? 'అర్హత' : lang === 'hi' ? 'पात्रता' : 'Eligibility'} value={scheme.eligibility} />
                      <DetailRow icon={FileText} label={lang === 'te' ? 'పత్రాలు' : lang === 'hi' ? 'दस्तावेज़' : 'Documents'} value={scheme.documents} />
                      <DetailRow icon={IndianRupee} label={lang === 'te' ? 'ప్రయోజనాలు' : lang === 'hi' ? 'लाभ' : 'Benefits'} value={scheme.benefits} />
                      <DetailRow icon={Calendar} label={lang === 'te' ? 'గడువు' : lang === 'hi' ? 'अंतिम तिथि' : 'Last Date'} value={scheme.lastDate} />
                      {scheme.helpline && <DetailRow icon={Phone} label="Helpline" value={scheme.helpline} />}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <button
                      onClick={() => setExpanded(isOpen ? null : scheme.id)}
                      className="btn-ghost text-sm !py-2 flex-1"
                    >
                      {isOpen ? (lang === 'te' ? 'తక్కువ' : lang === 'hi' ? 'कम' : 'Less') : (lang === 'te' ? 'వివరాలు' : lang === 'hi' ? 'विवरण' : 'Details')}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                      onClick={() => setSelected(scheme)}
                      className="btn-outline text-sm !py-2"
                    >
                      {lang === 'te' ? 'దశలు' : lang === 'hi' ? 'चरण' : 'Steps'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={scheme.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm !py-2"
                    >
                      {lang === 'te' ? 'రఖాస్తు' : lang === 'hi' ? 'आवेदन' : 'Apply'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <SchemeModal scheme={selected} lang={lang} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
      <div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}: </span>
        <span className="text-xs text-slate-700 dark:text-slate-300">{value}</span>
      </div>
    </div>
  );
}

function SchemeModal({ scheme, lang, onClose }: { scheme: Scheme; lang: 'en' | 'te' | 'hi'; onClose: () => void }) {
  const title = lang === 'te' ? (scheme.title_te ?? scheme.title) : lang === 'hi' ? (scheme.title_hi ?? scheme.title) : scheme.title;
  const steps = lang === 'te' ? (scheme.steps ?? []) : scheme.steps ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={onClose} />
      <div className="relative card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{title}</h2>
              <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mt-1">{scheme.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{scheme.description}</p>

        {/* Steps */}
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          {lang === 'te' ? 'దరఖాస్తు దశలు' : lang === 'hi' ? 'आवेदन चरण' : 'How to Apply — Step by Step'}
        </h3>
        <div className="space-y-3 mb-5">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 pt-1">{step}</p>
            </div>
          ))}
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <InfoBox icon={Users} label={lang === 'te' ? 'అర్హత' : 'Eligibility'} value={scheme.eligibility} />
          <InfoBox icon={FileText} label={lang === 'te' ? 'పత్రాలు' : 'Documents'} value={scheme.documents} />
          <InfoBox icon={IndianRupee} label={lang === 'te' ? 'ప్రయోజనాలు' : 'Benefits'} value={scheme.benefits} />
          <InfoBox icon={Calendar} label={lang === 'te' ? 'గడువు' : 'Last Date'} value={scheme.lastDate} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {scheme.helpline && (
            <a href={`tel:${scheme.helpline}`} className="btn-outline flex-1 justify-center">
              <Phone className="w-4 h-4" />
              {lang === 'te' ? 'హెల్ప్‌లైన్' : 'Helpline'} {scheme.helpline}
            </a>
          )}
          <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 justify-center">
            {lang === 'te' ? 'ఇప్పుడే దరఖాస్తు' : lang === 'hi' ? 'अभी आवेदन करें' : 'Apply Now'}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{value}</p>
    </div>
  );
}
