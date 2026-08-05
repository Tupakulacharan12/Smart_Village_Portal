import { useState, useMemo } from 'react';
import {
  Trophy, Search, Filter, Bookmark, ChevronRight, Star,
  School, GraduationCap, Landmark, Building2, Cpu, Stethoscope,
  Scale, Briefcase, BookOpen, Presentation, Shield, Calculator,
  FileQuestion, Flame, TrendingUp, Award,
} from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { EXAMS, EXAM_CATEGORIES } from '@/lib/examData';
import type { ExamCategory, ExamInfo } from '@/lib/examData';
import { isBookmarked, toggleBookmark, getMockTestScores } from '@/lib/progress';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  School, GraduationCap, Landmark, Building2, Cpu, Stethoscope, Scale, Briefcase, BookOpen, Presentation, Shield, Calculator, FileQuestion, Trophy, Award,
};

const COLOR_MAP: Record<string, string> = {
  govt: 'from-govt-500 to-govt-600',
  saffron: 'from-saffron-500 to-saffron-600',
  brand: 'from-brand-500 to-brand-600',
  pink: 'from-pink-500 to-pink-600',
};

interface ExamsHubProps {
  navigate: (to: string) => void;
}

export function ExamsHub({ navigate }: ExamsHubProps) {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExamCategory | 'All'>('All');
  const [difficulty, setDifficulty] = useState('All');
  const [govFilter, setGovFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [, forceUpdate] = useState(0);

  const refresh = () => forceUpdate(n => n + 1);

  const filtered = useMemo(() => {
    return EXAMS.filter(e => {
      const matchSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.fullName.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || e.category === category;
      const matchDiff = difficulty === 'All' || e.difficulty === difficulty;
      const matchGov = govFilter === 'All' ||
        (govFilter === 'Government' && e.government) ||
        (govFilter === 'Private' && !e.government);
      const matchBookmark = !bookmarksOnly || isBookmarked(e.slug);
      return matchSearch && matchCat && matchDiff && matchGov && matchBookmark;
    });
  }, [search, category, difficulty, govFilter, bookmarksOnly]);

  const popularExams = useMemo(() => {
    return [...EXAMS].map(e => ({
      exam: e,
      scoreCount: getMockTestScores(e.slug).length,
    })).sort((a, b) => b.scoreCount - a.scoreCount).slice(0, 6);
  }, []);

  const handleBookmark = (slug: string) => {
    toggleBookmark(slug);
    refresh();
  };

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'పోటీ పరీక్షల హబ్' : 'Competitive Exams Hub'}
        subtitle={lang === 'te' ? 'అన్ని భారతీయ పోటీ పరీక్షలు — పాఠశాల నుండి ఉన్నత చదువుల వరకు' : 'All Indian competitive exams — from school level to higher studies, with study materials, mock tests & progress tracking'}
        icon={Trophy}
        image="https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14">
        {/* Popular exams */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-saffron-500" />
            <h2 className="section-title">{lang === 'te' ? 'ట్రెండింగ్ పరీక్షలు' : 'Trending Exams'}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {popularExams.map(({ exam }, i) => {
              const Icon = ICONS[exam.icon] ?? Trophy;
              return (
                <button
                  key={i}
                  onClick={() => navigate(`exam/${exam.slug}`)}
                  className="card card-hover p-4 text-center group"
                >
                  <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${COLOR_MAP[exam.color] ?? COLOR_MAP.govt} flex items-center justify-center mb-2 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 transition-colors">{exam.name}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Search & filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'te' ? 'పరీక్ష పేరు వెతకండి...' : 'Search exam name...'}
                className="input-field pl-11"
              />
            </div>
            <button
              onClick={() => setShowFilters(s => !s)}
              className={`btn-outline ${showFilters ? '!border-brand-400 !text-brand-600' : ''}`}
            >
              <Filter className="w-4 h-4" />
              {lang === 'te' ? 'ఫిల్టర్లు' : 'Filters'}
            </button>
            <button
              onClick={() => { setBookmarksOnly(b => !b); refresh(); }}
              className={`btn-outline ${bookmarksOnly ? '!border-saffron-400 !text-saffron-600 !bg-saffron-50 dark:!bg-saffron-900/20' : ''}`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarksOnly ? 'fill-saffron-500' : ''}`} />
              {lang === 'te' ? 'బుక్‌మార్క్‌లు' : 'Bookmarked'}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in-fast">
              <div>
                <label className="label-field">{lang === 'te' ? 'వర్గం' : 'Category'}</label>
                <select value={category} onChange={e => setCategory(e.target.value as never)} className="input-field">
                  <option value="All">{lang === 'te' ? 'అన్నీ' : 'All Categories'}</option>
                  {EXAM_CATEGORIES.map(c => <option key={c.key} value={c.key}>{lang === 'te' ? c.label_te : lang === 'hi' ? c.label_te : c.key}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">{lang === 'te' ? 'కష్టం' : 'Difficulty'}</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="input-field">
                  <option value="All">{lang === 'te' ? 'అన్నీ' : 'All'}</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Hard">Hard</option>
                  <option value="Very Hard">Very Hard</option>
                </select>
              </div>
              <div>
                <label className="label-field">{lang === 'te' ? 'రకం' : 'Type'}</label>
                <select value={govFilter} onChange={e => setGovFilter(e.target.value)} className="input-field">
                  <option value="All">{lang === 'te' ? 'అన్నీ' : 'All'}</option>
                  <option value="Government">{lang === 'te' ? 'ప్రభుత్వ' : 'Government'}</option>
                  <option value="Private">{lang === 'te' ? 'ప్రైవేట్' : 'Private'}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${category === 'All' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
          >
            {lang === 'te' ? 'అన్నీ' : 'All'}
          </button>
          {EXAM_CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${category === c.key ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              {lang === 'te' ? c.label_te : lang === 'hi' ? c.label_te : c.key}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {filtered.length} {lang === 'te' ? 'పరీక్షలు కనుగొనబడ్డాయి' : 'exams found'}
        </p>

        {/* Exam grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{lang === 'te' ? 'ఫలితాలు లేవు' : 'No exams found matching your filters.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(exam => (
              <ExamCard key={exam.slug} exam={exam} lang={lang} navigate={navigate} onBookmark={handleBookmark} />
            ))}
          </div>
        )}

        {/* Progress dashboard link */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-brand-50 to-govt-50 dark:from-brand-950/30 dark:from-govt-950/30 border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'మీ పురోగతి డాష్‌బోర్డ్' : 'Your Progress Dashboard'}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{lang === 'te' ? 'మెట్రిక్స్, స్కోర్‌లు, స్ట్రీక్‌లను ట్రాక్ చేయండి' : 'Track your scores, streaks, and readiness'}</p>
              </div>
            </div>
            <button onClick={() => navigate('exam-dashboard')} className="btn-primary">
              {lang === 'te' ? 'డాష్‌బోర్డ్ చూడండి' : 'View Dashboard'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ExamCard({ exam, lang, navigate, onBookmark }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi'; navigate: (to: string) => void; onBookmark: (slug: string) => void }) {
  const Icon = ICONS[exam.icon] ?? Trophy;
  const bookmarked = isBookmarked(exam.slug);

  const diffColors: Record<string, string> = {
    Easy: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    Moderate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    Hard: 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-300',
    'Very Hard': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };

  return (
    <Card hover className="p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${COLOR_MAP[exam.color] ?? COLOR_MAP.govt} flex items-center justify-center shrink-0 shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(exam.slug); }}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-saffron-500 text-saffron-500' : 'text-slate-400'}`} />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{exam.category}</span>
        <span className={`badge ${diffColors[exam.difficulty]}`}>{exam.difficulty}</span>
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{lang === 'te' ? (exam.name_te ?? exam.name) : lang === 'hi' ? (exam.name_hi ?? exam.name) : exam.name}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{exam.fullName}</p>
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{exam.stream}</span>
        {exam.government && <span className="flex items-center gap-1"><Landmark className="w-3 h-3" />Govt</span>}
      </div>
      <button
        onClick={() => navigate(`exam/${exam.slug}`)}
        className="mt-4 w-full btn-outline !py-2 text-sm group-hover:!border-brand-400 group-hover:!text-brand-600"
      >
        {lang === 'te' ? 'వివరాలు చూడండి' : 'View Details'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
