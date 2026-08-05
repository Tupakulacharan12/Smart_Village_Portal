import { MapPin, Phone, Mail, Clock, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VILLAGE_INFO } from '@/lib/data';
import { NAV_ITEMS } from '@/lib/nav';

interface FooterProps {
  navigate: (to: string) => void;
}

export function Footer({ navigate }: FooterProps) {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-300 mt-16">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                <span className="text-white font-display font-bold text-lg">G</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-base">
                  {lang === 'te' ? VILLAGE_INFO.name_te : lang === 'hi' ? (VILLAGE_INFO.name_hi ?? VILLAGE_INFO.name) : VILLAGE_INFO.name}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Smart Village Portal</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{t('footerTag')}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.slice(0, 6).map((item) => (
                <li key={item.route}>
                  <button onClick={() => navigate(item.route)} className="hover:text-brand-400 transition-colors">
                    {t(item.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Services</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.slice(7).map((item) => (
                <li key={item.route}>
                  <button onClick={() => navigate(item.route)} className="hover:text-brand-400 transition-colors">
                    {t(item.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">{t('panchayatOffice')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>{VILLAGE_INFO.name}, {VILLAGE_INFO.mandal}, {VILLAGE_INFO.district}, AP - {VILLAGE_INFO.pincode}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>08676-234567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>panchayat.gudlavalleru@ap.gov.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Mon–Sat: 9:30 AM – 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} {lang === 'te' ? VILLAGE_INFO.name_te : lang === 'hi' ? (VILLAGE_INFO.name_hi ?? VILLAGE_INFO.name) : VILLAGE_INFO.name} Panchayat. {t('rights')}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              {lang === 'te' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వ కార్యక్రమం' : lang === 'hi' ? 'आंध्र प्रदेश सरकार की पहल' : 'A Govt. of Andhra Pradesh Initiative'}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              CSP Project
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
