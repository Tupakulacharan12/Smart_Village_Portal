import { useState } from 'react';
import {
  LayoutDashboard, MessageSquareWarning, Newspaper, FileText, Images,
  HeartPulse, CalendarDays, Star, LogOut, Plus, Trash2, Search, X,
  CheckCircle2, Clock, AlertCircle, Users, TrendingUp, Ticket,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from './useAdminData';
import { StatusBadge, formatDate, Spinner } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Complaint, ComplaintStatus, NewsItem, Notice, GalleryItem, HealthCamp, EventItem, FeedbackItem } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

type Tab = 'dashboard' | 'complaints' | 'news' | 'notices' | 'gallery' | 'health' | 'events' | 'feedback';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'notices', label: 'Notices', icon: FileText },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'health', label: 'Health Camps', icon: HeartPulse },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'feedback', label: 'Feedback', icon: Star },
];

export function AdminDashboard({ navigate }: { navigate: (to: string) => void }) {
  const { signOut } = useAuth();
  const data = useAdminData();
  const [tab, setTab] = useState<Tab>('dashboard');

  const handleSignOut = async () => {
    await signOut();
    navigate('home');
  };

  if (data.loading) return <Spinner className="min-h-[60vh]" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-page py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gudlavalleru Panchayat — Management</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('home')} className="btn-outline !py-2 text-sm">View Site</button>
            <button onClick={handleSignOut} className="btn !bg-red-500 !text-white hover:!bg-red-600 !py-2 text-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="card p-3 h-fit lg:sticky lg:top-24">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                const count = item.id === 'complaints' ? data.complaints.filter(c => c.status === 'pending').length : 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      active ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                    {count > 0 && (
                      <span className={`ml-auto badge ${active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0">
            {tab === 'dashboard' && <DashboardStats data={data} onNavigate={setTab} />}
            {tab === 'complaints' && <ManageComplaints complaints={data.complaints} refresh={data.refresh} />}
            {tab === 'news' && <ManageNews news={data.news} refresh={data.refresh} />}
            {tab === 'notices' && <ManageNotices notices={data.notices} refresh={data.refresh} />}
            {tab === 'gallery' && <ManageGallery gallery={data.gallery} refresh={data.refresh} />}
            {tab === 'health' && <ManageHealth camps={data.healthCamps} refresh={data.refresh} />}
            {tab === 'events' && <ManageEvents events={data.events} refresh={data.refresh} />}
            {tab === 'feedback' && <ManageFeedback feedback={data.feedback} refresh={data.refresh} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// ===== Dashboard Stats =====
function DashboardStats({ data, onNavigate }: { data: ReturnType<typeof useAdminData>; onNavigate: (t: Tab) => void }) {
  const pending = data.complaints.filter(c => c.status === 'pending').length;
  const inProgress = data.complaints.filter(c => c.status === 'in-progress').length;
  const solved = data.complaints.filter(c => c.status === 'completed').length;

  const stats = [
    { label: 'Total Visitors', value: data.visits, icon: Users, color: 'govt' },
    { label: 'Total Complaints', value: data.complaints.length, icon: Ticket, color: 'saffron' },
    { label: 'Solved Complaints', value: solved, icon: CheckCircle2, color: 'brand' },
    { label: 'Pending Complaints', value: pending, icon: Clock, color: 'amber' },
    { label: 'Active News', value: data.news.length, icon: Newspaper, color: 'blue' },
    { label: 'Active Schemes', value: 8, icon: TrendingUp, color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    govt: 'from-govt-500 to-govt-600', saffron: 'from-saffron-500 to-saffron-600',
    brand: 'from-brand-500 to-brand-600', amber: 'from-amber-500 to-amber-600',
    blue: 'from-blue-500 to-blue-600', teal: 'from-teal-500 to-teal-600',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-5">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[s.color]} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{s.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Complaint breakdown */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Complaint Status Breakdown</h2>
        <div className="space-y-3">
          {[
            { label: 'Pending', count: pending, color: 'bg-amber-500', pct: data.complaints.length ? (pending / data.complaints.length) * 100 : 0 },
            { label: 'In Progress', count: inProgress, color: 'bg-blue-500', pct: data.complaints.length ? (inProgress / data.complaints.length) * 100 : 0 },
            { label: 'Completed', count: solved, color: 'bg-brand-500', pct: data.complaints.length ? (solved / data.complaints.length) * 100 : 0 },
          ].map((r, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{r.label}</span>
                <span className="text-slate-500">{r.count} ({r.pct.toFixed(0)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full ${r.color} rounded-full transition-all duration-500`} style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent complaints preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Complaints</h2>
          <button onClick={() => onNavigate('complaints')} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {data.complaints.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{c.ticket_no} — {c.category}</p>
                <p className="text-xs text-slate-500">{c.area} • {formatDate(c.created_at)}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
          {data.complaints.length === 0 && <p className="text-sm text-slate-400">No complaints yet.</p>}
        </div>
      </div>
    </div>
  );
}

