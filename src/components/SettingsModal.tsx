import { Check, Moon, Sun, Globe, X, Languages as LangIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LANGUAGE_LABELS } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in-fast">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-md w-full card overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-600 to-govt-600">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-white" />
            <h2 className="font-bold text-white text-lg">{t('settingsTitle')}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LangIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">{t('language')}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('languageDesc')}</p>
            <div className="space-y-2">
              {LANGUAGE_LABELS.map((l) => {
                const active = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code as Language)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
                      active
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l.flag}</span>
                      <div className="text-left">
                        <p className={`font-semibold text-sm ${active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>{l.nativeLabel}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{l.label}</p>
                      </div>
                    </div>
                    {active && <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-white" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('appearance')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t('darkModeDesc')}</p>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-saffron-100'}`}>
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-saffron-600" />}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('darkMode')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{theme === 'dark' ? (lang === 'te' ? 'ఆన్‌లో ఉంది' : lang === 'hi' ? 'चालू है' : 'Currently on') : (lang === 'te' ? 'ఆఫ్‌లో ఉంది' : lang === 'hi' ? 'बंद है' : 'Currently off')}</p>
                </div>
              </div>
              <div className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="btn-primary w-full">{lang === 'te' ? 'పూర్తయ్యింది' : lang === 'hi' ? 'हो गया' : 'Done'}</button>
        </div>
      </div>
    </div>
  );
}
