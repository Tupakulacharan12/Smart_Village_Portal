import { useEffect, useState, useMemo } from 'react';
import {
  Newspaper, Search, Calendar, Tag, X, Share2, ChevronRight, Flame,
  TrendingUp, Bookmark, BookmarkCheck,
} from 'lucide-react';
import { PageHeader, Card, Spinner, EmptyState, formatDate } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { NewsItem } from '@/lib/types';

export function News() {
  const { t, lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      setNews(data ?? []);
      setLoading(false);
    })();
    const saved = localStorage.getItem('news-bookmarks');
    if (saved) setBookmarked(JSON.parse(saved));
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('news-bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(news.map((n) => n.category)))], [news]);
  const featured = news.filter((n) => n.is_featured);
  const filtered = news.filter((n) => {
    const matchCat = category === 'All' || n.category === category;
    const matchQ = !query || n.title.toLowerCase().includes(query.toLowerCase()) || (n.summary ?? '').toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const handleShare = (item: NewsItem) => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.summary ?? '', url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${item.title} - ${url}`);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('news')}
        subtitle={lang === 'te'
          ? 'గ్రామ ప్రజలకు సంబంధించిన తాజా వార్తలు, సంఘటనలు, ప్రకటనలు'
          : lang === 'hi'
            ? 'गाँव से जुड़ी ताज़ा खबरें, घटनाएँ और घोषणाएँ'
            : 'Latest news, events, and announcements for the village community'}
        icon={Newspaper}
        image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12">
        {/* Featured news */}
        {!loading && featured.length > 0 && category === 'All' && !query && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="section-title">
                {lang === 'te' ? 'చిట్కా వార్తలు' : lang === 'hi' ? 'प्रमुख खबरें' : 'Featured Stories'}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Big featured */}
              <Card hover className="overflow-hidden cursor-pointer group" >
                <div className="relative h-64 overflow-hidden" onClick={() => setSelected(featured[0])}>
                  {featured[0].image_url && (
                    <img src={featured[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <span className="badge bg-amber-500 text-white mb-2">Featured</span>
                    <h3 className="text-lg font-bold leading-tight">{featured[0].title}</h3>
                    {featured[0].summary && <p className="text-sm text-white/80 mt-1 line-clamp-2">{featured[0].summary}</p>}
                    <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{formatDate(featured[0].created_at, lang)}
                    </p>
                  </div>
                </div>
              </Card>
              {/* Secondary featured */}
              <div className="grid grid-cols-1 gap-4">
                {featured.slice(1, 3).map((item) => (
                  <Card key={item.id} hover className="flex gap-4 overflow-hidden cursor-pointer" >
                    <div className="w-32 h-28 shrink-0 overflow-hidden" onClick={() => setSelected(item)}>
                      {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="py-3 pr-3 flex-1" onClick={() => setSelected(item)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{item.category}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{formatDate(item.created_at, lang)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search')} className="input-field pl-11" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
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

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState message={t('noData')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Card key={item.id} hover className="overflow-hidden flex flex-col group">
                {item.image_url && (
                  <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => setSelected(item)}>
                    <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {item.is_featured && <span className="absolute top-3 left-3 badge bg-amber-500 text-white">Featured</span>}
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{item.category}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{formatDate(item.created_at, lang)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug cursor-pointer hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setSelected(item)}>
                    {item.title}
                  </h3>
                  {item.summary && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">{item.summary}</p>}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => setSelected(item)} className="text-sm font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
                      {t('readMore')}<ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="ml-auto flex items-center gap-1">
                      <button onClick={() => toggleBookmark(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" title="Bookmark">
                        {bookmarked.includes(item.id) ? <BookmarkCheck className="w-4 h-4 text-brand-600" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleShare(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" title="Share">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* News detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={() => setSelected(null)} />
          <div className="relative card max-w-lg w-full max-h-[85vh] overflow-y-auto animate-scale-in">
            {selected.image_url && (
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img src={selected.image_url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6">
              {!selected.image_url && (
                <button onClick={() => setSelected(null)} className="float-right p-2 -mt-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{selected.category}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{formatDate(selected.created_at, lang)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">{selected.title}</h2>
              {selected.summary && <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">{selected.summary}</p>}
              {selected.content && <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{selected.content}</p>}
              <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => handleShare(selected)} className="btn-outline text-sm flex-1 justify-center">
                  <Share2 className="w-4 h-4" />
                  {lang === 'te' ? 'పంచుకోండి' : lang === 'hi' ? 'साझा करें' : 'Share'}
                </button>
                <button onClick={() => { toggleBookmark(selected.id); }} className="btn-ghost text-sm flex-1 justify-center">
                  {bookmarked.includes(selected.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {lang === 'te' ? 'సేవ్' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
