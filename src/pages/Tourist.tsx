import { MapPin, MapPinned } from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { TOURIST_PLACES, VILLAGE_INFO } from '@/lib/data';

export function Tourist() {
  const { lang } = useLanguage();

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'పర్యాటక ప్రదేశాలు' : 'Tourist Places'}
        subtitle={lang === 'te' ? 'గుడ్లవల్లేరు సమీపంలోని ఆకర్షణలు' : 'Attractions near Gudlavalleru — temples, beaches, and heritage sites'}
        icon={MapPinned}
        image="https://images.pexels.com/photos/5138790/pexels-photo-5138790.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOURIST_PLACES.map((p, i) => (
            <Card key={i} hover className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mb-2">{p.category}</span>
                <h3 className="font-semibold text-slate-900 dark:text-white leading-snug">{lang === 'te' ? (p.name_te ?? p.name) : lang === 'hi' ? (p.name_hi ?? p.name) : p.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{p.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {p.distance}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Regional map */}
        <Card className="overflow-hidden mt-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'ప్రాంతీయ పటం' : 'Regional Map'}</h2>
            </div>
          </div>
          <iframe
            title="Gudlavalleru region"
            src={`https://www.google.com/maps?q=${VILLAGE_INFO.latitude},${VILLAGE_INFO.longitude}&z=11&output=embed`}
            className="w-full h-[400px] border-0"
            loading="lazy"
          />
        </Card>
      </div>
    </div>
  );
}
