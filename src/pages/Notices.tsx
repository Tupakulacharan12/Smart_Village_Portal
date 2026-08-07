import { useEffect, useState, useMemo } from 'react';
import {
  FileText, Search, Download, FileBadge, X, Calendar, Pin,
  ChevronRight, AlertCircle, Clock, Building2,
} from 'lucide-react';
import { PageHeader, Card, Spinner, EmptyState, formatDate } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { Notice } from '@/lib/types';
import { NOTICE_TYPES } from '@/lib/data';

const TYPE_COLORS: Record<string, string> = {
  'Tax Notice': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'Tender Notice': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Circular': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Meeting Minutes': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Public Notice': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'Event Notice': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Administration': 'bg-govt-100 text-govt-700 dark:bg-govt-900/40 dark:text-govt-300',
};

export function Notices() {
  const { t, lang } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [selected, setSelected] = useState<Notice | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      setNotices(data ?? []);
      setLoading(false);
    })();
  }, []);

  const types = useMemo(() => {
    const fromData = Array.from(new Set(notices.map((n) => n.notice_type)));
    return NOTICE_TYPES.filter((t) => t === 'All' || fromData.includes(t));
  }, [notices]);

  const filtered = notices.filter((n) => {
    const matchType = type === 'All' || n.notice_type === type;
    const matchQ = !query || n.title.toLowerCase().includes(query.toLowerCase()) || (n.content ?? '').toLowerCase().includes(query.toLowerCase());
    return matchType && matchQ;
  });

  // Show 2 most recent as "pinned"
  const pinned = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  const downloadAsText = (n: Notice) => {
    const content = `${n.title}\n${'='.repeat(n.title.length)}\n\nType: ${n.notice_type}\nDate: ${formatDate(n.created_at)}\n\n${n.content ?? ''}\n\n— Gudlavalleru Panchayat Office`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notice-${n.title.slice(0, 20).replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title={t('notices')}
        subtitle={lang === 'te'
          ? 'పంచాయతీ నోటీసులు, సర్క్యులర్లు, టెండర్లు, పన్ను నోటీసులు'
          : lang === 'hi'
            ? 'पंचायत नोटिस, परिपत्र, निविदा, कर नोटिस'
            : 'Panchayat notices, circulars, tenders, and tax notices'}
        icon={FileText}
        image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} className="input-field pl-11" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field sm:w-48">
            {types.map((ty) => <option key={ty} value={ty}>{ty}</option>)}
          </select>
        </div>

        {/* Type chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {types.map((ty) => (
            <button
              key={ty}
              onClick={() => setType(ty)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                type === ty
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {ty === 'All' ? (lang === 'te' ? 'అన్నీ' : lang === 'hi' ? 'सभी' : 'All') : ty}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState message={t('noData')} />
        ) : (
          <div className="space-y-6">
            {/* Pinned / recent notices */}
            {pinned.length > 0 && type === 'All' && !query && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">{lang === 'te' ? 'తాజా నోటీసులు' : lang === 'hi' ? 'ताज़ा नोटिस' : 'Recent Notices'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinned.map((n) => (
                    <Card key={n.id} hover className="p-5 border-l-4 border-l-brand-500 cursor-pointer" >
                      <div onClick={() => setSelected(n)}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`badge ${TYPE_COLORS[n.notice_type] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{n.notice_type}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(n.created_at, lang)}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{n.title}</h3>
                        {n.content && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{n.content}</p>}
                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                            {t('readMore')}<ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); downloadAsText(n); }} className="ml-auto btn-outline !px-3 !py-1.5 text-xs" title={t('download')}>
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All notices list */}
            <div>
              {pinned.length > 0 && type === 'All' && !query && (
                <h2 className="font-bold text-slate-900 dark:text-white text-sm mb-3">{lang === 'te' ? 'అన్ని నోటీసులు' : 'All Notices'}</h2>
              )}
              <div className="space-y-3">
                {(type === 'All' && !query ? rest : filtered).map((n) => (
                  <Card key={n.id} hover className="p-4 flex items-start gap-4 cursor-pointer" >
                    <div className="w-11 h-11 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center shrink-0" onClick={() => setSelected(n)}>
                      <FileBadge className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => setSelected(n)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${TYPE_COLORS[n.notice_type] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{n.notice_type}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(n.created_at, lang)}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{n.title}</h3>
                      {n.content && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.content}</p>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); downloadAsText(n); }} className="btn-outline !px-3 !py-2 shrink-0" title={t('download')}>
                      <Download className="w-4 h-4" />
                    </button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Panchayat office info */}
            <Card className="p-5 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{lang === 'te' ? 'పంచాయతీ కార్యాలయం' : 'Panchayat Office'}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === 'te' ? 'నోటీసుల కోపీల కోసం పంచాయతీ కార్యాలయాన్ని సందర్శించండి.' : 'Visit the Panchayat Office for physical copies of notices.'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />9:30 AM - 5:00 PM</span>
                    <span>·</span>
                    <span>08676-234567</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Notice detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={() => setSelected(null)} />
          <div className="relative card p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center">
                  <FileBadge className="w-6 h-6 text-saffron-600 dark:text-saffron-400" />
                </div>
                <div>
                  <span className={`badge ${TYPE_COLORS[selected.notice_type] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{selected.notice_type}</span>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(selected.created_at, lang)}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-tight">{selected.title}</h2>
            {selected.content ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{selected.content}</p>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {lang === 'te' ? 'వివరాల కోసం పంచాయతీ కార్యాలయాన్ని సందర్శించండి.' : 'Visit the Panchayat Office for full details.'}
              </div>
            )}
            <button onClick={() => downloadAsText(selected)} className="btn-outline w-full mt-6 justify-center">
              <Download className="w-4 h-4" />
              {t('download')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
