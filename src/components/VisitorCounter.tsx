import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export function VisitorCounter() {
  const { t, lang } = useLanguage();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Log a visit
      await supabase.from('visits').insert({ visited_at: new Date().toISOString() });
      // Count total
      const { count: c } = await supabase.from('visits').select('*', { count: 'exact', head: true });
      if (mounted) setCount(c ?? 0);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <Users className="w-5 h-5 text-brand-200" />
      <div>
        <div className="text-xs text-brand-200 uppercase tracking-wide font-semibold">{t('visitorCount')}</div>
        <div className="text-lg font-bold text-white tabular-nums">
          {count === null ? '—' : count.toLocaleString(lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN')}
        </div>
      </div>
    </div>
  );
}
