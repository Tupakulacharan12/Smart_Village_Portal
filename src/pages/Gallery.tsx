import { useEffect, useState } from 'react';
import { Images, X } from 'lucide-react';
import { PageHeader, Card, Spinner, EmptyState } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { GalleryItem } from '@/lib/types';

export function Gallery() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = category === 'All' ? items : items.filter((i) => i.category === category);

  return (
    <div>
      <PageHeader
        title={t('gallery')}
        subtitle={lang === 'te' ? 'మన గ్రామ చిత్రాలు' : 'Photos of our village — festivals, schools, temples and more'}
        icon={Images}
        image="https://images.pexels.com/photos/14546935/pexels-photo-14546935.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === c ? 'bg-brand-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState message={t('noData')} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden card-hover"
              >
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="badge bg-white/20 text-white backdrop-blur-sm mb-1">{item.category}</span>
                  <p className="text-white text-xs font-semibold leading-tight">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative max-w-4xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white/80 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
            <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-[75vh] object-contain rounded-xl" />
            <div className="mt-3 text-center">
              <span className="badge bg-white/10 text-white mr-2">{lightbox.category}</span>
              <p className="text-white font-semibold mt-1">{lightbox.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
