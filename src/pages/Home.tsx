import { useEffect, useState, useMemo } from 'react';
import {
  ArrowRight, MapPin, Users, GraduationCap, LandPlot, Calendar, Siren,
  Newspaper, MessageSquareWarning, HeartPulse, Wheat, FileCheck, Images,
  Info, FileText, Landmark, Phone, Sparkles, ChevronRight, Sun, TrendingUp,
  Lightbulb, Clock, Droplet, Bug, HeartHandshake, Baby, Activity, Brain, Trash2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { VILLAGE_INFO, QUICK_STATS, EMERGENCY_CONTACTS, GOVERNMENT_SCHEMES, CROP_CALENDAR, HEALTH_TIPS } from '@/lib/data';
import { formatDate } from '@/components/ui';
import { VisitorCounter } from '@/components/VisitorCounter';
import { WeatherWidget } from '@/components/WeatherWidget';
import type { NewsItem, EventItem } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const DAILY_TIP_ICONS: Record<string, LucideIcon> = {
  Droplet, Bug, HeartHandshake, Baby, Activity, Brain, Lightbulb,
};

interface HomeProps {
  navigate: (to: string) => void;
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  schemes: Landmark,
  complaints: MessageSquareWarning,
  news: Newspaper,
  health: HeartPulse,
  education: GraduationCap,
  agriculture: Wheat,
  services: FileCheck,
  notices: FileText,
  waste: Trash2,
};

export function Home({ navigate }: HomeProps) {
  const { t, lang } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [n, e] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('events').select('*').order('event_date', { ascending: true }).limit(4),
      ]);
      setNews(n.data ?? []);
      setEvents(e.data ?? []);
      setLoading(false);
    })();
  }, []);

  const stats = QUICK_STATS.map((s) => ({ ...s, icon: s.icon === 'Users' ? Users : s.icon === 'GraduationCap' ? GraduationCap : s.icon === 'MapPin' ? MapPin : LandPlot }));
  const emergencyTop = EMERGENCY_CONTACTS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11276073/pexels-photo-11276073.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Gudlavalleru landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/95 via-brand-900/85 to-brand-800/70" />
        </div>

        <div className="relative container-page py-16 sm:py-24">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-brand-100 text-sm font-medium mb-5">
              <Sparkles className="w-4 h-4" />
              {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వ డిజిటల్ గవర్నెన్స్' : lang === 'hi' ? 'आंध्र प्रदेश सरकार — डिजिटल शासन' : 'Government of Andhra Pradesh — Digital Governance'}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {t('welcomeTo')}
            </h1>
            <p className="mt-4 text-lg text-brand-100 max-w-2xl leading-relaxed">{t('heroSub')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('complaints')} className="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50 shadow-lg">
                <MessageSquareWarning className="w-4 h-4" />
                {t('complaints')}
              </button>
              <button onClick={() => navigate('schemes')} className="btn !bg-white/10 !text-white backdrop-blur-sm border border-white/30 hover:!bg-white/20">
                <Landmark className="w-4 h-4" />
                {t('schemes')}
              </button>
              <button onClick={() => navigate('about')} className="btn !bg-white/10 !text-white backdrop-blur-sm border border-white/30 hover:!bg-white/20">
                <Info className="w-4 h-4" />
                {t('about')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 hidden sm:block">
          <div className="container-page py-4">
            <div className="grid grid-cols-4 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold leading-none">{s.value}</div>
                      <div className="text-xs text-brand-100 mt-0.5">{lang === 'te' ? s.label_te : lang === 'hi' ? (s.label_hi ?? s.label) : s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Daily Updates */}
      <DailyUpdates navigate={navigate} lang={lang} t={t} news={news} events={events} loading={loading} />

      <div className="container-page py-10 sm:py-14 space-y-14">
        {/* Quick services */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title">{t('quickServices')}</h2>
              <p className="section-sub">{lang === 'te' ? 'అన్ని గ్రామ సేవలు ఒకే చోట' : lang === 'hi' ? 'सभी गाँव सेवाएँ एक जगह' : 'All village services in one place'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(SERVICE_ICONS).map(([route, Icon]) => (
              <button
                key={route}
                onClick={() => navigate(route)}
                className="card card-hover p-5 text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 transition-colors">
                  <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  {t(route as never) || route}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* News + sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-6">
              <h2 className="section-title">{t('latestNews')}</h2>
              <button onClick={() => navigate('news')} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-28 card animate-pulse" />)}
              </div>
            ) : news.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noData')}</p>
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <article key={item.id} className="card card-hover overflow-hidden flex flex-col sm:flex-row">
                    {item.image_url && (
                      <div className="sm:w-40 h-32 sm:h-auto shrink-0 overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{item.category}</span>
                        <span className="text-xs text-slate-400">{formatDate(item.created_at, lang)}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
                      {item.summary && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{item.summary}</p>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VisitorCounter />
            <WeatherWidget />

            {/* Emergency quick */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Siren className="w-5 h-5 text-red-500" />
                {t('emergencyNumbers')}
              </h3>
              <div className="space-y-2">
                {emergencyTop.map((c) => (
                  <a
                    key={c.id}
                    href={`tel:${c.number}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lang === 'te' ? c.name_te : lang === 'hi' ? (c.name_hi ?? c.name) : c.name}</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">{c.number}</span>
                  </a>
                ))}
              </div>
              <button onClick={() => navigate('emergency')} className="btn-outline w-full mt-3 !py-2 text-sm">
                {t('viewAll')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Upcoming events */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="section-title">{t('upcomingEvents')}</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 card animate-pulse" />)}
            </div>
          ) : events.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('noData')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {events.map((ev) => {
                const d = ev.event_date ? new Date(ev.event_date) : null;
                return (
                  <div key={ev.id} className="card card-hover p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-saffron-600 dark:text-saffron-400 leading-none">{d?.getDate() ?? '—'}</span>
                        <span className="text-[10px] text-saffron-600 dark:text-saffron-400 uppercase">{d?.toLocaleString('en', { month: 'short' }) ?? ''}</span>
                      </div>
                      <span className="badge bg-govt-100 text-govt-700 dark:bg-govt-900/40 dark:text-govt-300">{ev.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{ev.title}</h3>
                    {ev.location && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Featured schemes */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title">{t('schemes')}</h2>
              <p className="section-sub">{lang === 'te' ? 'ప్రభుత్వ సంక్షేమ పథకాలు' : lang === 'hi' ? 'निवासियों के लिए सरकारी कल्याणकारी योजनाएँ' : 'Government welfare schemes for residents'}</p>
            </div>
            <button onClick={() => navigate('schemes')} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GOVERNMENT_SCHEMES.slice(0, 4).map((s) => (
              <button key={s.id} onClick={() => navigate('schemes')} className="card card-hover p-5 text-left group">
                <div className="w-10 h-10 rounded-xl bg-govt-100 dark:bg-govt-900/40 flex items-center justify-center mb-3">
                  <Landmark className="w-5 h-5 text-govt-600 dark:text-govt-400" />
                </div>
                <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mb-2">{s.category}</span>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{lang === 'te' ? (s.title_te ?? s.title) : lang === 'hi' ? (s.title_hi ?? s.title) : s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all">
                  {t('learnMore')} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DailyUpdates({ navigate, lang, t, news, events, loading }: {
  navigate: (to: string) => void;
  lang: 'en' | 'te' | 'hi';
  t: (k: import('@/lib/i18n').TranslationKey) => string;
  news: NewsItem[];
  events: EventItem[];
  loading: boolean;
}) {
  const today = new Date();
  const todayStr = today.toLocaleDateString(lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Pick a daily tip based on day of year (rotates through tips)
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyTip = HEALTH_TIPS[dayOfYear % HEALTH_TIPS.length];

  // Current month crop suggestions
  const currentMonth = today.toLocaleString('en-US', { month: 'short' });
  const seasonCrops = CROP_CALENDAR.filter((c) => {
    return c.sowing.toLowerCase().includes(currentMonth.toLowerCase()) ||
           c.months.toLowerCase().includes(currentMonth.toLowerCase()) ||
           c.season === 'Year-round' || c.season === 'Perennial';
  }).slice(0, 3);

  const upcomingEvents = events
    .filter((e) => e.event_date && new Date(e.event_date) >= today)
    .slice(0, 3);
  const latestNews = news.slice(0, 3);

  const TipIcon = DAILY_TIP_ICONS[dailyTip.icon] ?? Lightbulb;
  const tipTitle = lang === 'te' ? (dailyTip.title_te ?? dailyTip.title) : dailyTip.title;

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
      <div className="container-page py-8">
        {/* Header with date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'te' ? 'నేటి అప్‌డేట్లు' : lang === 'hi' ? 'आज के अपडेट' : "Today's Updates"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{todayStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{lang === 'te' ? 'ప్రతిరోజు తాజా సమాచారం' : lang === 'hi' ? 'रोज़ ताज़ा जानकारी' : 'Fresh updates every day'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Latest News */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                {t('latestNews')}
              </h3>
              <button onClick={() => navigate('news')} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                {t('viewAll')}
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : latestNews.length === 0 ? (
              <p className="text-xs text-slate-400">{t('noData')}</p>
            ) : (
              <div className="space-y-3">
                {latestNews.map((n) => (
                  <button key={n.id} onClick={() => navigate('news')} className="w-full text-left group">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{n.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(n.created_at, lang)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-govt-600 dark:text-govt-400" />
                {t('upcomingEvents')}
              </h3>
              <button onClick={() => navigate('about')} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                {t('viewAll')}
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400">{t('noData')}</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((e) => (
                  <button key={e.id} onClick={() => navigate('about')} className="w-full text-left group">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-govt-100 dark:bg-govt-900/40 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-govt-600 dark:text-govt-400 leading-none">
                          {e.event_date ? new Date(e.event_date).getDate() : '?'}
                        </span>
                        <span className="text-[8px] text-govt-500 dark:text-govt-400 leading-none mt-0.5">
                          {e.event_date ? new Date(e.event_date).toLocaleString('en-US', { month: 'short' }) : ''}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{e.title}</p>
                        {e.location && <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{e.location}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Daily Tip + Seasonal Crops */}
          <div className="space-y-4">
            {/* Daily Health Tip */}
            <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {lang === 'te' ? 'నేటి ఆరోగ్య చిట్కా' : lang === 'hi' ? 'आज का स्वास्थ्य सुझाव' : 'Daily Health Tip'}
                </h3>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                  <TipIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{tipTitle}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">{dailyTip.tip}</p>
                </div>
              </div>
            </div>

            {/* Seasonal Crops */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  {lang === 'te' ? 'ఈ నెల పంటలు' : lang === 'hi' ? 'इस महीने की फसल' : 'This Season'}
                </h3>
                <button onClick={() => navigate('agriculture')} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  {t('viewAll')}
                </button>
              </div>
              <div className="space-y-2">
                {seasonCrops.map((c, i) => (
                  <button key={i} onClick={() => navigate('agriculture')} className="w-full flex items-center justify-between text-left group">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {lang === 'te' ? c.crop_te : c.crop}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.months}</span>
                  </button>
                ))}
                {seasonCrops.length === 0 && <p className="text-xs text-slate-400">{t('noData')}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}