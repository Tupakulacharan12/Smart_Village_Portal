import { useEffect, useState, useMemo } from 'react';
import {
  Tractor, Plus, Search, Phone, MapPin, IndianRupee, X, Image as ImageIcon,
  Send, CheckCircle2, Loader2, AlertCircle, MessageSquare, Calendar, Clock,
  Package, Layers, Wheat, Droplets, SprayCan, Grid3x3, Mountain, Cog, Truck,
  Handshake, ChevronRight, TrendingUp, Users,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { EQUIPMENT_TYPES, VILLAGE_AREAS } from '@/lib/data';
import type { EquipmentListing, EquipmentRequest } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const EQUIP_ICONS: Record<string, LucideIcon> = {
  Tractor, Layers, Wheat, Droplets, SprayCan, Grid3x3, Mountain, Cog, Truck, Package,
};

export function EquipmentRental({ lang }: { lang: 'en' | 'te' | 'hi' }) {
  const [listings, setListings] = useState<EquipmentListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [requestFor, setRequestFor] = useState<EquipmentListing | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchListings = async () => {
    const { data } = await supabase
      .from('equipment_listings')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    setListings(data as EquipmentListing[] ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchType = typeFilter === 'All' || l.equipment_type === typeFilter;
      const matchQ = !query ||
        l.equipment_name.toLowerCase().includes(query.toLowerCase()) ||
        l.owner_name.toLowerCase().includes(query.toLowerCase()) ||
        l.area.toLowerCase().includes(query.toLowerCase());
      return matchType && matchQ;
    });
  }, [listings, query, typeFilter]);

  return (
    <section>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="section-title">
            {lang === 'te' ? 'పరికరాల అద్దె & పంపకం' : lang === 'hi' ? 'उपकरण किराया और साझा' : 'Equipment Rental & Sharing'}
          </h2>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          {lang === 'te' ? 'పరికరం జతపరచండి' : lang === 'hi' ? 'उपकरण जोड़ें' : 'List Equipment'}
        </button>
      </div>

      {/* Info banner */}
      <Card className="p-4 mb-5 bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'te'
              ? 'మీ వ్యవసాయ పరికరాలను (ట్రాక్టర్, రోటావేటర్, హార్వెస్టర్ మొ.) అద్దెకి లేదా పంపకం కోసం జతపరచండి. ఇతర రైతులు చూసి మీకు సందేశం పంపవచ్చు.'
              : lang === 'hi'
                ? 'अपने कृषि उपकरण (ट्रैक्टर, रोटावेटर, हार्वेस्टर आदि) किराये या साझा करने के लिए जोड़ें। अन्य किसान देखकर आपको संदेश भेज सकते हैं।'
                : 'List your agricultural equipment (tractor, rotavator, harvester, etc.) for rent or sharing. Other farmers can see it and send you a message request.'}
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: Package, label: lang === 'te' ? 'పరికరాలు' : 'Listings', value: listings.length },
          { icon: Users, label: lang === 'te' ? 'రకాలు' : 'Types', value: new Set(listings.map(l => l.equipment_type)).size },
          { icon: Handshake, label: lang === 'te' ? 'అందుబాటులో' : 'Available', value: listings.filter(l => l.status === 'available').length },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'te' ? 'పరికరం లేదా ప్రాంతం వెతకండి...' : 'Search equipment or area...'}
            className="input-field pl-11"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field sm:w-44">
          <option value="All">{lang === 'te' ? 'అన్ని రకాలు' : 'All Types'}</option>
          {EQUIPMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.value}</option>)}
        </select>
      </div>

      {/* Listings grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {lang === 'te' ? 'ఇంకా పరికరాలు లేవు. మీరే మొదట జతపరచండి!' : 'No equipment listed yet. Be the first to share!'}
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm mx-auto">
            <Plus className="w-4 h-4" />
            {lang === 'te' ? 'పరికరం జతపరచండి' : 'List Equipment'}
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const Icon = EQUIP_ICONS[EQUIPMENT_TYPES.find(t => t.value === item.equipment_type)?.icon ?? 'Package'] ?? Package;
            return (
              <Card key={item.id} hover className="overflow-hidden flex flex-col">
                {item.image_data ? (
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.image_data} alt={item.equipment_name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 badge bg-white/90 text-slate-700 backdrop-blur-sm">{item.equipment_type}</span>
                    {item.daily_rate === 0 && (
                      <span className="absolute top-3 right-3 badge bg-green-500 text-white">Free Share</span>
                    )}
                  </div>
                ) : (
                  <div className="relative h-32 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/30 dark:to-brand-950/20 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-brand-400 dark:text-brand-600" />
                    <span className="absolute top-3 left-3 badge bg-white/90 text-slate-700">{item.equipment_type}</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{item.equipment_name}</h3>
                  {item.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>}

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {item.area && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.area}</span>}
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.owner_name}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      {item.daily_rate > 0 ? (
                        <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                          <IndianRupee className="w-3.5 h-3.5 inline" />{item.daily_rate}
                          <span className="text-xs font-normal text-slate-400">/day</span>
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          {lang === 'te' ? 'ఉచిత పంపకం' : 'Free Sharing'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setRequestFor(item)}
                      className="btn-primary text-xs !py-2 !px-3"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {lang === 'te' ? 'అభ్యర్థన' : 'Request'}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* List Equipment Form Modal */}
      {showForm && (
        <ListEquipmentModal
          lang={lang}
          onClose={() => setShowForm(false)}
          onSuccess={() => { fetchListings(); setShowForm(false); setSuccessMsg(lang === 'te' ? 'మీ పరికరం విజయవంతంగా జతపరచబడింది!' : 'Equipment listed successfully!'); }}
        />
      )}

      {/* Request Equipment Modal */}
      {requestFor && (
        <RequestModal
          equipment={requestFor}
          lang={lang}
          onClose={() => setRequestFor(null)}
          onSuccess={() => { setRequestFor(null); setSuccessMsg(lang === 'te' ? 'మీ అభ్యర్థన పంపబడింది! యజమాని మీకు సంప్రదిస్తారు.' : 'Request sent! The owner will contact you.'); }}
        />
      )}

      {/* Success toast */}
      {successMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className="card px-5 py-3 flex items-center gap-2 shadow-lg border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{successMsg}</span>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── List Equipment Modal ───
function ListEquipmentModal({ lang, onClose, onSuccess }: {
  lang: 'en' | 'te' | 'hi';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    owner_name: '', owner_mobile: '', equipment_name: '', equipment_type: 'Tractor',
    description: '', daily_rate: '', area: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.owner_name || !form.owner_mobile || !form.equipment_name) {
      setError(lang === 'te' ? 'దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.' : 'Please fill all required fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.owner_mobile)) {
      setError(lang === 'te' ? 'సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : 'Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const { error: dbError } = await supabase.from('equipment_listings').insert({
      owner_name: form.owner_name,
      owner_mobile: form.owner_mobile,
      equipment_name: form.equipment_name,
      equipment_type: form.equipment_type,
      description: form.description,
      daily_rate: form.daily_rate ? parseFloat(form.daily_rate) : 0,
      area: form.area,
      image_data: image,
      status: 'available',
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
              <Plus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              {lang === 'te' ? 'పరికరం జతపరచండి' : lang === 'hi' ? 'उपकरण जोड़ें' : 'List Your Equipment'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment type selector */}
          <div>
            <label className="label-field">
              {lang === 'te' ? 'పరికరం రకం' : 'Equipment Type'} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {EQUIPMENT_TYPES.map((t) => {
                const Icon = EQUIP_ICONS[t.icon] ?? Package;
                const active = form.equipment_type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm({ ...form, equipment_type: t.value })}
                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      active ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-medium ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>{t.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                {lang === 'te' ? 'పరికరం పేరు' : 'Equipment Name'} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.equipment_name}
                onChange={(e) => setForm({ ...form, equipment_name: e.target.value })}
                className="input-field"
                placeholder={lang === 'te' ? 'ఉదా: మహీంద్రా 575 ట్రాక్టర్' : 'e.g. Mahindra 575 Tractor'}
              />
            </div>
            <div>
              <label className="label-field">
                {lang === 'te' ? 'రోజు అద్దె (₹)' : 'Daily Rate (₹)'}
              </label>
              <input
                type="number"
                value={form.daily_rate}
                onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
                className="input-field"
                placeholder={lang === 'te' ? '0 = ఉచిత పంపకం' : '0 = free sharing'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                {lang === 'te' ? 'మీ పేరు' : 'Your Name'} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.owner_name}
                onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                className="input-field"
                placeholder={lang === 'te' ? 'మీ పేరు' : 'Your name'}
              />
            </div>
            <div>
              <label className="label-field">
                {lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number'} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.owner_mobile}
                onChange={(e) => setForm({ ...form, owner_mobile: e.target.value })}
                maxLength={10}
                className="input-field"
                placeholder="98XXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="label-field">{lang === 'te' ? 'ప్రాంతం' : 'Area'}</label>
            <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-field">
              <option value="">{lang === 'te' ? 'ప్రాంతం ఎంచుకోండి' : 'Select area'}</option>
              {VILLAGE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="label-field">{lang === 'te' ? 'వివరాలు' : 'Description'}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              placeholder={lang === 'te' ? 'పరికరం స్థితి, సామర్థ్యం, ఏవైనా షరతులు...' : 'Equipment condition, capacity, any conditions...'}
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
            {lang === 'te' ? 'జతపరచండి' : 'List Equipment'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Request Equipment Modal ───
function RequestModal({ equipment, lang, onClose, onSuccess }: {
  equipment: EquipmentListing;
  lang: 'en' | 'te' | 'hi';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    requester_name: '', requester_mobile: '', message: '', requested_date: '', duration_days: '1',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.requester_name || !form.requester_mobile || !form.message) {
      setError(lang === 'te' ? 'దయచేసి పేరు, మొబైల్, సందేశం పూరించండి.' : 'Please fill name, mobile, and message.');
      return;
    }
    if (!/^\d{10}$/.test(form.requester_mobile)) {
      setError(lang === 'te' ? 'సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : 'Enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const { error: dbError } = await supabase.from('equipment_requests').insert({
      equipment_id: equipment.id,
      requester_name: form.requester_name,
      requester_mobile: form.requester_mobile,
      message: form.message,
      requested_date: form.requested_date || null,
      duration_days: parseInt(form.duration_days) || 1,
      status: 'pending',
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
            <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'te' ? 'పరికరం అభ్యర్థన' : 'Request Equipment'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{equipment.equipment_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Owner info */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'te' ? 'యజమాని' : 'Owner'}</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{equipment.owner_name}</p>
            {equipment.area && <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{equipment.area}</p>}
          </div>
          <a href={`tel:${equipment.owner_mobile}`} className="btn-outline !px-3 !py-2 text-xs">
            <Phone className="w-3.5 h-3.5" />
            {lang === 'te' ? 'కాల్' : 'Call'}
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                {lang === 'te' ? 'మీ పేరు' : 'Your Name'} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.requester_name}
                onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                className="input-field"
                placeholder={lang === 'te' ? 'మీ పేరు' : 'Your name'}
              />
            </div>
            <div>
              <label className="label-field">
                {lang === 'te' ? 'మొబైల్ నంబర్' : 'Mobile Number'} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.requester_mobile}
                onChange={(e) => setForm({ ...form, requester_mobile: e.target.value })}
                maxLength={10}
                className="input-field"
                placeholder="98XXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">{lang === 'te' ? 'అవసరం తేదీ' : 'Needed Date'}</label>
              <input
                type="date"
                value={form.requested_date}
                onChange={(e) => setForm({ ...form, requested_date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">{lang === 'te' ? 'ఎన్ని రోజులు?' : 'Duration (days)'}</label>
              <input
                type="number"
                min="1"
                value={form.duration_days}
                onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">
              {lang === 'te' ? 'యజమానికి సందేశం' : 'Message to Owner'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="input-field resize-none"
              placeholder={lang === 'te'
                ? 'ఉదా: నా 2 ఎకరాల పొలానికి ట్రాక్టర్ కావాలి. రేపు ఉదయం 8 గంటలకు పని మొదలుపెడితే బాగుంటుంది.'
                : 'e.g. I need the tractor for my 2-acre field. Can you start work tomorrow morning at 8 AM?'}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {lang === 'te' ? 'అభ్యర్థన పంపండి' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
