import { useEffect, useState, useMemo } from 'react';
import {
  Trash2, Send, Search, CheckCircle2, Clock, Loader2, AlertCircle,
  Image as ImageIcon, X, MapPin, Phone, Calendar, Users, Recycle,
  Flame, Sprout, Split, Repeat, MonitorSmartphone, HandHeart, ChevronRight,
  Sparkles, TrendingUp, Eye,
} from 'lucide-react';
import { PageHeader, Card, StatusBadge } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import {
  WASTE_TYPES, VOLUNTEER_AVAILABILITY, GARBAGE_SCHEDULE,
  RECYCLING_TIPS, CLEANLINESS_CAMPAIGNS, VILLAGE_AREAS,
} from '@/lib/data';
import type { WasteComplaint, WasteComplaintStatus } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const RECYCLE_ICONS: Record<string, LucideIcon> = {
  Split, Sprout, Recycle, Repeat, MonitorSmartphone, Flame,
};

type Tab = 'complaint' | 'schedule' | 'recycle' | 'volunteer' | 'campaigns';

export function WasteManagement() {
  const { lang, t } = useLanguage();
  const [tab, setTab] = useState<Tab>('complaint');

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'complaint', label: lang === 'te' ? 'ఫిర్యాదు' : 'Complaint', icon: AlertCircle },
    { id: 'schedule', label: lang === 'te' ? 'షెడ్యూల్' : 'Schedule', icon: Calendar },
    { id: 'recycle', label: lang === 'te' ? 'రీసైకిల్' : 'Recycling', icon: Recycle },
    { id: 'volunteer', label: lang === 'te' ? 'వాలంటీర్' : 'Volunteer', icon: Users },
    { id: 'campaigns', label: lang === 'te' ? 'అభియానాలు' : 'Campaigns', icon: Sparkles },
  ];

  return (
    <div>
      <PageHeader
        title={t('wasteManagement')}
        subtitle={lang === 'te'
          ? 'శుభ్రమైన గ్రామం — వ్యర్థ నిర్వహణ, ఫిర్యాదులు, రీసైకిల్, వాలంటీర్'
          : lang === 'hi'
            ? 'स्वच्छ गाँव — कचरा प्रबंधन, शिकायत, रीसाइकल, स्वयंसेवक'
            : 'Clean Village — waste management, complaints, recycling, volunteers'}
        icon={Trash2}
        image="https://images.pexels.com/photos/2832065/pexels-photo-2832065.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 sm:py-12">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6 overflow-x-auto">
          {tabs.map((tabItem) => {
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  tab === tabItem.id
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tabItem.label}
              </button>
            );
          })}
        </div>

        {tab === 'complaint' && <ComplaintTab lang={lang} t={t} />}
        {tab === 'schedule' && <ScheduleTab lang={lang} />}
        {tab === 'recycle' && <RecycleTab lang={lang} />}
        {tab === 'volunteer' && <VolunteerTab lang={lang} />}
        {tab === 'campaigns' && <CampaignsTab lang={lang} />}
      </div>
    </div>
  );
}

