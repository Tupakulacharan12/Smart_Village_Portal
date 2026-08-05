import { useState, useMemo } from 'react';
import {
  FileCheck, ExternalLink, Search, FileText, Clock, IndianRupee,
  CheckCircle2, Building2, Globe, X, ChevronRight, ArrowRight,
  Baby, Wallet, ScrollText, Home, Fingerprint, Vote, ShoppingBasket,
  ReceiptIndianRupee, HandCoins, BookUser,
} from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { CERTIFICATES } from '@/lib/data';
import type { CertificateService } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Baby, FileText, Wallet, ScrollText, Home, Fingerprint, Vote, ShoppingBasket,
  ReceiptIndianRupee, Building2, HandCoins, BookUser,
};

type FilterType = 'All' | 'Online' | 'Offline';

export function Services() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [selected, setSelected] = useState<CertificateService | null>(null);

  const filtered = useMemo(() => {
    return CERTIFICATES.filter((c) => {
      const name = lang === 'te' ? c.name_te : lang === 'hi' ? c.name_hi : c.name;
      const matchQ = !query || name.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase());
      const matchFilter = filter === 'All' || (filter === 'Online' && c.onlineAvailable) || (filter === 'Offline' && c.offlineAvailable);
      return matchQ && matchFilter;
    });
  }, [query, filter, lang]);

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'ప్రజా సేవలు' : lang === 'hi' ? 'लोक सेवाएँ' : 'Public Services'}
        subtitle={lang === 'te'
          ? 'ధృవీకరణ పత్రాలు, పన్నులు, పింఛన్లు — పత్రాలు, రుసుము, సమయంతో'
          : lang === 'hi'
            ? 'प्रमाण पत्र, कर, पेंशन — दस्तावेज़, शुल्क, समय के साथ'
            : 'Certificates, taxes, pensions — with documents, fees, and processing times'}
        icon={FileCheck}
        image="https://images.pexels.com/photos/6217466/pexels-photo-6217466.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'te' ? 'సేవ వెతకండి...' : lang === 'hi' ? 'सेवा खोजें...' : 'Search services...'}
              className="input-field pl-11"
            />
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {(['All', 'Online', 'Offline'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {f === 'All' ? (lang === 'te' ? 'అన్నీ' : lang === 'hi' ? 'सभी' : 'All') : f}
              </button>
            ))}
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => {
            const Icon = ICONS[c.icon] ?? FileText;
            const name = lang === 'te' ? c.name_te : lang === 'hi' ? c.name_hi : c.name;
            const desc = lang === 'te' ? c.desc_te : lang === 'hi' ? c.desc_hi : c.desc;
            return (
              <Card key={i} hover className="p-5 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-govt-100 dark:bg-govt-900/40 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-govt-600 dark:text-govt-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      {c.onlineAvailable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <Globe className="w-2.5 h-2.5" /> Online
                        </span>
                      )}
                      {c.offlineAvailable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <Building2 className="w-2.5 h-2.5" /> Offline
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{desc}</p>

                {/* Quick info */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.fee}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={() => setSelected(c)} className="btn-ghost text-sm !py-2 flex-1">
                    {lang === 'te' ? 'వివరాలు' : lang === 'hi' ? 'विवरण' : 'Details'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {c.onlineAvailable && (
                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !py-2">
                      {lang === 'te' ? 'రఖాస్తు' : lang === 'hi' ? 'आवेदन' : 'Apply'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sachivalayam info */}
        <Card className="mt-8 p-6 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 dark:text-white mb-1">{lang === 'te' ? 'గ్రామ సచివాలయం సేవలు' : 'Grama Sachivalayam Services'}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {lang === 'te'
                  ? 'చాలా ధృవీకరణ పత్రాలను మీ గ్రామ సచివాలయం ద్వారా కూడా దరఖాస్తు చేయవచ్చు.'
                  : 'Most certificates can also be applied through your Grama Sachivalayam. Visit the Panchayat Office or apply online.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'చిరునామా' : 'Address'}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Panchayat Office, Gudlavalleru</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'సమయం' : 'Hours'}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">9:30 AM - 5:00 PM</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'ఫోన్' : 'Phone'}</p>
                  <a href="tel:08676234567" className="text-sm font-semibold text-brand-600 dark:text-brand-400">08676-234567</a>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Service detail modal */}
      {selected && <ServiceModal service={selected} lang={lang} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ServiceModal({ service, lang, onClose }: { service: CertificateService; lang: 'en' | 'te' | 'hi'; onClose: () => void }) {
  const Icon = ICONS[service.icon] ?? FileText;
  const name = lang === 'te' ? service.name_te : lang === 'hi' ? service.name_hi : service.name;
  const desc = lang === 'te' ? service.desc_te : lang === 'hi' ? service.desc_hi : service.desc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={onClose} />
      <div className="relative card p-6 max-w-md w-full max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-govt-100 dark:bg-govt-900/40 flex items-center justify-center">
              <Icon className="w-6 h-6 text-govt-600 dark:text-govt-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                {service.onlineAvailable && <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Online</span>}
                {service.offlineAvailable && <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Offline</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{desc}</p>

        {/* Document requirements */}
        <div className="mb-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-govt-600 dark:text-govt-400" />
            {lang === 'te' ? 'కావలసిన పత్రాలు' : lang === 'hi' ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
          </h3>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm text-slate-700 dark:text-slate-300">{service.documents}</p>
          </div>
        </div>

        {/* Fee + Time */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-1.5 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-govt-500" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lang === 'te' ? 'రుసుము' : 'Fee'}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{service.fee}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-govt-500" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{lang === 'te' ? 'సమయం' : 'Processing'}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{service.processingTime}</p>
          </div>
        </div>

        {/* How to apply */}
        <div className="mb-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {lang === 'te' ? 'ఎలా దరఖాస్తు చేయాలి' : 'How to Apply'}
          </h3>
          <div className="space-y-2">
            {service.onlineAvailable && (
              <a href={service.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lang === 'te' ? 'ఆన్‌లైన్ దరఖాస్తు' : 'Apply Online'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{service.link.replace('https://', '')}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
              </a>
            )}
            {service.offlineAvailable && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lang === 'te' ? 'గ్రామ సచివాలయంలో దరఖాస్తు' : 'Apply at Grama Sachivalayam'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Panchayat Office, Gudlavalleru · 9:30 AM - 5:00 PM</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {service.onlineAvailable && (
          <a href={service.link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
            {lang === 'te' ? 'ఇప్పుడే దరఖాస్తు' : lang === 'hi' ? 'अभी आवेदन करें' : 'Apply Now'}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
