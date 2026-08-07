import { useEffect, useState } from 'react';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { NAV_ITEMS } from '@/lib/nav';
import { GOVERNMENT_SCHEMES, EMERGENCY_CONTACTS, SCHOOLS, TOURIST_PLACES, VILLAGE_INFO } from '@/lib/data';
import { EXAMS } from '@/lib/examData';
import { supabase } from '@/lib/supabase';

interface SearchPageProps {
  navigate: (to: string) => void;
  query: string;
}

interface Result {
  type: string;
  title: string;
  subtitle: string;
  route: string;
}

export function SearchPage({ navigate, query }: SearchPageProps) {
  const { t, lang } = useLanguage();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const q = query.toLowerCase().trim();
      if (!q) { setResults([]); setLoading(false); return; }
      const out: Result[] = [];

      // Nav items
      NAV_ITEMS.forEach(item => {
        const label = t(item.labelKey).toLowerCase();
        if (label.includes(q)) out.push({ type: 'Page', title: t(item.labelKey), subtitle: 'Section', route: item.route });
      });

      // Schemes
      GOVERNMENT_SCHEMES.forEach(s => {
        if (s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
          out.push({ type: 'Scheme', title: lang === 'te' && s.title_te ? s.title_te : s.title, subtitle: s.category, route: 'schemes' });
      });

      // Emergency
      EMERGENCY_CONTACTS.forEach(c => {
        const name = (lang === 'te' ? (c.name_te ?? c.name) : c.name).toLowerCase();
        if (name.includes(q) || c.number.includes(q))
          out.push({ type: 'Emergency', title: lang === 'te' ? (c.name_te ?? c.name) : c.name, subtitle: c.number, route: 'emergency' });
      });

      // Schools
      SCHOOLS.forEach(s => {
        if (s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q))
          out.push({ type: 'School', title: s.name, subtitle: s.type, route: 'education' });
      });

      // Tourist
      TOURIST_PLACES.forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
          out.push({ type: 'Tourist', title: lang === 'te' && p.name_te ? p.name_te : p.name, subtitle: p.category, route: 'tourist' });
      });

      // Village info
      if (VILLAGE_INFO.name.toLowerCase().includes(q) || VILLAGE_INFO.history.toLowerCase().includes(q))
        out.push({ type: 'Village', title: lang === 'te' ? VILLAGE_INFO.name_te : VILLAGE_INFO.name, subtitle: VILLAGE_INFO.district, route: 'about' });

      // Exams
      EXAMS.forEach(e => {
        if (e.name.toLowerCase().includes(q) || e.fullName.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
          out.push({ type: 'Exam', title: lang === 'te' && e.name_te ? e.name_te : e.name, subtitle: e.fullName, route: `exam/${e.slug}` });
      });

      // DB content: news, notices, gallery
      const [news, notices] = await Promise.all([
        supabase.from('news').select('title,summary,category').ilike('title', `%${q}%`),
        supabase.from('notices').select('title,notice_type').ilike('title', `%${q}%`),
      ]);
      (news.data ?? []).forEach((n) => out.push({ type: 'News', title: n.title, subtitle: n.category ?? 'News', route: 'news' }));
      (notices.data ?? []).forEach((n) => out.push({ type: 'Notice', title: n.title, subtitle: n.notice_type ?? 'Notice', route: 'notices' }));

      setResults(out);
      setLoading(false);
    })();
  }, [query, lang, t]);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <SearchIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lang === 'te' ? 'శోధన ఫలితాలు' : 'Search Results'}
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-6">"{query}"</p>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 card animate-pulse" />)}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{lang === 'te' ? 'ఫలితాలు లేవు' : 'No results found'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => navigate(r.route)}
                className="card card-hover p-4 w-full flex items-center justify-between text-left"
              >
                <div>
                  <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mb-1">{r.type}</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{r.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{r.subtitle}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