// ─── Complaint Tab ───
function ComplaintTab({ lang, t }: { lang: 'en' | 'te' | 'hi'; t: (k: import('@/lib/i18n').TranslationKey) => string }) {
  const [complaints, setComplaints] = useState<WasteComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewComplaint, setViewComplaint] = useState<WasteComplaint | null>(null);
  const [filter, setFilter] = useState<'all' | WasteComplaintStatus>('all');

  const fetchComplaints = async () => {
    const { data } = await supabase
      .from('waste_complaints')
      .select('*')
      .order('created_at', { ascending: false });
    setComplaints(data as WasteComplaint[] ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  const stats = [
    { label: lang === 'te' ? 'మొత్తం' : 'Total', value: complaints.length, color: 'slate' },
    { label: lang === 'te' ? 'పెండింగ్' : 'Pending', value: complaints.filter(c => c.status === 'pending').length, color: 'amber' },
    { label: lang === 'te' ? 'పరిష్కారం' : 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, color: 'green' },
  ];

  return (
    <div className="space-y-5">
      {/* Stats + CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid grid-cols-3 gap-3 flex-1">
          {stats.map((s, i) => {
            const colorMap: Record<string, string> = {
              slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
              amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
              green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            };
            return (
              <div key={i} className="card p-3 text-center">
                <div className={`w-9 h-9 rounded-lg ${colorMap[s.color]} flex items-center justify-center mx-auto mb-2`}>
                  <Trash2 className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            );
          })}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm whitespace-nowrap self-start sm:self-auto">
          <Send className="w-4 h-4" />
          {lang === 'te' ? 'ఫిర్యాదు చేయండి' : 'Register Complaint'}
        </button>
      </div>

      {/* Info banner */}
      <Card className="p-4 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
        <div className="flex items-start gap-3">
          <HandHeart className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'te'
              ? 'మీ వీధి లేదా ప్రాంతంలో వ్యర్థ సమస్య ఉంటే ఫిర్యాదు చేయండి. పంచాయతీ అధికారులు చూసి స్పందిస్తారు.'
              : 'Report waste issues in your street or area. Panchayat authorities will review and respond.'}
          </p>
        </div>
      </Card>

      {/* Filter buttons */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
        {(['all', 'pending', 'in-progress', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {f === 'all' ? (lang === 'te' ? 'అన్నీ' : 'All') :
              f === 'pending' ? (lang === 'te' ? 'పెండింగ్' : 'Pending') :
              f === 'in-progress' ? (lang === 'te' ? 'పురోగతి' : 'In Progress') :
              (lang === 'te' ? 'పరిష్కారం' : 'Resolved')}
          </button>
        ))}
      </div>

      {/* Complaints list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Trash2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'te' ? 'ఇంకా ఫిర్యాదులు లేవు.' : 'No complaints yet.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} hover className="p-4 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">{c.waste_type}</span>
                  <StatusBadge status={c.status === 'resolved' ? 'completed' : c.status === 'in-progress' ? 'in-progress' : 'pending'} />
                </div>
                <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 mb-2">{c.message}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.area}</span>
                <span className="truncate">{c.address}</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">— {c.reporter_name}</span>
                <button onClick={() => setViewComplaint(c)} className="btn-ghost text-xs !py-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {lang === 'te' ? 'వివరాలు' : 'View'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Complaint form modal */}
      {showForm && (
        <ComplaintFormModal
          lang={lang}
          t={t}
          onClose={() => setShowForm(false)}
          onSuccess={() => { fetchComplaints(); setShowForm(false); }}
        />
      )}

      {/* Complaint detail modal */}
      {viewComplaint && (
        <ComplaintDetailModal complaint={viewComplaint} lang={lang} onClose={() => setViewComplaint(null)} />
      )}
    </div>
  );
}

function ComplaintFormModal({ lang, t, onClose, onSuccess }: {
  lang: 'en' | 'te' | 'hi';
  t: (k: import('@/lib/i18n').TranslationKey) => string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    reporter_name: '', reporter_mobile: '', area: '', address: '',
    waste_type: 'Garbage Overflow', message: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.reporter_name || !form.reporter_mobile || !form.area || !form.address || !form.message) {
      setError(lang === 'te' ? 'దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.' : 'Please fill all required fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.reporter_mobile)) {
      setError(lang === 'te' ? 'సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : 'Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const { error: dbError } = await supabase.from('waste_complaints').insert({
      reporter_name: form.reporter_name,
      reporter_mobile: form.reporter_mobile,
      area: form.area,
      address: form.address,
      waste_type: form.waste_type,
      message: form.message,
      image_data: image,
      status: 'pending',
    });
    setSubmitting(false);

    if (dbError) {
      setError(lang === 'te' ? 'లోపం జరిగింది. మళ్లీ ప్రయత్నించండి.' : 'Something went wrong. Please try again.');
      return;
    }
    onSuccess();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={onClose} />
      <div className="relative card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              {lang === 'te' ? 'వ్యర్థ ఫిర్యాదు' : 'Waste Complaint'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">
              {lang === 'te' ? 'వ్యర్థ రకం' : 'Waste Type'} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WASTE_TYPES.map((wt) => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => setForm({ ...form, waste_type: wt })}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    form.waste_type === wt
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-[11px] font-medium ${form.waste_type === wt ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>{wt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                {lang === 'te' ? 'మీ పేరు' : 'Your Name'} <span className="text-red-500">*</span>
              </label>
              <input value={form.reporter_name} onChange={(e) => setForm({ ...form, reporter_name: e.target.value })} className="input-field" placeholder={lang === 'te' ? 'మీ పేరు' : 'Your name'} />
            </div>
            <div>
              <label className="label-field">
                {lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number'} <span className="text-red-500">*</span>
              </label>
              <input value={form.reporter_mobile} onChange={(e) => setForm({ ...form, reporter_mobile: e.target.value })} maxLength={10} className="input-field" placeholder="98XXXXXXXX" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                {lang === 'te' ? 'ప్రాంతం' : 'Area'} <span className="text-red-500">*</span>
              </label>
              <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field">
                <option value="">{lang === 'te' ? 'ప్రాంతం ఎంచుకోండి' : 'Select area'}</option>
                {VILLAGE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">
                {lang === 'te' ? 'చిరునామా / వీధి' : 'Address / Street'} <span className="text-red-500">*</span>
              </label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" placeholder={lang === 'te' ? 'ఉదా: 4వ వార్డ్, రామాలయం వీధి' : 'e.g. Ward 4, Ramalayam Street'} />
            </div>
          </div>

          <div>
            <label className="label-field">
              {lang === 'te' ? 'సమస్య వివరాలు' : 'Issue Description'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="input-field resize-none"
              placeholder={lang === 'te'
                ? 'ఉదా: మా వీధిలో గత 3 రోజులుగా చెత్త తీసుకోవడం లేదు. దుర్గంధం వస్తోంది.'
                : 'e.g. Garbage has not been collected in our street for 3 days. Bad smell is spreading.'}
            />
          </div>

          <div>
            <label className="label-field">{lang === 'te' ? 'ఫోటో' : 'Photo'}</label>
            <div className="flex items-center gap-3">
              <label className="btn-outline cursor-pointer text-sm">
                <ImageIcon className="w-4 h-4" />
                {lang === 'te' ? 'ఫోటో ఎంచుకోండి' : 'Choose Photo'}
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
              {image && (
                <div className="relative">
                  <img src={image} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
                  <button type="button" onClick={() => setImage(null)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {lang === 'te' ? 'ఫిర్యాదు పంపండి' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ComplaintDetailModal({ complaint, lang, onClose }: {
  complaint: WasteComplaint;
  lang: 'en' | 'te' | 'hi';
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={onClose} />
      <div className="relative card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">{complaint.waste_type}</span>
            <StatusBadge status={complaint.status === 'resolved' ? 'completed' : complaint.status === 'in-progress' ? 'in-progress' : 'pending'} />
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {complaint.image_data && (
          <img src={complaint.image_data} alt="complaint" className="w-full rounded-xl mb-4" />
        )}

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'పేరు' : 'Name'}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{complaint.reporter_name}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'మొబైల్' : 'Mobile'}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{complaint.reporter_mobile}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'ప్రాంతం' : 'Area'}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{complaint.area}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'చిరునామా' : 'Address'}</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{complaint.address}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{lang === 'te' ? 'సందేశం' : 'Message'}</p>
            <p className="text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">{complaint.message}</p>
          </div>

          {complaint.admin_notes && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'te' ? 'అధికారిక స్పందన' : 'Official Response'}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{complaint.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Tab ───
function ScheduleTab({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="font-bold text-slate-900 dark:text-white">
            {lang === 'te' ? 'గార్బేజ్ సేకరణ షెడ్యూల్' : 'Garbage Collection Schedule'}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {lang === 'te'
            ? 'మీ వార్డ్ ప్రకారం చెత్త సేకరణ సమయాలు. సమయానికి ముందే చెత్త బయట పెట్టండి.'
            : 'Collection times by ward. Place waste outside before the collection time.'}
        </p>
        <div className="space-y-2">
          {GARBAGE_SCHEDULE.map((s, i) => {
            const isToday = s.day === today;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isToday ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800' : 'bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <div className={`w-16 text-center shrink-0 ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>
                  <p className="text-sm font-bold">{s.day.slice(0, 3)}</p>
                  {isToday && <p className="text-[9px] font-semibold uppercase">{lang === 'te' ? 'ఈరోజు' : 'Today'}</p>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.areas}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{s.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Split className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              {lang === 'te' ? 'వ్యర్థ విభజన గుర్తు' : 'Waste Segregation Reminder'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'te'
                ? 'తడి వ్యర్థం (ఆహారం) పచ్చ బిన్‌లో, పొడి వ్యర్థం (ప్లాస్టిక్, కాగితం) నీలం బిన్‌లో వేయండి.'
                : 'Wet waste (food) in green bin, dry waste (plastic, paper) in blue bin. Please segregate before disposal.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Recycle Tab ───
function RecycleTab({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
          <Recycle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'te' ? 'రీసైకిల్ & వ్యర్థ తగ్గింపు' : 'Recycling & Waste Reduction'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {lang === 'te'
            ? 'చిన్న మార్పులు — పెద్ద మార్పు. ఈ అలవాట్లు గ్రామాన్ని శుభ్రంగా ఉంచుతాయి.'
            : 'Small changes, big impact. These habits keep our village clean and green.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RECYCLING_TIPS.map((tip, i) => {
          const Icon = RECYCLE_ICONS[tip.icon] ?? Recycle;
          return (
            <Card key={i} hover className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {lang === 'te' ? tip.te : tip.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {lang === 'te' ? tip.desc_te : tip.desc}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {lang === 'te' ? 'మన గ్రామం లక్ష్యం' : 'Our Village Goal'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {lang === 'te'
                ? '2026 సంవత్సరానికి ప్లాస్టిక్ రహిత, 100% వ్యర్థ విభజన గ్రామం.'
                : 'Plastic-free, 100% waste-segregation village by 2026.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Volunteer Tab ───
function VolunteerTab({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  const [showForm, setShowForm] = useState(false);
  const [volunteers, setVolunteers] = useState<{ id: string; name: string; area: string; availability: string }[]>([]);
  const [success, setSuccess] = useState(false);

  const fetchVolunteers = async () => {
    const { data } = await supabase.from('waste_volunteers').select('id, name, area, availability').eq('status', 'active').order('created_at', { ascending: false }).limit(6);
    setVolunteers(data ?? []);
  };

  useEffect(() => { fetchVolunteers(); }, []);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card className="overflow-hidden border-0">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <HandHeart className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">
                {lang === 'te' ? 'శుభ్రత వాలంటీర్ అవ్వండి' : 'Become a Cleanliness Volunteer'}
              </h2>
              <p className="text-green-100 text-sm">
                {lang === 'te'
                  ? 'మీ గ్రామాన్ని శుభ్రంగా ఉంచడానికి ముందుకు రండి. కేవలం 2 గంటలు వారానికి.'
                  : 'Step forward to keep your village clean. Just 2 hours a week makes a difference.'}
              </p>
            </div>
            <button onClick={() => setShowForm(true)} className="bg-white text-green-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors whitespace-nowrap">
              {lang === 'te' ? 'నమోదు చేయండి' : 'Register Now'}
            </button>
          </div>
        </div>
      </Card>

      {/* Volunteer stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: lang === 'te' ? 'వాలంటీర్లు' : 'Volunteers', value: volunteers.length },
          { icon: Calendar, label: lang === 'te' ? 'అభియానాలు' : 'Drives', value: '3' },
          { icon: MapPin, label: lang === 'te' ? 'వార్డులు' : 'Wards', value: '8' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-3 text-center">
              <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent volunteers */}
      {volunteers.length > 0 && (
        <Card className="p-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
            {lang === 'te' ? 'ఇటీవలి వాలంటీర్లు' : 'Recent Volunteers'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {volunteers.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{v.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{v.area} · {v.availability}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Volunteer form modal */}
      {showForm && (
        <VolunteerFormModal
          lang={lang}
          onClose={() => setShowForm(false)}
          onSuccess={() => { fetchVolunteers(); setShowForm(false); setSuccess(true); }}
        />
      )}

      {/* Success toast */}
      {success && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className="card px-5 py-3 flex items-center gap-2 shadow-lg border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {lang === 'te' ? 'వాలంటీర్‌గా నమోదు అయ్యారు! ధన్యవాదాలు.' : 'Registered as volunteer! Thank you.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function VolunteerFormModal({ lang, onClose, onSuccess }: {
  lang: 'en' | 'te' | 'hi';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ name: '', mobile: '', area: '', availability: 'Weekends', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.mobile || !form.area) {
      setError(lang === 'te' ? 'దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.' : 'Please fill all required fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      setError(lang === 'te' ? 'సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : 'Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const { error: dbError } = await supabase.from('waste_volunteers').insert({
      name: form.name,
      mobile: form.mobile,
      area: form.area,
      availability: form.availability,
      message: form.message || null,
      status: 'active',
    });
    setSubmitting(false);

    if (dbError) {
      setError(lang === 'te' ? 'లోపం జరిగింది. మళ్లీ ప్రయత్నించండి.' : 'Something went wrong. Please try again.');
      return;
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in-fast" onClick={onClose} />
      <div className="relative card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <HandHeart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              {lang === 'te' ? 'వాలంటీర్ నమోదు' : 'Volunteer Registration'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">{lang === 'te' ? 'మీ పేరు' : 'Your Name'} <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder={lang === 'te' ? 'మీ పేరు' : 'Your name'} />
          </div>
          <div>
            <label className="label-field">{lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number'} <span className="text-red-500">*</span></label>
            <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} maxLength={10} className="input-field" placeholder="98XXXXXXXX" />
          </div>
          <div>
            <label className="label-field">{lang === 'te' ? 'ప్రాంతం' : 'Area'} <span className="text-red-500">*</span></label>
            <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field">
              <option value="">{lang === 'te' ? 'ప్రాంతం ఎంచుకోండి' : 'Select area'}</option>
              {VILLAGE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">{lang === 'te' ? 'అందుబాటు' : 'Availability'}</label>
            <div className="grid grid-cols-2 gap-2">
              {VOLUNTEER_AVAILABILITY.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setForm({ ...form, availability: av })}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    form.availability === av ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-medium ${form.availability === av ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>{av}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-field">{lang === 'te' ? 'ఎందుకు వాలంటీర్ అవ్వాలనుకుంటున్నారు?' : 'Why do you want to volunteer?'}</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="input-field resize-none" placeholder={lang === 'te' ? 'మీ అభిప్రాయం...' : 'Your thoughts...'} />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center !bg-green-600 hover:!bg-green-700">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {lang === 'te' ? 'నమోదు చేయండి' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Campaigns Tab ───
function CampaignsTab({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {lang === 'te' ? 'శుభ్రత అభియానాలు' : 'Cleanliness Campaigns'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {lang === 'te'
            ? 'ఈ అభియానాల్లో పాల్గొనండి. మనందరం కలిసి గ్రామాన్ని శుభ్రంగా ఉంచుదాం.'
            : 'Join these campaigns. Together we keep our village clean and beautiful.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLEANLINESS_CAMPAIGNS.map((camp, i) => (
          <Card key={i} hover className="overflow-hidden flex flex-col">
            <div className="h-28 bg-gradient-to-br from-brand-500 to-brand-700 relative flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white/80" />
              <span className="absolute top-3 right-3 badge bg-white/90 text-brand-700">{camp.date}</span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                {lang === 'te' ? camp.te : camp.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {lang === 'te' ? camp.desc_te : camp.desc}
              </p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{camp.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{camp.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              {lang === 'te' ? 'సంప్రదించండి' : 'Contact for Campaigns'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'te'
                ? 'అభియానాల గురించి ఎక్కువ తెలుసుకోవడానికి పంచాయతీ కార్యాలయానికి కాల్ చేయండి.'
                : 'Call the Panchayat Office to learn more about joining campaigns.'}
            </p>
            <a href="tel:08676234567" className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-2 inline-block">08676-234567</a>
          </div>
        </div>
      </Card>
    </div>
  );
}