// ===== Manage Complaints =====
function ManageComplaints({ complaints, refresh }: { complaints: Complaint[]; refresh: () => Promise<void> }) {
  const [filter, setFilter] = useState<'all' | ComplaintStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [updating, setUpdating] = useState(false);

  const filtered = complaints.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter;
    const matchSearch = !search || c.ticket_no.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()) || c.area.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = async (id: string, status: ComplaintStatus, notes: string) => {
    setUpdating(true);
    await supabase.from('complaints').update({ status, admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
    setUpdating(false);
    setSelected(null);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticket, name, area..." className="input-field pl-11" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as never)} className="input-field sm:w-40">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Ticket</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Category</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Area</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-brand-600 dark:text-brand-400">{c.ticket_no}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{c.name}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{c.category}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{c.area}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No complaints found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <ComplaintDetail complaint={selected} onClose={() => setSelected(null)} onUpdate={updateStatus} updating={updating} />
      )}
    </div>
  );
}

function ComplaintDetail({ complaint, onClose, onUpdate, updating }: {
  complaint: Complaint; onClose: () => void; onUpdate: (id: string, status: ComplaintStatus, notes: string) => void; updating: boolean;
}) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [notes, setNotes] = useState(complaint.admin_notes ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative max-w-lg w-full card p-6 max-h-[85vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white font-mono">{complaint.ticket_no}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={complaint.name} />
            <Field label="Mobile" value={complaint.mobile} />
            <Field label="Email" value={complaint.email ?? '—'} />
            <Field label="Area" value={complaint.area} />
            <Field label="Category" value={complaint.category} />
            <Field label="Filed" value={formatDate(complaint.created_at)} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
            <p className="text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">{complaint.description}</p>
          </div>
          {complaint.image_data && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Attached Image</p>
              <img src={complaint.image_data} alt="complaint" className="w-full rounded-xl" />
            </div>
          )}
          <div>
            <label className="label-field">Update Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as ComplaintStatus)} className="input-field">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="label-field">Admin Notes (visible to resident)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-field resize-none" placeholder="Add a note for the resident..." />
          </div>
          <button onClick={() => onUpdate(complaint.id, status, notes)} disabled={updating} className="btn-primary w-full">
            {updating ? 'Updating...' : 'Update Complaint'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
      <p className="text-slate-700 dark:text-slate-300">{value}</p>
    </div>
  );
}

// ===== Generic CRUD helpers =====
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-primary !py-2 text-sm">
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) return <button onClick={() => setConfirm(true)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>;
  return <button onClick={() => { setConfirm(false); onClick(); }} className="text-xs font-bold text-red-600 px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/30">Confirm?</button>;
}

