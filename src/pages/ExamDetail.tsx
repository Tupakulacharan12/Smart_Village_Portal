import { useState, useEffect } from 'react';
import {
  ArrowLeft, Info, BookOpen, ClipboardCheck, FileText, Calendar,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Star, Bookmark,
  ExternalLink, Clock, Users, Building, Award, TrendingUp, Target,
  Lightbulb, Zap, Download, Video, Brain, BarChart3, FileQuestion,
  Sparkles, ChevronRight, GraduationCap, Trophy, PenLine,
} from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { getExam, getTopicCount, getAllTopics } from '@/lib/examData';
import type { ExamInfo, ExamTopic } from '@/lib/examData';
import { isTopicComplete, toggleTopicComplete, isFavoriteTopic, toggleFavoriteTopic, getMockTestScores, isBookmarked, toggleBookmark } from '@/lib/progress';
import { getDailyQuestions } from '@/lib/questionBank';
import { MockTest } from '@/pages/MockTest';

interface ExamDetailProps {
  examSlug: string;
  navigate: (to: string) => void;
}

type Tab = 'overview' | 'syllabus' | 'mock' | 'practice' | 'pyq' | 'study' | 'daily';

export function ExamDetail({ examSlug, navigate }: ExamDetailProps) {
  const { lang } = useLanguage();
  const exam = getExam(examSlug);
  const [tab, setTab] = useState<Tab>('overview');
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  if (!exam) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-slate-500">Exam not found.</p>
        <button onClick={() => navigate('exams')} className="btn-primary mt-4">Back to Exams</button>
      </div>
    );
  }

  const totalTopics = getTopicCount(exam);
  const completedTopics = getAllTopics(exam).filter(t => isTopicComplete(exam.slug, t.topicId)).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const mockScores = getMockTestScores(exam.slug);
  const bookmarked = isBookmarked(exam.slug);

  const tabs: { id: Tab; label: string; icon: typeof Info }[] = [
    { id: 'overview', label: lang === 'te' ? 'అవలోకనం' : 'Overview', icon: Info },
    { id: 'syllabus', label: lang === 'te' ? 'సిలబస్' : 'Syllabus', icon: BookOpen },
    { id: 'mock', label: lang === 'te' ? 'మాక్ టెస్ట్‌లు' : 'Mock Tests', icon: ClipboardCheck },
    { id: 'practice', label: lang === 'te' ? 'ప్రాక్టీస్' : 'Practice', icon: Target },
    { id: 'pyq', label: lang === 'te' ? 'పాత పేపర్లు' : 'PYQ', icon: FileText },
    { id: 'study', label: lang === 'te' ? 'స్టడీ మెటీరియల్' : 'Study Material', icon: Download },
    { id: 'daily', label: lang === 'te' ? 'రోజువారీ' : 'Daily', icon: Calendar },
  ];

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? (exam.name_te ?? exam.name) : lang === 'hi' ? (exam.name_hi ?? exam.name) : exam.name}
        subtitle={exam.fullName}
        icon={GraduationCap}
      />

      {/* Progress bar */}
      <div className="bg-brand-50 dark:bg-brand-950/30 border-b border-brand-100 dark:border-brand-900">
        <div className="container-page py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('exams')} className="btn-ghost !py-1.5 !px-3 text-sm">
                <ArrowLeft className="w-4 h-4" />
                {lang === 'te' ? 'వెనుకకు' : 'Back'}
              </button>
              <button
                onClick={() => { toggleBookmark(exam.slug); refresh(); }}
                className="btn-ghost !py-1.5 !px-3 text-sm"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-saffron-500 text-saffron-500' : ''}`} />
                {bookmarked ? (lang === 'te' ? 'బుక్‌మార్క్ చేయబడింది' : 'Bookmarked') : (lang === 'te' ? 'బుక్‌మార్క్' : 'Bookmark')}
              </button>
            </div>
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'te' ? 'పురోగతి' : 'Learning Progress'}</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{progressPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{completedTopics}/{totalTopics} {lang === 'te' ? 'అంశాలు పూర్తయ్యాయి' : 'topics completed'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container-page">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    tab === t.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        {tab === 'overview' && <OverviewTab exam={exam} lang={lang} />}
        {tab === 'syllabus' && <SyllabusTab exam={exam} lang={lang} onToggle={refresh} />}
        {tab === 'mock' && <MockTestTab exam={exam} lang={lang} mockScores={mockScores} />}
        {tab === 'practice' && <PracticeTab exam={exam} lang={lang} />}
        {tab === 'pyq' && <PYQTab exam={exam} lang={lang} />}
        {tab === 'study' && <StudyMaterialTab exam={exam} lang={lang} />}
        {tab === 'daily' && <DailyPracticeTab exam={exam} lang={lang} />}
      </div>
    </div>
  );
}

