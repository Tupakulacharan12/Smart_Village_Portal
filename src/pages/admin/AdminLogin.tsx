import { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function AdminLogin({ navigate }: { navigate: (to: string) => void }) {
  const { signIn } = useAuth();
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('home')} className="btn-ghost mb-6 -ml-2 text-sm">
          <ArrowLeft className="w-4 h-4" />
          {lang === 'te' ? 'హోమ్‌కు తిరిగి' : 'Back to Home'}
        </button>

        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'అడ్మిన్ లాగిన్' : 'Admin Login'}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{lang === 'te' ? 'నిర్వహణ ప్యానెల్‌కు సైన్ ఇన్ చేయండి' : 'Sign in to the management panel'}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label-field">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-11"
                  placeholder="admin@gudlavalleru.gov.in"
                />
              </div>
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {lang === 'te' ? 'లాగిన్' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
            {lang === 'te'
              ? 'గమనిక: అడ్మిన్ ఖాతాను Supabase లో సృష్టించాలి. దయచేసి సిస్టమ్ నిర్వాహకుడిని సంప్రదించండి.'
              : 'Note: Admin accounts are created in Supabase. Please contact the system administrator for credentials.'}
          </div>
        </div>
      </div>
    </div>
  );
}