function ModalForm({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative max-w-lg w-full card p-6 max-h-[85vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ===== Manage News =====
function ManageNews({ news, refresh }: { news: NewsItem[]; refresh: () => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', summary: '', content: '', category: 'General', image_url: '' });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    setSaving(true);
    await supabase.from('news').insert({
      title: form.title, summary: form.summary || null, content: form.content || null,
      category: form.category, image_url: form.image_url || null,
    });
    setSaving(false); setAdding(false);
    setForm({ title: '', summary: '', content: '', category: 'General', image_url: '' });
    refresh();
  };

  const del = async (id: string) => { await supabase.from('news').delete().eq('id', id); refresh(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">News & Announcements</h2>
        <AddButton label="Add News" onClick={() => setAdding(true)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {news.map(n => (
          <div key={n.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mb-1">{n.category}</span>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{n.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{formatDate(n.created_at)}</p>
              </div>
              <DeleteButton onClick={() => del(n.id)} />
            </div>
          </div>
        ))}
        {news.length === 0 && <p className="text-sm text-slate-400">No news yet.</p>}
      </div>

      {adding && (
        <ModalForm title="Add News" onClose={() => setAdding(false)}>
          <div className="space-y-3">
            <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input className="input-field" placeholder="Category (e.g. Health, Water Supply)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <textarea className="input-field resize-none" rows={2} placeholder="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
            <textarea className="input-field resize-none" rows={4} placeholder="Full content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <input className="input-field" placeholder="Image URL (optional)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
            <button onClick={add} disabled={saving || !form.title} className="btn-primary w-full">{saving ? 'Saving...' : 'Publish'}</button>
          </div>
        </ModalForm>
      )}
    </div>
  );
}

// ===== Manage Notices =====
function ManageNotices({ notices, refresh }: { notices: Notice[]; refresh: () => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', notice_type: 'Circular' });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    setSaving(true);
    await supabase.from('notices').insert({ title: form.title, content: form.content || null, notice_type: form.notice_type });
    setSaving(false); setAdding(false);
    setForm({ title: '', content: '', notice_type: 'Circular' });
    refresh();
  };
  const del = async (id: string) => { await supabase.from('notices').delete().eq('id', id); refresh(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Panchayat Notices</h2>
        <AddButton label="Add Notice" onClick={() => setAdding(true)} />
      </div>
      <div className="space-y-2">
        {notices.map(n => (
          <div key={n.id} className="card p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge bg-saffron-100 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-300">{n.notice_type}</span>
                <span className="text-xs text-slate-400">{formatDate(n.created_at)}</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{n.title}</h3>
            </div>
            <DeleteButton onClick={() => del(n.id)} />
          </div>
        ))}
        {notices.length === 0 && <p className="text-sm text-slate-400">No notices yet.</p>}
      </div>

      {adding && (
        <ModalForm title="Add Notice" onClose={() => setAdding(false)}>
          <div className="space-y-3">
            <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <select className="input-field" value={form.notice_type} onChange={e => setForm({ ...form, notice_type: e.target.value })}>
              <option>Circular</option><option>Tax Notice</option><option>Tender Notice</option><option>Meeting Minutes</option>
            </select>
            <textarea className="input-field resize-none" rows={4} placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <button onClick={add} disabled={saving || !form.title} className="btn-primary w-full">{saving ? 'Saving...' : 'Publish'}</button>
          </div>
        </ModalForm>
      )}
    </div>
  );
}

// ===== Manage Gallery =====
function ManageGallery({ gallery, refresh }: { gallery: GalleryItem[]; refresh: () => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Village', image_url: '' });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    setSaving(true);
    await supabase.from('gallery').insert({ title: form.title, category: form.category, image_url: form.image_url });
    setSaving(false); setAdding(false);
    setForm({ title: '', category: 'Village', image_url: '' });
    refresh();
  };
  const del = async (id: string) => { await supabase.from('gallery').delete().eq('id', id); refresh(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Gallery</h2>
        <AddButton label="Add Photo" onClick={() => setAdding(true)} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {gallery.map(g => (
          <div key={g.id} className="card overflow-hidden group relative">
            <img src={g.image_url} alt={g.title} className="w-full h-32 object-cover" />
            <div className="p-2">
              <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px]">{g.category}</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">{g.title}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DeleteButton onClick={() => del(g.id)} />
            </div>
          </div>
        ))}
        {gallery.length === 0 && <p className="text-sm text-slate-400 col-span-full">No photos yet.</p>}
      </div>

      {adding && (
        <ModalForm title="Add Photo" onClose={() => setAdding(false)}>
          <div className="space-y-3">
            <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option>Village</option><option>Agriculture</option><option>Temples</option><option>Schools</option><option>Festivals</option><option>Parks</option>
            </select>
            <input className="input-field" placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
            {form.image_url && <img src={form.image_url} alt="preview" className="w-full h-40 object-cover rounded-xl" />}
            <button onClick={add} disabled={saving || !form.title || !form.image_url} className="btn-primary w-full">{saving ? 'Saving...' : 'Add Photo'}</button>
          </div>
        </ModalForm>
      )}
    </div>
  );
}

// ===== Manage Health Camps =====
function ManageHealth({ camps, refresh }: { camps: HealthCamp[]; refresh: () => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', camp_date: '', location: '', camp_type: 'Health Camp', contact: '' });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    setSaving(true);
    await supabase.from('health_camps').insert({
      title: form.title, description: form.description || null, camp_date: form.camp_date || null,
      location: form.location || null, camp_type: form.camp_type, contact: form.contact || null,
    });
    setSaving(false); setAdding(false);
    setForm({ title: '', description: '', camp_date: '', location: '', camp_type: 'Health Camp', contact: '' });
    refresh();
  };
  const del = async (id: string) => { await supabase.from('health_camps').delete().eq('id', id); refresh(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Health Camps</h2>
        <AddButton label="Add Camp" onClick={() => setAdding(true)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {camps.map(c => (
          <div key={c.id} className="card p-4 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="badge bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 mb-1">{c.camp_type}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{c.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{c.camp_date ? formatDate(c.camp_date) : '—'} • {c.location}</p>
            </div>
            <DeleteButton onClick={() => del(c.id)} />
          </div>
        ))}
        {camps.length === 0 && <p className="text-sm text-slate-400">No camps yet.</p>}
      </div>

      {adding && (
        <ModalForm title="Add Health Camp" onClose={() => setAdding(false)}>
          <div className="space-y-3">
            <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <select className="input-field" value={form.camp_type} onChange={e => setForm({ ...form, camp_type: e.target.value })}>
              <option>Health Camp</option><option>Vaccination Drive</option><option>Blood Donation Camp</option>
            </select>
            <input type="date" className="input-field" value={form.camp_date} onChange={e => setForm({ ...form, camp_date: e.target.value })} />
            <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <input className="input-field" placeholder="Contact number" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            <textarea className="input-field resize-none" rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button onClick={add} disabled={saving || !form.title} className="btn-primary w-full">{saving ? 'Saving...' : 'Add Camp'}</button>
          </div>
        </ModalForm>
      )}
    </div>
  );
}

// ===== Manage Events =====
function ManageEvents({ events, refresh }: { events: EventItem[]; refresh: () => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', category: 'Event' });
  const [saving, setSaving] = useState(false);

  const add = async () => {
    setSaving(true);
    await supabase.from('events').insert({
      title: form.title, description: form.description || null, event_date: form.event_date || null,
      location: form.location || null, category: form.category,
    });
    setSaving(false); setAdding(false);
    setForm({ title: '', description: '', event_date: '', location: '', category: 'Event' });
    refresh();
  };
  const del = async (id: string) => { await supabase.from('events').delete().eq('id', id); refresh(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Events</h2>
        <AddButton label="Add Event" onClick={() => setAdding(true)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {events.map(e => (
          <div key={e.id} className="card p-4 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="badge bg-govt-100 text-govt-700 dark:bg-govt-900/40 dark:text-govt-300 mb-1">{e.category}</span>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{e.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{e.event_date ? formatDate(e.event_date) : '—'} • {e.location}</p>
            </div>
            <DeleteButton onClick={() => del(e.id)} />
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-slate-400">No events yet.</p>}
      </div>

      {adding && (
        <ModalForm title="Add Event" onClose={() => setAdding(false)}>
          <div className="space-y-3">
            <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input className="input-field" placeholder="Category (e.g. Festival, Gram Sabha)" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input type="date" className="input-field" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
            <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <textarea className="input-field resize-none" rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button onClick={add} disabled={saving || !form.title} className="btn-primary w-full">{saving ? 'Saving...' : 'Add Event'}</button>
          </div>
        </ModalForm>
      )}
    </div>
  );
}

// ===== Manage Feedback =====
function ManageFeedback({ feedback, refresh }: { feedback: FeedbackItem[]; refresh: () => Promise<void> }) {
  const del = async (id: string) => { await supabase.from('feedback').delete().eq('id', id); refresh(); };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Public Feedback</h2>
      <div className="space-y-2">
        {feedback.map(f => (
          <div key={f.id} className="card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{f.name}</h3>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < f.rating ? 'text-saffron-500 fill-saffron-400' : 'text-slate-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{f.message}</p>
              <p className="text-xs text-slate-400 mt-1">{f.email ?? 'No email'} • {formatDate(f.created_at)}</p>
            </div>
            <DeleteButton onClick={() => del(f.id)} />
          </div>
        ))}
        {feedback.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm text-slate-400">No feedback yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
