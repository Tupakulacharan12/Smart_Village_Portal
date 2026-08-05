import { Info, MapPin, Train, Bus, History, Mountain, Wheat, Factory } from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { VILLAGE_INFO } from '@/lib/data';

export function About() {
  const { lang } = useLanguage();

  const sections = [
    { icon: History, title: lang === 'te' ? 'చరిత్ర' : lang === 'hi' ? 'इतिहास' : 'History', content: lang === 'te' ? VILLAGE_INFO.history_te : lang === 'hi' ? (VILLAGE_INFO.history_hi ?? VILLAGE_INFO.history) : VILLAGE_INFO.history },
    { icon: Mountain, title: lang === 'te' ? 'భౌగోళికం' : lang === 'hi' ? 'भूगोल' : 'Geography', content: lang === 'te' ? VILLAGE_INFO.geography_te : lang === 'hi' ? (VILLAGE_INFO.geography_hi ?? VILLAGE_INFO.geography) : VILLAGE_INFO.geography },
    { icon: Wheat, title: lang === 'te' ? 'వ్యవసాయం' : lang === 'hi' ? 'कृषि' : 'Agriculture', content: lang === 'te' ? VILLAGE_INFO.agriculture_te : lang === 'hi' ? (VILLAGE_INFO.agriculture_hi ?? VILLAGE_INFO.agriculture) : VILLAGE_INFO.agriculture },
    { icon: Factory, title: lang === 'te' ? 'పరిశ్రమలు' : lang === 'hi' ? 'उद्योग' : 'Industries', content: lang === 'te' ? VILLAGE_INFO.industries_te : lang === 'hi' ? (VILLAGE_INFO.industries_hi ?? VILLAGE_INFO.industries) : VILLAGE_INFO.industries },
  ];

  const facts = [
    { label: lang === 'te' ? 'రాష్ట్రం' : lang === 'hi' ? 'राज्य' : 'State', value: VILLAGE_INFO.state },
    { label: lang === 'te' ? 'జిల్లా' : lang === 'hi' ? 'जिला' : 'District', value: VILLAGE_INFO.district },
    { label: lang === 'te' ? 'మండలం' : lang === 'hi' ? 'मंडल' : 'Mandal', value: VILLAGE_INFO.mandal },
    { label: lang === 'te' ? 'జనాభా' : lang === 'hi' ? 'जनसंख्या' : 'Population', value: VILLAGE_INFO.population },
    { label: lang === 'te' ? 'విస్తీర్ణం' : lang === 'hi' ? 'क्षेत्रफल' : 'Area', value: VILLAGE_INFO.area },
    { label: lang === 'te' ? 'అక్షరాస్యత' : lang === 'hi' ? 'साक्षरता' : 'Literacy Rate', value: VILLAGE_INFO.literacy },
    { label: lang === 'te' ? 'పిన్‌కోడ్' : lang === 'hi' ? 'पिन कोड' : 'Pincode', value: VILLAGE_INFO.pincode },
    { label: lang === 'te' ? 'అక్షాంశం' : lang === 'hi' ? 'निर्देशांक' : 'Coordinates', value: `${VILLAGE_INFO.latitude}°N, ${VILLAGE_INFO.longitude}°E` },
  ];

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? VILLAGE_INFO.name_te : lang === 'hi' ? (VILLAGE_INFO.name_hi ?? VILLAGE_INFO.name) : VILLAGE_INFO.name}
        subtitle={lang === 'te' ? 'మన గ్రామం గురించి తెలుసుకోండి' : lang === 'hi' ? 'हमारे गाँव के बारे में जानें' : 'Learn about our village'}
        icon={Info}
        image="https://images.pexels.com/photos/12630109/pexels-photo-12630109.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14 space-y-10">
        {/* Fact cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {facts.map((f) => (
            <Card key={f.label} className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">{f.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{f.value}</p>
            </Card>
          ))}
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{s.content}</p>
              </Card>
            );
          })}
        </div>

        {/* Transport */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-govt-50 dark:bg-govt-900/40 flex items-center justify-center">
                <Train className="w-5 h-5 text-govt-600 dark:text-govt-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'రైల్వే స్టేషన్' : lang === 'hi' ? 'रेलवे स्टेशन' : 'Railway Station'}</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{lang === 'te' ? VILLAGE_INFO.railway_te : lang === 'hi' ? (VILLAGE_INFO.railway_hi ?? VILLAGE_INFO.railway) : VILLAGE_INFO.railway}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 dark:bg-saffron-900/30 flex items-center justify-center">
                <Bus className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'బస్ స్టాండ్' : lang === 'hi' ? 'बस स्टैंड' : 'Bus Stand'}</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{lang === 'te' ? VILLAGE_INFO.busStand_te : lang === 'hi' ? (VILLAGE_INFO.busStand_hi ?? VILLAGE_INFO.busStand) : VILLAGE_INFO.busStand}</p>
          </Card>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'మన స్థానం' : lang === 'hi' ? 'हमारा स्थान' : 'Our Location'}</h2>
            </div>
          </div>
          <iframe
            title="Gudlavalleru map"
            src={`https://www.google.com/maps?q=${VILLAGE_INFO.latitude},${VILLAGE_INFO.longitude}&z=14&output=embed`}
            className="w-full h-[360px] border-0"
            loading="lazy"
          />
        </Card>
      </div>
    </div>
  );
}
