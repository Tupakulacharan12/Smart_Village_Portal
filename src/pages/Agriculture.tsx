import {
  Wheat, CloudSun, FlaskConical, Droplets, TrendingUp, Bug, PiggyBank, Sprout,
  Calendar, MapPin, Phone, Clock, AlertTriangle, ChevronRight, ExternalLink,
  Tractor, Shield,
} from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { WeatherWidget } from '@/components/WeatherWidget';
import { CROP_CALENDAR, AGRI_RESOURCES, PEST_ALERTS, GOVT_AGRI_SUBSIDIES } from '@/lib/data';
import { EquipmentRental } from '@/components/EquipmentRental';

export function Agriculture() {
  const { lang } = useLanguage();

  const fertilizers = [
    { name: 'Urea (46-0-0)', use: lang === 'te' ? 'నత్రజని సరఫరా' : 'Nitrogen supply', dose: lang === 'te' ? '50 kg/ఎకరా (వరి)' : '50 kg/acre (paddy)' },
    { name: 'DAP (18-46-0)', use: lang === 'te' ? 'భాస్వరం + నత్రజని' : 'Phosphorus + Nitrogen', dose: lang === 'te' ? '25 kg/ఎకరా' : '25 kg/acre' },
    { name: 'MOP (0-0-60)', use: lang === 'te' ? 'పొటాషియం' : 'Potassium', dose: lang === 'te' ? '15 kg/ఎకరా' : '15 kg/acre' },
    { name: lang === 'te' ? 'సేంద్రియ ఎరువు' : 'Organic Manure', use: lang === 'te' ? 'నేల సారవంతం' : 'Soil fertility', dose: lang === 'te' ? '2 టన్లు/ఎకరా' : '2 tonnes/acre' },
  ];

  const marketPrices = [
    { crop: lang === 'te' ? 'వరి (సాధారణ)' : 'Paddy (Common)', price: '₹2,300/quintal', trend: 'up' },
    { crop: lang === 'te' ? 'వరి (A గ్రేడ్)' : 'Paddy (A Grade)', price: '₹2,500/quintal', trend: 'up' },
    { crop: lang === 'te' ? 'మినుము' : 'Black Gram', price: '₹7,500/quintal', trend: 'flat' },
    { crop: lang === 'te' ? 'పెసర' : 'Green Gram', price: '₹8,000/quintal', trend: 'up' },
    { crop: lang === 'te' ? 'చెరకు' : 'Sugarcane', price: '₹350/quintal', trend: 'flat' },
  ];

  const severityColor: Record<string, string> = {
    High: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    Medium: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    Low: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'వ్యవసాయం' : lang === 'hi' ? 'कृषि' : 'Agriculture'}
        subtitle={lang === 'te'
          ? 'పంట క్యాలెండర్, పురుగు హెచ్చరికలు, ఎరువులు, మార్కెట్ ధరలు, రాయితీలు'
          : lang === 'hi'
            ? 'फसल कैलेंडर, कीट अलर्ट, उर्वरक, बाजार भाव, सब्सिडी'
            : 'Crop calendar, pest alerts, fertilizers, market prices, subsidies'}
        icon={Wheat}
        image="https://images.pexels.com/photos/20212135/pexels-photo-20212135.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12 space-y-10">
        {/* Weather + Quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WeatherWidget />
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">{lang === 'te' ? 'మార్కెట్ ధరలు (MSP)' : 'Market Prices (MSP)'}</h2>
            </div>
            <div className="space-y-2">
              {marketPrices.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{m.crop}</span>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{m.price}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2">* {lang === 'te' ? 'గుడివాడ మార్కెట్ యార్డ్' : 'Gudivada Market Yard'}</p>
          </Card>
        </div>

        {/* Crop Calendar */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="section-title">{lang === 'te' ? 'పంట క్యాలెండర్' : 'Crop Calendar'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CROP_CALENDAR.map((c, i) => (
              <Card key={i} hover className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{c.season}</span>
                  <span className="text-xs text-slate-400">{c.months}</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lang === 'te' ? c.crop_te : c.crop}</h3>
                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <p><span className="font-medium text-slate-600 dark:text-slate-300">{lang === 'te' ? 'నాటు:' : 'Sow:'}</span> {c.sowing}</p>
                  <p><span className="font-medium text-slate-600 dark:text-slate-300">{lang === 'te' ? 'కోత:' : 'Harvest:'}</span> {c.harvesting}</p>
                </div>
                <div className="mt-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-950/30 text-xs text-brand-700 dark:text-brand-300">
                  <Sprout className="w-3 h-3 inline mr-1" />{c.tip}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Pest Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="section-title">{lang === 'te' ? 'పురుగు & వ్యాధుల హెచ్చరికలు' : 'Pest & Disease Alerts'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PEST_ALERTS.map((p, i) => (
              <Card key={i} hover className="p-4 border-l-4 border-l-red-400 dark:border-l-red-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-red-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{p.pest}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${severityColor[p.severity]}`}>{p.severity}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1"><span className="font-medium">Crop:</span> {p.crop} · <span className="font-medium">Season:</span> {p.season}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2"><span className="font-medium text-slate-700 dark:text-slate-200">{lang === 'te' ? 'లక్షణాలు:' : 'Symptoms:'}</span> {p.symptom}</p>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">{lang === 'te' ? 'పరిష్కారం:' : 'Remedy:'}</span> {p.remedy}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Fertilizers + Irrigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-govt-600 dark:text-govt-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'ఎరువు సమాచారం' : 'Fertilizer Guide'}</h2>
            </div>
            <div className="space-y-3">
              {fertilizers.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{f.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{f.use}</p>
                  </div>
                  <span className="text-xs font-bold text-govt-600 dark:text-govt-400">{f.dose}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'నీటి పారుదల చిట్కాలు' : 'Irrigation Tips'}</h2>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-2"><span className="text-brand-500">•</span> {lang === 'te' ? 'వరిలో AWD పద్ధతి — 30% నీరు ఆదా.' : 'Practice Alternate Wetting & Drying (AWD) for paddy — saves 30% water.'}</li>
              <li className="flex gap-2"><span className="text-brand-500">•</span> {lang === 'te' ? 'మట్టి తేమను క్రమం తప్పకుండా పరిశీలించండి.' : 'Monitor soil moisture regularly to avoid over-irrigation.'}</li>
              <li className="flex gap-2"><span className="text-brand-500">•</span> {lang === 'te' ? 'చుక్కల నీటి పారుదలతో నీటి ఆదా.' : 'Use drip irrigation for vegetables and sugarcane.'}</li>
              <li className="flex gap-2"><span className="text-brand-500">•</span> {lang === 'te' ? 'కృష్ణా కాలువల షెడ్యూల్ అనుసరించండి.' : 'Follow Krishna canal irrigation schedule for water release.'}</li>
            </ul>
          </Card>
        </div>

        {/* Agri Resources */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="section-title">{lang === 'te' ? 'వ్యవసాయ వనరులు' : 'Agricultural Resources'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGRI_RESOURCES.map((r, i) => (
              <Card key={i} hover className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                    <Tractor className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{r.name}</h3>
                    <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mt-1">{r.type}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{r.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <a href={`tel:${r.contact}`} className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />{r.contact}
                  </a>
                  <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{r.hours}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Govt Subsidies */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="section-title">{lang === 'te' ? 'ప్రభుత్వ రాయితీలు' : 'Government Subsidies'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GOVT_AGRI_SUBSIDIES.map((s, i) => (
              <Card key={i} hover className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{s.name}</h3>
                </div>
                <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">{s.subsidy}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Equipment Rental & Sharing Platform */}
        <EquipmentRental lang={lang} />

        {/* Soil Health */}
        <Card className="p-6 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border-teal-200 dark:border-teal-800">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
              <CloudSun className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white mb-1">{lang === 'te' ? 'నేల ఆరోగ్య కార్డు' : 'Soil Health Card'}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'te'
                  ? 'కృష్ణా డెల్టా నేలలు సారవంతమైన నల్లరేగడి, లోమ్ నేలలు. మీ నేల ఆరోగ్య కార్డు కోసం సమీప RBK సందర్శించండి.'
                  : 'Krishna delta soils are mostly fertile black cotton and loamy soils. Visit your nearest Rythu Bharosa Kendram (RBK) to get a free Soil Health Card with nutrient recommendations.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