// ===== Overview Tab =====
function OverviewTab({ exam, lang }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi' }) {
  const fields = [
    { icon: Users, label: lang === 'te' ? 'అర్హత' : 'Eligibility', value: exam.overview.eligibility },
    { icon: Clock, label: lang === 'te' ? 'వయస్సు పరిమితి' : 'Age Limit', value: exam.overview.ageLimit },
    { icon: GraduationCap, label: lang === 'te' ? 'విద్యా యోగ్యత' : 'Qualification', value: exam.overview.qualification },
    { icon: Target, label: lang === 'te' ? 'ఎంపిక ప్రక్రియ' : 'Selection Process', value: exam.overview.selectionProcess },
    { icon: Calendar, label: lang === 'te' ? 'పరీక్ష ఫ్రీక్వెన్సీ' : 'Frequency', value: exam.overview.frequency },
    { icon: Building, label: lang === 'te' ? 'నిర్వహణ సంస్థ' : 'Conducting Authority', value: exam.overview.conductingAuthority },
    { icon: Award, label: lang === 'te' ? 'జీతం' : 'Salary', value: exam.overview.salary },
    { icon: TrendingUp, label: lang === 'te' ? 'కెరీర్ అవకాశాలు' : 'Career Opportunities', value: exam.overview.careerOpportunities },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'పరిచయం' : 'Introduction'}</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{exam.overview.introduction}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const Icon = f.icon;
          return (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{f.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ExternalLink className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">{lang === 'te' ? 'అధికారిక వెబ్‌సైట్' : 'Official Website'}</p>
            <p className="text-sm text-brand-600 dark:text-brand-400 font-semibold">{exam.overview.officialWebsite}</p>
          </div>
        </div>
        <a href={exam.overview.officialWebsite} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 text-sm">
          {lang === 'te' ? 'సందర్శించండి' : 'Visit'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </Card>
    </div>
  );
}

// ===== Syllabus Tab =====
function SyllabusTab({ exam, lang, onToggle }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi'; onToggle: () => void }) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [selectedTopic, setSelectedTopic] = useState<{ moduleId: number; topic: ExamTopic } | null>(null);

  const toggleModule = (i: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Module list */}
      <div className="lg:col-span-1 space-y-3">
        {exam.syllabus.map((mod, mi) => {
          const expanded = expandedModules.has(mi);
          const modCompleted = mod.topics.filter(t => isTopicComplete(exam.slug, t.id)).length;
          return (
            <Card key={mi} className="overflow-hidden">
              <button
                onClick={() => toggleModule(mi)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lang === 'te' ? (mod.name_te ?? mod.name) : lang === 'hi' ? (mod.name_hi ?? mod.name) : mod.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{modCompleted}/{mod.topics.length} {lang === 'te' ? 'పూర్తయ్యాయి' : 'done'}</p>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {expanded && (
                <div className="border-t border-slate-100 dark:border-slate-800">
                  {mod.topics.map((topic, ti) => {
                    const done = isTopicComplete(exam.slug, topic.id);
                    const fav = isFavoriteTopic(exam.slug, topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic({ moduleId: mi, topic })}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors border-l-2 ${
                          selectedTopic?.topic.id === topic.id
                            ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-500'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
                        }`}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTopicComplete(exam.slug, topic.id); onToggle(); }}
                          className="shrink-0"
                        >
                          {done ? <CheckCircle2 className="w-4 h-4 text-brand-500" /> : <Circle className="w-4 h-4 text-slate-300" />}
                        </button>
                        <span className={`flex-1 ${done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                          {lang === 'te' ? (topic.name_te ?? topic.name) : lang === 'hi' ? (topic.name_hi ?? topic.name) : topic.name}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavoriteTopic(exam.slug, topic.id); onToggle(); }}
                          className="shrink-0"
                        >
                          <Star className={`w-3.5 h-3.5 ${fav ? 'fill-saffron-500 text-saffron-500' : 'text-slate-300'}`} />
                        </button>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Topic detail */}
      <div className="lg:col-span-2">
        {selectedTopic ? (
          <TopicDetail exam={exam} topic={selectedTopic.topic} lang={lang} onToggle={onToggle} />
        ) : (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">{lang === 'te' ? 'వివరాల కోసం ఒక అంశాన్ని ఎంచుకోండి' : 'Select a topic to view detailed learning materials'}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function TopicDetail({ exam, topic, lang, onToggle }: { exam: ExamInfo; topic: ExamTopic; lang: 'en' | 'te' | 'hi'; onToggle: () => void }) {
  const done = isTopicComplete(exam.slug, topic.id);
  const fav = isFavoriteTopic(exam.slug, topic.id);

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? (topic.name_te ?? topic.name) : lang === 'hi' ? (topic.name_hi ?? topic.name) : topic.name}</h2>
          <p className="text-xs text-slate-500 mt-1">{exam.name} — {lang === 'te' ? 'సిలబస్' : 'Syllabus'}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => { toggleFavoriteTopic(exam.slug, topic.id); onToggle(); }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Star className={`w-5 h-5 ${fav ? 'fill-saffron-500 text-saffron-500' : 'text-slate-400'}`} />
          </button>
          <button
            onClick={() => { toggleTopicComplete(exam.slug, topic.id); onToggle(); }}
            className={`btn !py-2 text-sm ${done ? '!bg-brand-100 !text-brand-700 dark:!bg-brand-900/40 dark:!text-brand-300' : 'btn-primary'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {done ? (lang === 'te' ? 'పూర్తయ్యింది' : 'Completed') : (lang === 'te' ? 'పూర్తి చేయండి' : 'Mark Complete')}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <LearningLevel icon={BookOpen} title={lang === 'te' ? 'ప్రాథమిక వివరణ' : 'Beginner Explanation'} color="brand">
          {topic.beginner}
        </LearningLevel>
        <LearningLevel icon={TrendingUp} title={lang === 'te' ? 'మధ్యస్థ వివరణ' : 'Intermediate Explanation'} color="govt">
          {topic.intermediate}
        </LearningLevel>
        <LearningLevel icon={Zap} title={lang === 'te' ? 'అధునాతన వివరణ' : 'Advanced Explanation'} color="saffron">
          {topic.advanced}
        </LearningLevel>

        {topic.detailedExplanation && (
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border-2 border-brand-200 dark:border-brand-800">
            <div className="flex items-center gap-2 mb-3">
              <PenLine className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="font-bold text-brand-700 dark:text-brand-300 text-sm">{lang === 'te' ? 'వివరణాత్మక అధ్యయనం' : 'Detailed Step-by-Step Explanation'}</h3>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
              {topic.detailedExplanation}
            </div>
          </div>
        )}

        {topic.workedExamples && topic.workedExamples.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-saffron-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{lang === 'te' ? 'సాల్వ్ చేసిన ఉదాహరణలు' : 'Worked Examples — Step by Step Solutions'}</h3>
            </div>
            {topic.workedExamples.map((ex, i) => (
              <WorkedExample key={i} index={i + 1} problem={ex.problem} solution={ex.solution} />
            ))}
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-saffron-500" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{lang === 'te' ? 'ఉదాహరణలు' : 'Examples'}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{topic.examples}</p>
        </div>

        {topic.keyFormulas && topic.keyFormulas.length > 0 && (
          <div className="p-4 rounded-xl bg-govt-50 dark:bg-govt-900/20 border border-govt-200 dark:border-govt-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-govt-500" />
              <h3 className="font-semibold text-govt-700 dark:text-govt-300 text-sm">{lang === 'te' ? 'ముఖ్యమైన సూత్రాలు' : 'Important Formulas'}</h3>
            </div>
            <ul className="space-y-1.5">
              {topic.keyFormulas.map((f, i) => (
                <li key={i} className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg">{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <h3 className="font-semibold text-brand-700 dark:text-brand-300 text-sm">{lang === 'te' ? 'చిన్న గమనికలు' : 'Short Notes'}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{topic.shortNotes}</p>
        </div>

        <div className="p-4 rounded-xl bg-saffron-50 dark:bg-saffron-900/20 border border-saffron-200 dark:border-saffron-800">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-saffron-500" />
            <h3 className="font-semibold text-saffron-700 dark:text-saffron-300 text-sm">{lang === 'te' ? 'చిట్కాలు & ట్రిక్స్' : 'Important Tricks & Tips'}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{topic.tips}</p>
        </div>
      </div>
    </Card>
  );
}

function LearningLevel({ icon: Icon, title, color, children }: { icon: typeof BookOpen; title: string; color: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    brand: 'text-brand-500 bg-brand-50 dark:bg-brand-950/30',
    govt: 'text-govt-500 bg-govt-50 dark:bg-govt-900/20',
    saffron: 'text-saffron-500 bg-saffron-50 dark:bg-saffron-900/20',
  };
  return (
    <div className={`p-4 rounded-xl ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>
    </div>
  );
}

function WorkedExample({ index, problem, solution }: { index: number; problem: string; solution: string }) {
  const [showSolution, setShowSolution] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-start gap-2">
          <span className="badge bg-saffron-500 text-white shrink-0 mt-0.5">Q{index}</span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{problem}</p>
        </div>
        <button
          onClick={() => setShowSolution(s => !s)}
          className="mt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
        >
          {showSolution ? '− Hide Solution' : '+ Show Step-by-Step Solution'}
        </button>
      </div>
      {showSolution && (
        <div className="p-4 bg-white dark:bg-slate-900 animate-fade-in-fast">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">Solution</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-mono">{solution}</p>
        </div>
      )}
    </div>
  );
}

// ===== Mock Test Tab =====
function MockTestTab({ exam, lang, mockScores }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi'; mockScores: ReturnType<typeof getMockTestScores> }) {
  const [activeTest, setActiveTest] = useState<number | null>(null);

  if (activeTest !== null) {
    return <MockTest exam={exam} testNumber={activeTest} lang={lang} onExit={() => setActiveTest(null)} />;
  }

  const mockTests = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `${lang === 'te' ? 'మాక్ టెస్ట్' : 'Mock Test'} ${i + 1}`,
    questions: 50 + (i % 3) * 25,
    duration: 60 + (i % 3) * 30,
  }));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase font-semibold">{lang === 'te' ? 'మొత్తం టెస్ట్‌లు' : 'Tests Taken'}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{mockScores.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase font-semibold">{lang === 'te' ? 'అత్యుత్తమ స్కోర్' : 'Best Score'}</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{mockScores.length > 0 ? Math.max(...mockScores.map(s => s.score)) : '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase font-semibold">{lang === 'te' ? 'సగటు స్కోర్' : 'Avg Score'}</p>
          <p className="text-2xl font-bold text-govt-600 dark:text-govt-400">{mockScores.length > 0 ? Math.round(mockScores.reduce((s, m) => s + m.score, 0) / mockScores.length) : '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase font-semibold">{lang === 'te' ? 'అందుబాటులో' : 'Available'}</p>
          <p className="text-2xl font-bold text-saffron-600 dark:text-saffron-400">20</p>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'మాక్ టెస్ట్‌లు' : 'Full Mock Tests'}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {mockTests.map(t => {
          const taken = mockScores.find(m => m.testId === `mt-${exam.slug}-${t.id}`);
          return (
            <Card key={t.id} hover className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">#{t.id}</span>
                {taken && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{t.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><FileQuestion className="w-3 h-3" />{t.questions}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration} min</span>
              </div>
              {taken && (
                <p className="text-xs text-brand-600 dark:text-brand-400 mt-2 font-semibold">{lang === 'te' ? 'స్కోర్' : 'Score'}: {taken.score}/{taken.totalQuestions}</p>
              )}
              <button
                onClick={() => setActiveTest(t.id)}
                className="mt-3 w-full btn-primary !py-2 text-sm"
              >
                {taken ? (lang === 'te' ? 'మళ్ళీ' : 'Retake') : (lang === 'te' ? 'ప్రారంభించండి' : 'Start Test')}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===== Practice Tab =====
function PracticeTab({ exam, lang }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi' }) {
  const allTopics = getAllTopics(exam);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard' | 'expert'>('easy');
  const [activePractice, setActivePractice] = useState(false);

  if (activePractice && selectedTopic) {
    return <MockTest exam={exam} testNumber={0} lang={lang} onExit={() => setActivePractice(false)} practiceTopic={selectedTopic} practiceLevel={level} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'అంశం-వారీ ప్రాక్టీస్ టెస్ట్‌లు' : 'Topic-wise Practice Tests'}</h2>
      </div>

      <Card className="p-5">
        <label className="label-field">{lang === 'te' ? 'అంశం ఎంచుకోండి' : 'Select Topic'}</label>
        <select value={selectedTopic ?? ''} onChange={e => setSelectedTopic(e.target.value)} className="input-field">
          <option value="">{lang === 'te' ? 'ఎంచుకోండి' : 'Select...'}</option>
          {allTopics.map(t => <option key={t.topicId} value={t.name}>{t.name}</option>)}
        </select>
      </Card>

      {selectedTopic && (
        <div className="animate-fade-in">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{lang === 'te' ? 'కష్టం స్థాయి ఎంచుకోండి' : 'Choose Difficulty Level'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { key: 'easy', label: lang === 'te' ? 'సులభం' : 'Easy', color: 'brand', icon: Circle },
              { key: 'medium', label: lang === 'te' ? 'మధ్యమ' : 'Medium', color: 'govt', icon: TrendingUp },
              { key: 'hard', label: lang === 'te' ? 'కష్టం' : 'Hard', color: 'saffron', icon: Zap },
              { key: 'expert', label: lang === 'te' ? 'నిపుణుడు' : 'Expert', color: 'pink', icon: Brain },
            ] as const).map(l => {
              const Icon = l.icon;
              const colorMap: Record<string, string> = {
                brand: 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300',
                govt: 'border-govt-500 bg-govt-50 dark:bg-govt-900/20 text-govt-700 dark:text-govt-300',
                saffron: 'border-saffron-500 bg-saffron-50 dark:bg-saffron-900/20 text-saffron-700 dark:text-saffron-300',
                pink: 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
              };
              return (
                <button
                  key={l.key}
                  onClick={() => { setLevel(l.key); setActivePractice(true); }}
                  className={`card p-4 text-center border-2 transition-all hover:scale-105 ${colorMap[l.color]}`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold text-sm">{l.label}</p>
                  <p className="text-xs mt-1 opacity-70">20+ {lang === 'te' ? 'ప్రశ్నలు' : 'questions'}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== PYQ Tab =====
function PYQTab({ exam, lang }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi' }) {
  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'పాత ప్రశ్నపత్రాలు' : 'Previous Year Question Papers'}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {years.map(year => (
          <Card key={year} hover className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{year}</span>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{exam.name} {year}</h3>
            <p className="text-xs text-slate-500 mt-1">{lang === 'te' ? 'సమాధానాలు & వివరణలతో' : 'With answer keys & explanations'}</p>
            <div className="flex gap-2 mt-3">
              <button className="btn-outline !py-1.5 !px-3 text-xs flex-1">
                <Download className="w-3 h-3" /> PDF
              </button>
              <button className="btn-primary !py-1.5 !px-3 text-xs flex-1">
                {lang === 'te' ? 'పరిష్కరించండి' : 'Solve'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== Study Material Tab =====
function StudyMaterialTab({ exam, lang }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi' }) {
  const materials = [
    { icon: FileText, title: lang === 'te' ? 'గమనికలు' : 'Complete Notes', desc: lang === 'te' ? 'అన్ని అంశాల సంక్షిప్త గమనికలు' : 'Comprehensive notes for all topics', type: 'PDF' },
    { icon: Sparkles, title: lang === 'te' ? 'సూత్రాల పత్రం' : 'Formula Sheets', desc: lang === 'te' ? 'అన్ని ముఖ్యమైన సూత్రాలు' : 'All important formulas in one place', type: 'PDF' },
    { icon: Brain, title: lang === 'te' ? 'మైండ్ మ్యాప్‌లు' : 'Mind Maps', desc: lang === 'te' ? 'దృశ్య అధ్యయన సహాయకాలు' : 'Visual study aids for quick revision', type: 'PDF' },
    { icon: Zap, title: lang === 'te' ? 'ఫ్లాష్ కార్డ్‌లు' : 'Flash Cards', desc: lang === 'te' ? 'త్వరిత పునశ్చరణ కోసం' : 'Quick revision flash cards', type: 'Interactive' },
    { icon: Lightbulb, title: lang === 'te' ? 'షార్ట్‌కట్లు' : 'Shortcuts & Tricks', desc: lang === 'te' ? 'వేగంగా ప్రశ్నలు సాల్వ్ చేయడానికి' : 'Speed-solving techniques', type: 'PDF' },
    { icon: Award, title: lang === 'te' ? 'ముఖ్యమైన వాస్తవాలు' : 'Important Facts', desc: lang === 'te' ? 'గుర్తుంచుకోవాల్సిన వాస్తవాలు' : 'Must-remember facts and data', type: 'PDF' },
    { icon: BookOpen, title: lang === 'te' ? 'పునశ్చరణ పుస్తకం' : 'Revision Booklet', desc: lang === 'te' ? 'పరీక్షకు ముందు చివరి పునశ్చరణ' : 'Last-minute revision booklet', type: 'PDF' },
    { icon: Video, title: lang === 'te' ? 'వీడియో లెర్నింగ్' : 'Video Learning', desc: lang === 'te' ? 'అన్ని అంశాలకు వీడియోలు' : 'Video lectures for all topics', type: 'Video' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Download className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'అధ్యయన సామగ్రి' : 'Study Materials'}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} hover className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{m.title}</h3>
                    <span className="badge bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[10px]">{m.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.desc}</p>
                  <button className="mt-3 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {lang === 'te' ? 'డౌన్‌లోడ్' : 'Download'}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===== Daily Practice Tab =====
function DailyPracticeTab({ exam, lang }: { exam: ExamInfo; lang: 'en' | 'te' | 'hi' }) {
  const dailyQuestions = getDailyQuestions(10);
  const [activeDaily, setActiveDaily] = useState(false);

  if (activeDaily) {
    return <MockTest exam={exam} testNumber={0} lang={lang} onExit={() => setActiveDaily(false)} dailyMode={true} />;
  }

  const items = [
    { icon: Target, title: lang === 'te' ? 'రోజువారీ 10 MCQs' : 'Daily 10 MCQs', desc: lang === 'te' ? 'రోజూ 10 తాజా ప్రశ్నలు' : '10 fresh questions every day', color: 'brand' },
    { icon: Zap, title: lang === 'te' ? 'రోజువారీ క్విజ్' : 'Daily Quiz', desc: lang === 'te' ? '5 నిమిషాల్లో 10 ప్రశ్నలు' : '10 questions in 5 minutes', color: 'govt' },
    { icon: Calendar, title: lang === 'te' ? 'వారపు టెస్ట్' : 'Weekly Test', desc: lang === 'te' ? 'వారానికి 50 ప్రశ్నలు' : '50 questions every week', color: 'saffron' },
    { icon: Trophy, title: lang === 'te' ? 'నెలవారీ గ్రాండ్ టెస్ట్' : 'Monthly Grand Test', desc: lang === 'te' ? 'నెలకు 100 ప్రశ్నలు' : '100 questions full test', color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'రోజువారీ ప్రాక్టీస్' : 'Daily Practice'}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          const colorMap: Record<string, string> = {
            brand: 'from-brand-500 to-brand-600',
            govt: 'from-govt-500 to-govt-600',
            saffron: 'from-saffron-500 to-saffron-600',
            pink: 'from-pink-500 to-pink-600',
          };
          return (
            <Card key={i} hover className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[item.color]} flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              {i === 0 ? (
                <button onClick={() => setActiveDaily(true)} className="btn-primary !py-2 !px-3 text-sm shrink-0">
                  {lang === 'te' ? 'ప్రారంభించండి' : 'Start'}
                </button>
              ) : (
                <button className="btn-outline !py-2 !px-3 text-sm shrink-0">
                  {lang === 'te' ? 'త్వరలో' : 'Soon'}
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {/* AI Assistant card */}
      <Card className="p-6 bg-gradient-to-br from-govt-50 to-brand-50 dark:from-govt-950/30 dark:to-brand-950/30 border-govt-200 dark:border-govt-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-govt-500 to-brand-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'AI లెర్నింగ్ అసిస్టెంట్' : 'AI Learning Assistant'}</h3>
            <p className="text-xs text-slate-500">{lang === 'te' ? 'సందేహాలను అడగండి, వ్యక్తిగత అధ్యయన ప్రణాళిక పొందండి' : 'Ask doubts, get personalized study plans'}</p>
          </div>
        </div>
        <button className="btn-primary w-full">
          <Sparkles className="w-4 h-4" />
          {lang === 'te' ? 'AI అసిస్టెంట్‌తో మాట్లాడండి' : 'Chat with AI Assistant'}
        </button>
      </Card>
    </div>
  );
}
