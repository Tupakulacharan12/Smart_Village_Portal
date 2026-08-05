import { useState } from 'react';
import { Star, Send, MessageSquarePlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export function FeedbackWidget() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus('submitting');
    const { error } = await supabase.from('feedback').insert({
      name: name.trim(),
      email: email.trim() || null,
      message: message.trim(),
      rating,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('done');
      setName(''); setEmail(''); setMessage(''); setRating(5);
      setTimeout(() => { setStatus('idle'); setOpen(false); }, 2500);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center">
          <MessageSquarePlus className="w-5.5 h-5.5 text-saffron-600 dark:text-saffron-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">{t('feedback')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('feedbackSub')}</p>
        </div>
      </div>

      {!open ? (
        <button onClick={() => setOpen(true)} className="btn-accent w-full">
          <MessageSquarePlus className="w-4 h-4" />
          {t('feedback')}
        </button>
      ) : status === 'done' ? (
        <div className="py-6 text-center animate-scale-in">
          <div className="w-12 h-12 mx-auto rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-2">
            <Star className="w-6 h-6 text-brand-600 fill-brand-500" />
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-semibold">{t('feedbackSent')}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3 animate-fade-in-fast">
          <div>
            <label className="label-field">{t('yourName')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder={lang === 'te' ? 'మీ పేరు' : 'Your name'} />
          </div>
          <div>
            <label className="label-field">{t('email')}</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input-field" placeholder="email@example.com" />
          </div>
          <div>
            <label className="label-field">{t('rating')}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      (hover || rating) >= n ? 'text-saffron-500 fill-saffron-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-field">{t('yourFeedback')}</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={3} className="input-field resize-none" placeholder={lang === 'te' ? 'మీ అభిప్రాయం...' : 'Your feedback...'} />
          </div>
          {status === 'error' && (
            <p className="text-sm text-red-600">{lang === 'te' ? 'పొరపాటు! మళ్ళీ ప్రయత్నించండి.' : 'Something went wrong. Please try again.'}</p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={status === 'submitting'} className="btn-primary flex-1">
              <Send className="w-4 h-4" />
              {status === 'submitting' ? t('loading') : t('submit')}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-outline">{t('cancel')}</button>
          </div>
        </form>
      )}
    </div>
  );
}
