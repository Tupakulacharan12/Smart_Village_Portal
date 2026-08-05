import { Siren, Phone, MapPin } from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { EMERGENCY_CONTACTS } from '@/lib/data';
import type { LucideIcon } from 'lucide-react';
import {
  Shield, Flame, Ambulance, HeartHandshake, Baby, Zap, Droplets, Stethoscope,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Shield, Flame, Ambulance, HeartHandshake, Baby, Zap, Droplets, Stethoscope,
};

const COLOR_MAP: Record<string, string> = {
  govt: 'bg-govt-100 text-govt-600 dark:bg-govt-900/40 dark:text-govt-300',
  saffron: 'bg-saffron-100 text-saffron-600 dark:bg-saffron-900/40 dark:text-saffron-300',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300',
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300',
};

export function Emergency() {
  const { lang } = useLanguage();

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'అత్యవసర సేవలు' : 'Emergency Services'}
        subtitle={lang === 'te' ? 'అత్యవసర పరిస్థితిలో ఈ నంబర్లకు కాల్ చేయండి' : 'Call these numbers in an emergency — available 24/7'}
        icon={Siren}
        image="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((c) => {
            const Icon = ICONS[c.icon] ?? Phone;
            return (
              <Card key={c.id} hover className="p-6 text-center">
                <div className={`w-14 h-14 mx-auto rounded-2xl ${COLOR_MAP[c.color]} flex items-center justify-center mb-3`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lang === 'te' ? c.name_te : lang === 'hi' ? (c.name_hi ?? c.name) : c.name}</h3>
                <a href={`tel:${c.number}`} className={`mt-2 inline-flex items-center gap-1.5 text-2xl font-bold hover:scale-105 transition-transform ${COLOR_MAP[c.color]}`}>
                  <Phone className="w-4 h-4" />
                  {c.number}
                </a>
              </Card>
            );
          })}
        </div>

        {/* Important nearby */}
        <div className="mt-10">
          <h2 className="section-title mb-6">{lang === 'te' ? 'సమీపంలోని ముఖ్యమైన కార్యాలయాలు' : 'Important Nearby Offices'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: lang === 'te' ? 'పోలీస్ స్టేషన్ - పమర్రు' : 'Police Station - Pamarru', addr: lang === 'te' ? 'పమర్రు, కృష్ణా జిల్లా' : 'Pamarru, Krishna District', phone: '08676-234500' },
              { name: lang === 'te' ? 'PHC గుడ్లవల్లేరు' : 'PHC Gudlavalleru', addr: lang === 'te' ? 'గుడ్లవల్లేరు, 521356' : 'Gudlavalleru, 521356', phone: '08676-234567' },
              { name: lang === 'te' ? 'APSPDCL విద్యుత్ కార్యాలయం' : 'APSPDCL Electricity Office', addr: lang === 'te' ? 'గుడివాడ రోడ్, గుడ్లవల్లేరు' : 'Gudivada Road, Gudlavalleru', phone: '1912' },
              { name: lang === 'te' ? 'పంచాయతీ కార్యాలయం' : 'Panchayat Office', addr: lang === 'te' ? 'గుడ్లవల్లేరు, 521356' : 'Gudlavalleru, 521356', phone: '08676-234567' },
            ].map((o, i) => (
              <Card key={i} className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{o.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{o.addr}</p>
                </div>
                <a href={`tel:${o.phone}`} className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline">{o.phone}</a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
