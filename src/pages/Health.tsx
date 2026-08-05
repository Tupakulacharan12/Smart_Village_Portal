import { useEffect, useState } from 'react';
import {
  HeartPulse, Stethoscope, Syringe, Droplet, Ambulance, MapPin, Phone, Calendar,
  ShieldCheck, Video, Baby, Bug, Activity, Brain, HeartHandshake, Lightbulb,
  ChevronRight, Clock, ArrowRight, CheckCircle2, X,
} from 'lucide-react';
import { PageHeader, Card, Spinner, EmptyState, formatDate } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { HealthCamp } from '@/lib/types';
import { IMMUNIZATION_SCHEDULE, HEALTH_TIPS, AAROGYASRI_INFO, TELEMEDICINE_INFO } from '@/lib/data';

const TIP_ICONS: Record<string, typeof Droplet> = {
  Droplet, Bug, HeartHandshake, Baby, Activity, Brain,
};

export function Health() {
  const { t, lang } = useLanguage();
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTelemed, setShowTelemed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('health_camps').select('*').order('camp_date', { ascending: true });
      setCamps(data ?? []);
      setLoading(false);
    })();
  }, []);

  const campIcons: Record<string, typeof Stethoscope> = {
    'Health Camp': Stethoscope,
    'Vaccination Drive': Syringe,
    'Blood Donation Camp': Droplet,
  };

  const doctors = [
    { name: 'Dr. K. Krishna Murthy', specialization: lang === 'te' ? 'జనరల్ మెడిసిన్' : 'General Medicine', timing: 'Mon–Sat, 9 AM – 1 PM', phone: '08676-234567' },
    { name: 'Dr. S. Lakshmi', specialization: lang === 'te' ? 'మహిళల & పిల్లల ఆరోగ్యం' : 'Women & Child Health', timing: 'Mon–Fri, 10 AM – 2 PM', phone: '08676-234567' },
    { name: 'Dr. R. Venkateswara Rao', specialization: lang === 'te' ? 'దంత వైద్యం' : 'Dental Care', timing: 'Wed & Sat, 9 AM – 12 PM', phone: '08676-234567' },
  ];

  const hospitals = [
    { name: 'PHC Gudlavalleru', type: lang === 'te' ? 'ప్రాథమిక ఆరోగ్య కేంద్రం' : 'Primary Health Centre', addr: 'Gudlavalleru, 521356', phone: '08676-234567', dist: '0 km' },
    { name: 'Area Hospital, Gudivada', type: lang === 'te' ? 'ఏరియా ఆసుపత్రి' : 'Area Hospital', addr: 'Gudivada', phone: '08674-244000', dist: '12 km' },
    { name: 'Govt. General Hospital, Machilipatnam', type: lang === 'te' ? 'జనరల్ ఆసుపత్రి' : 'General Hospital', addr: 'Machilipatnam', phone: '08672-246001', dist: '35 km' },
    { name: 'Andhra Hospital, Vijayawada', type: lang === 'te' ? 'మల్టీ-స్పెషాలిటీ' : 'Multi-speciality', addr: 'Vijayawada', phone: '0866-2577000', dist: '45 km' },
  ];

  return (
    <div>
      <PageHeader
        title={t('health')}
        subtitle={lang === 'te'
          ? 'PHC, ఆరోగ్య శిబిరాలు, టీకాలు, ఆరోగ్యశ్రీ, టెలిమెడిసిన్'
          : lang === 'hi'
            ? 'PHC, स्वास्थ्य शिविर, टीकाकरण, आरोग्यश्री, टेलीमेडिसिन'
            : 'PHC, health camps, immunization, Aarogyasri, telemedicine'}
        icon={HeartPulse}
        image="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12 space-y-10">
        {/* Emergency numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Ambulance, label: 'Ambulance', value: '108', color: 'red' },
            { icon: Stethoscope, label: lang === 'te' ? 'ఆరోగ్య హెల్ప్‌లైన్' : 'Health Helpline', value: '104', color: 'teal' },
            { icon: Droplet, label: lang === 'te' ? 'రక్త బ్యాంక్' : 'Blood Bank', value: '104', color: 'saffron' },
            { icon: HeartPulse, label: lang === 'te' ? 'మహిళల హెల్ప్‌లైన్' : 'Women Helpline', value: '1091', color: 'pink' },
          ].map((c, i) => {
            const Icon = c.icon;
            const colorMap: Record<string, string> = {
              red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
              teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300',
              saffron: 'bg-saffron-100 text-saffron-600 dark:bg-saffron-900/40 dark:text-saffron-300',
              pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300',
            };
            return (
              <a key={i} href={`tel:${c.value}`} className="card card-hover p-5 text-center">
                <div className={`w-12 h-12 mx-auto rounded-2xl ${colorMap[c.color]} flex items-center justify-center mb-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{c.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{c.value}</p>
              </a>
            );
          })}
        </div>

        {/* Health camps + Telemedicine side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">
                {lang === 'te' ? 'ఆరోగ్య శిబిరాలు & కార్యక్రమాలు' : lang === 'hi' ? 'स्वास्थ्य शिविर' : 'Health Camps & Drives'}
              </h2>
            </div>
            {loading ? (
              <Spinner />
            ) : camps.length === 0 ? (
              <EmptyState message={t('noData')} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {camps.map((camp) => {
                  const Icon = campIcons[camp.camp_type] ?? Stethoscope;
                  return (
                    <Card key={camp.id} hover className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <span className="badge bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">{camp.camp_type}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{camp.title}</h3>
                      {camp.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{camp.description}</p>}
                      <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {camp.camp_date && <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(camp.camp_date, lang)}</p>}
                        {camp.location && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{camp.location}</p>}
                        {camp.contact && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{camp.contact}</p>}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Telemedicine card */}
          <div>
            <Card className="p-5 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">e-Sanjeevani</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {lang === 'te' ? 'ఇంట్లోనే ఉచిత డాక్టర్ సలహా. వీడియో కాల్ ద్వారా నిపుణులతో మాట్లాడండి.' : lang === 'hi' ? 'घर पर मुफ्त डॉक्टर सलाह। वीडियो कॉल पर विशेषज्ञ से बात करें।' : 'Free doctor consultation from home. Talk to specialists via video call.'}
              </p>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
                <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-teal-500" /> 24x7 available</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-teal-500" /> Helpline: {TELEMEDICINE_INFO.helpline}</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> e-Prescription by SMS</p>
              </div>
              <button onClick={() => setShowTelemed(true)} className="btn-primary w-full text-sm justify-center">
                {lang === 'te' ? 'ఎలా ఉపయోగించాలి?' : lang === 'hi' ? 'कैसे उपयोग करें?' : 'How to Use'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Card>
          </div>
        </div>

        {/* Aarogyasri banner */}
        <Card className="p-6 bg-gradient-to-r from-brand-600 to-brand-800 text-white border-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{AAROGYASRI_INFO.title}</h2>
              <p className="text-brand-100 text-sm">{AAROGYASRI_INFO.coverage} · {AAROGYASRI_INFO.procedures} · {AAROGYASRI_INFO.hospitals}</p>
              <p className="text-brand-200 text-xs mt-1">{AAROGYASRI_INFO.cost} · {AAROGYASRI_INFO.enrollment}</p>
            </div>
            <a href="https://www.ysraarogyasri.ap.gov.in/" target="_blank" rel="noopener noreferrer" className="bg-white text-brand-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-50 transition-colors whitespace-nowrap">
              {lang === 'te' ? 'ఇప్పుడే నమోదు' : lang === 'hi' ? 'अभी नामांकन' : 'Enroll Now'}
            </a>
          </div>
          {/* Covered treatments */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/20">
            {AAROGYASRI_INFO.coveredTreatments.slice(0, 4).map((tr, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-brand-100">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{tr}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {AAROGYASRI_INFO.coveredTreatments.slice(4).map((tr, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-brand-100">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{tr}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Immunization schedule */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Syringe className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="section-title">
              {lang === 'te' ? 'టీకాల షెడ్యూల్' : lang === 'hi' ? 'टीकाकरण अनुसूची' : 'Immunization Schedule'}
            </h2>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">{lang === 'te' ? 'వయస్సు' : 'Age'}</th>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">{lang === 'te' ? 'టీకాలు' : 'Vaccines'}</th>
                    <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">{lang === 'te' ? 'వ్యాధులు' : 'Diseases Prevented'}</th>
                  </tr>
                </thead>
                <tbody>
                  {IMMUNIZATION_SCHEDULE.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-brand-600 dark:text-brand-400 whitespace-nowrap">{row.age}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{row.vaccines}</td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 text-xs hidden sm:table-cell">{row.diseases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="text-xs text-slate-400 mt-2">
            {lang === 'te' ? 'టీకాల కోసం సమీప ఆంగన్‌వాడి లేదా PHC సందర్శించండి. అన్ని టీకాలు ఉచితం.' : 'Visit nearest Anganwadi or PHC for vaccination. All vaccines are free.'}
          </p>
        </section>

        {/* Health tips */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="section-title">
              {lang === 'te' ? 'ఆరోగ్య చిట్కాలు' : lang === 'hi' ? 'स्वास्थ्य सुझाव' : 'Health Tips'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HEALTH_TIPS.map((tip, i) => {
              const Icon = TIP_ICONS[tip.icon] ?? Lightbulb;
              const title = lang === 'te' ? (tip.title_te ?? tip.title) : tip.title;
              return (
                <Card key={i} hover className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tip.tip}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Doctors + Hospitals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h2 className="section-title mb-4">{lang === 'te' ? 'PHC వైద్యులు' : 'PHC Doctors'}</h2>
            <div className="space-y-3">
              {doctors.map((d, i) => (
                <Card key={i} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{d.name}</h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400">{d.specialization}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{d.timing}</p>
                  </div>
                  <a href={`tel:${d.phone}`} className="btn-outline !px-3 !py-2 text-xs">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title mb-4">{lang === 'te' ? 'సమీపంలోని ఆసుపత్రులు' : 'Hospitals Nearby'}</h2>
            <div className="space-y-3">
              {hospitals.map((h, i) => (
                <Card key={i} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{h.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{h.type}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{h.addr}</p>
                      <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">{h.dist}</span>
                    </div>
                  </div>
                  <a href={`tel:${h.phone}`} className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">{h.phone}</a>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Telemedicine modal */}
      {showTelemed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={() => setShowTelemed(false)} />
          <div className="relative card p-6 max-w-md w-full animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <Video className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">{TELEMEDICINE_INFO.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{TELEMEDICINE_INFO.hours}</p>
                </div>
              </div>
              <button onClick={() => setShowTelemed(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{TELEMEDICINE_INFO.desc}</p>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">{lang === 'te' ? 'దశలు' : 'Steps'}:</h3>
            <div className="space-y-3 mb-5">
              {TELEMEDICINE_INFO.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
            <a href="https://esanjeevani.in" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
              {lang === 'te' ? 'e-Sanjeevani తెరవండి' : 'Open e-Sanjeevani'}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
