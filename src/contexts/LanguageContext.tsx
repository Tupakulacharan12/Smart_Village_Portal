import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('sv-lang') as Language | null) ?? 'en';
  });

  useEffect(() => {
    localStorage.setItem('sv-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.classList.remove('font-telugu', 'font-hindi');
    if (lang === 'te') document.documentElement.classList.add('font-telugu');
    else if (lang === 'hi') document.documentElement.classList.add('font-hindi');
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const toggleLang = () => setLangState((l) => (l === 'en' ? 'te' : l === 'te' ? 'hi' : 'en'));

  const t = (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
