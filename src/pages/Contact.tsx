import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { VILLAGE_INFO } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export function Contact() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Save as feedback so admin can see it too
    const { error } = await supabase.from('feedback').insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      message: form.message.trim(),
      rating: 5,
    });
    if (error) setStatus('error');
    else {
      setStatus('done');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const contactCards = [
    { icon: MapPin, label: lang === 'te' ? 'చిరునామా' : 'Address', value: `${VILLAGE_INFO.name}, ${VILLAGE_INFO.mandal}, ${VILLAGE_INFO.district}, AP - ${VILLAGE_INFO.pincode}`, color: 'brand' },
    { icon: Phone, label: lang === 'te' ? 'ఫోన్' : 'Phone', value: '08676-234567', color: 'govt', href: 'tel:08676234567' },
    { icon: Mail, label: 'Email', value: 'panchayat.gudlavalleru@ap.gov.in', color: 'saffron', href: 'mailto:panchayat.gudlavalleru@ap.gov.in' },
    { icon: Clock, label: lang === 'te' ? 'పని గంటలు' : 'Working Hours', value: lang === 'te' ? 'సోమ–శని: 9:30 AM – 5:00 PM' : 'Mon–Sat: 9:30 AM – 5:00 PM', color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300',
    govt: 'bg-govt-100 text-govt-600 dark:bg-govt-900/40 dark:text-govt-300',
    saffron: 'bg-saffron-100 text-saffron-600 dark:bg-saffron-900/40 dark:text-saffron-300',
    teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300',
  };

  return (
    <div>
      <PageHeader
        title={t('contact')}
        subtitle={lang === 'te' ? 'పంచాయతీ కార్యాలయాన్ని సంప్రదించండి' : 'Get in touch with the Panchayat Office'}
        icon={Phone}
        image="https://images.pexels.com/photos/31050823/pexels-photo-31050823.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact info */}
          <div className="lg:col-span-1 space-y-4">
            {contactCards.map((c, i) => {
              const Icon = c.icon;
              const content = (
                <Card className="p-5 flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${colorMap[c.color]} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{c.label}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{c.value}</p>
                  </div>
                </Card>
              );
              return c.href ? <a key={i} href={c.href}>{content}</a> : <div key={i}>{content}</div>;
            })}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'సందేశం పంపండి' : 'Send a Message'}</h2>
              </div>
              {status === 'done' ? (
                <div className="py-10 text-center animate-scale-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-3">
                    <Send className="w-7 h-7 text-brand-600" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{t('feedbackSent')}</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-field">{t('yourName')}</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">{t('email')}</label>
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label-field">{t('yourFeedback')}</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="input-field resize-none" />
                  </div>
                  {status === 'error' && <p className="text-sm text-red-600">{lang === 'te' ? 'పొరపాటు! మళ్ళీ ప్రయత్నించండి.' : 'Something went wrong. Please try again.'}</p>}
                  <button type="submit" disabled={status === 'sending'} className="btn-primary">
                    <Send className="w-4 h-4" />
                    {status === 'sending' ? t('loading') : t('submit')}
                  </button>
                </form>
              )}
            </Card>

            <div className="mt-6">
              <FeedbackWidget />
            </div>
          </div>
        </div>

        {/* Map */}
        <Card className="overflow-hidden mt-8">
          <iframe
            title="Panchayat office map"
            src={`https://www.google.com/maps?q=${VILLAGE_INFO.latitude},${VILLAGE_INFO.longitude}&z=16&output=embed`}
            className="w-full h-[360px] border-0"
            loading="lazy"
          />
        </Card>
      </div>
    </div>
  );
}
