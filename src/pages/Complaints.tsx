import { useState } from 'react';
import {
  MessageSquareWarning, Send, Ticket, Search, CheckCircle2, Clock, Loader2,
  AlertCircle, Image as ImageIcon, X, ChevronRight, HelpCircle, Phone,
  TrendingUp, ShieldCheck, Lightbulb, ChevronDown,
} from 'lucide-react';
import { PageHeader, Card, StatusBadge } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { COMPLAINT_CATEGORIES, VILLAGE_AREAS, COMPLAINT_FAQ } from '@/lib/data';
import type { ComplaintTrackResult } from '@/lib/types';

type Tab = 'submit' | 'track' | 'faq';

export function Complaints() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState<Tab>('submit');

  return (
    <div>
      <PageHeader
        title={t('complaints')}
        subtitle={lang === 'te'
          ? 'మీ సమస్యలను నమోదు చేయండి, టికెట్ నంబర్‌తో ట్రాక్ చేయండి'
          : lang === 'hi'
            ? 'अपनी समस्याएँ दर्ज करें और टिकट नंबर से ट्रैक करें'
            : 'Register your issues and track them by ticket number'}
        icon={MessageSquareWarning}
        image="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Clock, label: lang === 'te' ? 'సగటు ప్రతిస్పందన' : lang === 'hi' ? 'औसत प्रतिक्रिया' : 'Avg Response', value: '< 48 hrs', color: 'amber' },
            { icon: TrendingUp, label: lang === 'te' ? 'పరిష్కార రేటు' : lang === 'hi' ? 'समाधान दर' : 'Resolution Rate', value: '92%', color: 'brand' },
            { icon: ShieldCheck, label: lang === 'te' ? 'గోప్యత' : 'Confidential', value: '100%', color: 'teal' },
          ].map((s, i) => {
            const Icon = s.icon;
            const colorMap: Record<string, string> = {
              amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
              brand: 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
              teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
            };
            return (
              <div key={i} className="card p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[s.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6 max-w-md">
          {[
            { id: 'submit' as Tab, label: t('submitComplaint') },
            { id: 'track' as Tab, label: t('trackComplaint') },
            { id: 'faq' as Tab, label: 'FAQ' },
          ].map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === tabItem.id
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {tab === 'submit' && <SubmitForm lang={lang} t={t} />}
        {tab === 'track' && <TrackForm lang={lang} t={t} />}
        {tab === 'faq' && <FAQSection lang={lang} />}
      </div>
    </div>
  );
}

function SubmitForm({ lang, t }: { lang: 'en' | 'te' | 'hi'; t: (k: import('@/lib/i18n').TranslationKey) => string }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', area: '', category: '', description: '' });
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ticket: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<typeof COMPLAINT_CATEGORIES[0] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.mobile || !form.area || !form.category || !form.description) {
      setError(lang === 'te' ? 'దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.' : 'Please fill all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError(lang === 'te' ? 'సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : 'Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const ticket = `GVL-${Date.now().toString().slice(-4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const { error: dbError } = await supabase.from('complaints').insert({
      ticket_no: ticket,
      name: form.name,
      mobile: form.mobile,
      email: form.email || null,
      area: form.area,
      category: form.category,
      description: form.description,
      image_data: image,
      status: 'pending',
    });

    setSubmitting(false);

    if (dbError) {
      setError(lang === 'te' ? 'సమర్పణలో లోపం. మళ్లీ ప్రయత్నించండి.' : 'Submission failed. Please try again.');
      return;
    }

    setResult({ ticket });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setError(lang === 'te' ? 'చిత్రం 1.5MB కంటే తక్కువ ఉండాలి.' : 'Image must be under 1.5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (result) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {lang === 'te' ? 'ఫిర్యాదు విజయవంతంగా దాఖలైంది!' : lang === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज हुई!' : 'Complaint Submitted Successfully!'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('saveTicket')}</p>
        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('yourTicket')}</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 tracking-wider">{result.ticket}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setResult(null); setForm({ name: '', mobile: '', email: '', area: '', category: '', description: '' }); setImage(null); setSelectedCat(null); }}
            className="btn-outline flex-1 justify-center"
          >
            {lang === 'te' ? 'మరొక ఫిర్యాదు' : lang === 'hi' ? 'नई शिकायत' : 'New Complaint'}
          </button>
          <button
            onClick={() => { navigator.clipboard?.writeText(result.ticket); }}
            className="btn-primary flex-1 justify-center"
          >
            {lang === 'te' ? 'టికెట్ కాపీ' : lang === 'hi' ? 'टिकट कॉपी' : 'Copy Ticket'}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
        <Card className="p-6 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            {t('submitComplaint')}
          </h2>

          {/* Category selector with SLA */}
          <div>
            <label className="label-field">{t('category')} <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMPLAINT_CATEGORIES.map((cat) => {
                const active = form.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { setForm({ ...form, category: cat.value }); setSelectedCat(cat); }}
                    className={`p-3 rounded-xl text-left border-2 transition-all ${
                      active
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cat.value}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        cat.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        cat.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>{cat.priority}</span>
                      <span className="text-[10px] text-slate-400">SLA: {cat.sla}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">{t('yourName')} <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder={t('yourName')} />
            </div>
            <div>
              <label className="label-field">{t('mobile')} <span className="text-red-500">*</span></label>
              <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} maxLength={10} className="input-field" placeholder="98XXXXXXXX" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">{t('email')}</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-field">{t('area')} <span className="text-red-500">*</span></label>
              <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field">
                <option value="">{lang === 'te' ? 'ప్రాంతం ఎంచుకోండి' : 'Select area'}</option>
                {VILLAGE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">{t('description')} <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" placeholder={lang === 'te' ? 'సమస్యను వివరించండి...' : 'Describe the issue in detail...'} />
          </div>

          <div>
            <label className="label-field">{t('uploadImage')}</label>
            <div className="flex items-center gap-3">
              <label className="btn-outline cursor-pointer text-sm">
                <ImageIcon className="w-4 h-4" />
                {lang === 'te' ? 'ఫోటో ఎంచుకోండి' : 'Choose Photo'}
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
              {image && (
                <div className="relative">
                  <img src={image} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
                  <button type="button" onClick={() => setImage(null)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Max 1.5MB · JPG/PNG</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {t('submit')}
          </button>
        </Card>
      </form>

      {/* Tips sidebar */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {lang === 'te' ? 'సమర్పణ చిట్కాలు' : lang === 'hi' ? 'सुझाव' : 'Submission Tips'}
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-brand-500 shrink-0">1.</span> {lang === 'te' ? 'సమస్యను స్పష్టంగా వివరించండి — తేదీ, సమయం, ప్రాంతం పేర్కొనండి.' : 'Describe the issue clearly — mention date, time, and exact location.'}</li>
            <li className="flex gap-2"><span className="text-brand-500 shrink-0">2.</span> {lang === 'te' ? 'ఫోటో జతపరచడం వల్ల పరిష్కారం వేగవంతం అవుతుంది.' : 'Attaching a photo helps resolve the issue faster.'}</li>
            <li className="flex gap-2"><span className="text-brand-500 shrink-0">3.</span> {lang === 'te' ? 'టికెట్ నంబర్ భద్రంగా ఉంచండి — ట్రాక్ చేయడానికి అవసరం.' : 'Save your ticket number — you need it to track the complaint.'}</li>
            <li className="flex gap-2"><span className="text-brand-500 shrink-0">4.</span> {lang === 'te' ? 'అత్యవసర సమస్యల కోసం పంచాయతీకి కాల్ చేయండి.' : 'For urgent issues, also call the Panchayat office.'}</li>
          </ul>
        </Card>

        {selectedCat && (
          <Card className="p-5 bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{selectedCat.value}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Priority</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedCat.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Expected Resolution</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400">{selectedCat.sla}</span>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {lang === 'te' ? 'అత్యవసర సంప్రదింపు' : 'Emergency Contact'}
            </h3>
          </div>
          <a href="tel:08676234567" className="text-brand-600 dark:text-brand-400 font-bold text-lg">08676-234567</a>
          <p className="text-xs text-slate-400 mt-1">{lang === 'te' ? 'పంచాయతీ కార్యాలయం · 9:30 AM - 5:00 PM' : 'Panchayat Office · 9:30 AM - 5:00 PM'}</p>
        </Card>
      </div>
    </div>
  );
}

function TrackForm({ lang, t }: { lang: 'en' | 'te' | 'hi'; t: (k: import('@/lib/i18n').TranslationKey) => string }) {
  const [ticket, setTicket] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplaintTrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!ticket.trim()) return;
    setLoading(true);
    const { data, error: rpcError } = await supabase.rpc('get_complaint_by_ticket', { p_ticket: ticket.trim() });
    setLoading(false);
    if (rpcError) {
      setError(lang === 'te' ? 'ట్రాక్ చేయబడలేదు. తర్వాత ప్రయత్నించండి.' : 'Could not track. Try again.');
      return;
    }
    if (!data || data.length === 0) {
      setError(lang === 'te' ? 'ఈ టికెట్ నంబర్ కనుగొనబడలేదు.' : 'Ticket number not found.');
      return;
    }
    setResult(data[0]);
  };

  const steps = [
    { key: 'pending', label: t('statusPending'), icon: Clock },
    { key: 'in-progress', label: t('statusInProgress'), icon: Loader2 },
    { key: 'completed', label: t('statusCompleted'), icon: CheckCircle2 },
  ];
  const currentIdx = result ? steps.findIndex((s) => s.key === result.status) : -1;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 mb-6">
        <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          {t('trackComplaint')}
        </h2>
        <form onSubmit={handleTrack} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              placeholder={t('enterTicket')}
              className="input-field pl-11 uppercase tracking-wide"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {t('track')}
          </button>
        </form>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm mt-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {result && (
        <Card className="p-6 animate-scale-in">
          {/* Status timeline */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'te' ? 'స్థితి' : 'Status Timeline'}
              </h3>
              <StatusBadge status={result.status} />
            </div>
            <div className="flex items-center gap-1">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const done = i <= currentIdx;
                const current = i === currentIdx;
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      done ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    } ${current ? 'ring-4 ring-brand-100 dark:ring-brand-900/40' : ''}`}>
                      <Icon className={`w-4 h-4 ${current && result.status === 'in-progress' ? 'animate-spin' : ''}`} />
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-1 rounded-full ${i < currentIdx ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span key={step.key} className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{step.label}</span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('category')}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{result.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('area')}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{result.area}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'దాఖలు తేదీ' : 'Filed Date'}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{new Date(result.created_at).toLocaleDateString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'చివరి అప్‌డేట్' : 'Last Updated'}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{new Date(result.updated_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Ticket number */}
          <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'టికెట్ నంబర్' : 'Ticket Number'}</p>
              <p className="text-sm font-bold text-brand-600 dark:text-brand-400 tracking-wider">{result.ticket_no}</p>
            </div>
            <button onClick={() => navigator.clipboard?.writeText(result.ticket_no)} className="btn-ghost text-xs !py-1.5">
              {lang === 'te' ? 'కాపీ' : 'Copy'}
            </button>
          </div>

          {result.admin_notes && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                {lang === 'te' ? 'అధికారిక గమనిక' : 'Official Note'}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{result.admin_notes}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function FAQSection({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h2 className="font-bold text-slate-900 dark:text-white">
          {lang === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు' : lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
        </h2>
      </div>
      <div className="space-y-2">
        {COMPLAINT_FAQ.map((faq, i) => {
          const isOpen = open === i;
          const q = lang === 'te' ? faq.q_te : faq.q;
          const a = lang === 'te' ? faq.a_te : faq.a;
          return (
            <Card key={i} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-in-fast">
                  {a}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
