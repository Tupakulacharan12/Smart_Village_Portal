import { useEffect, useRef, useState } from 'react';
import { Menu, X, Moon, Sun, Search, ChevronDown, ShieldCheck, Settings, LogIn, LogOut, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_ITEMS } from '@/lib/nav';
import { VILLAGE_INFO } from '@/lib/data';
import { SettingsModal } from '@/components/SettingsModal';

interface NavbarProps {
  route: string;
  navigate: (to: string) => void;
  onSearch: (query: string) => void;
}

export function Navbar({ route, navigate, onSearch }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, t } = useLanguage();
  const { session, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const langShort = lang === 'en' ? 'EN' : lang === 'te' ? 'TE' : 'HI';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [route]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const primary = NAV_ITEMS.slice(0, 7);
  const secondary = NAV_ITEMS.slice(7);

  const go = (r: string) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-800 dark:bg-brand-950 text-brand-50 text-xs hidden md:block">
        <div className="container-page flex items-center justify-between py-1.5">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" />
            {lang === 'te' ? 'స్మార్ట్ విలేజ్ సమాచార పోర్టల్' : lang === 'hi' ? 'स्मार्ट विलेज सूचना पोर्टल' : 'Smart Village Information Portal'} — {lang === 'te' ? VILLAGE_INFO.name_te : lang === 'hi' ? (VILLAGE_INFO.name_hi ?? VILLAGE_INFO.name) : VILLAGE_INFO.name}
          </span>
          <span className="flex items-center gap-3">
            <button onClick={() => go('contact')} className="hover:text-white transition-colors">{t('contact')}</button>
            <span className="opacity-40">|</span>
            <button onClick={() => go('admin')} className="hover:text-white transition-colors">{t('admin')}</button>
          </span>
        </div>
      </div>

      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg'
          : 'bg-white dark:bg-slate-900 shadow-sm'
      }`}>
        <nav className="container-page flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-lg">G</span>
            </div>
            <div className="text-left leading-tight">
              <div className="font-display font-bold text-slate-900 dark:text-white text-base">
                {lang === 'te' ? VILLAGE_INFO.name_te : lang === 'hi' ? (VILLAGE_INFO.name_hi ?? VILLAGE_INFO.name) : VILLAGE_INFO.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                Smart Village Portal
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {primary.map((item) => {
              const Icon = item.icon;
              const active = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => go(item.route)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(item.labelKey)}
                </button>
              );
            })}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                {lang === 'en' ? 'More' : 'మరిన్ని'}
                <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 card p-2 animate-scale-in origin-top-right">
                  {secondary.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.route}
                        onClick={() => go(item.route)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        {t(item.labelKey)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              aria-label="Language & Settings"
              title={t('settings')}
            >
              <span className="text-xs font-bold bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded">{langShort}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            {session ? (
              <button
                onClick={() => { signOut(); navigate('home'); }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
                {lang === 'te' ? 'సైన్ అవుట్' : lang === 'hi' ? 'साइन आउट' : 'Sign Out'}
              </button>
            ) : (
              <button
                onClick={() => go('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                aria-label="Sign in"
              >
                <LogIn className="w-4 h-4" />
                {lang === 'te' ? 'సైన్ ఇన్' : lang === 'hi' ? 'साइन इन' : 'Sign In'}
              </button>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 animate-fade-in-fast">
            <div className="container-page py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t('search')}
                  onChange={(e) => onSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchOpen(false);
                      navigate('search');
                    }
                  }}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-display font-bold text-slate-900 dark:text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
            <div className="p-3 space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = route === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => go(item.route)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {t(item.labelKey)}
                  </button>
                );
              })}
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                    <User className="w-5 h-5" />
                    <span className="truncate">{session.user.email}</span>
                  </div>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); navigate('home'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <LogOut className="w-5 h-5" />
                    {lang === 'te' ? 'సైన్ అవుట్' : lang === 'hi' ? 'साइन आउट' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => go('login')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700"
                >
                  <LogIn className="w-5 h-5" />
                  {lang === 'te' ? 'సైన్ ఇన్' : lang === 'hi' ? 'साइन इन' : 'Sign In'}
                </button>
              )}
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
              <button
                onClick={() => go('admin')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ShieldCheck className="w-5 h-5" />
                {t('admin')}
              </button>
            </div>
          </div>
        </div>
      )}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
