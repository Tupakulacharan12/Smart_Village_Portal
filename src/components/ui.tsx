import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  image,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  image?: string;
}) {
  return (
    <div className="relative overflow-hidden">
      {image ? (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-800/80 to-brand-700/60" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />
      )}
      <div className="relative container-page py-12 sm:py-16">
        <div className="flex items-center gap-4 animate-slide-up">
          {Icon && (
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-brand-100 mt-1 text-sm sm:text-base max-w-2xl">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Card({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>{children}</div>;
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        <span className="text-2xl">📭</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    completed: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  };
  const labelMap: Record<string, string> = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  return (
    <span className={`badge ${map[status] ?? 'bg-slate-100 text-slate-700'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labelMap[status] ?? status}
    </span>
  );
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function formatDate(iso: string | null, lang: 'en' | 'te' | 'hi' = 'en'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const locale = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
