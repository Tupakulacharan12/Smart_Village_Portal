import { useState, useMemo } from 'react';
import {
  TrendingUp, Target, Flame, Award, Clock, BarChart3, ChevronRight,
  Trophy, BookOpen, CheckCircle2, Star, Bookmark, Calendar,
  ArrowLeft, Sparkles, Brain, Zap, ClipboardCheck,
} from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { EXAMS, getTopicCount, getAllTopics } from '@/lib/examData';
import {
  getProgress, getStudyStreak, getMockTestScores, getAllCompletedTopics,
  isBookmarked, getMockTestScores as getScores,
} from '@/lib/progress';
import type { MockTestResult } from '@/lib/progress';

interface DashboardProps {
  navigate: (to: string) => void;
}

export function ProgressDashboard({ navigate }: DashboardProps) {
  const { lang } = useLanguage();
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const progress = useMemo(() => getProgress(), []);
  const streak = useMemo(() => getStudyStreak(), []);
  const allScores = useMemo(() => getMockTestScores(), []);

  // Calculate overall stats
  const totalTopicsCompleted = progress.topics.filter(t => t.completed).length;
  const totalMockTests = allScores.length;
  const avgScore = totalMockTests > 0 ? Math.round(allScores.reduce((s, m) => s + m.score, 0) / totalMockTests) : 0;
  const bestScore = totalMockTests > 0 ? Math.max(...allScores.map(s => s.score)) : 0;

  // Per-exam progress
  const examProgressList = EXAMS.filter(e =>
    progress.topics.some(t => t.examSlug === e.slug) || allScores.some(s => s.examSlug === e.slug) || isBookmarked(e.slug)
  ).map(exam => {
    const completed = getAllCompletedTopics(exam.slug).length;
    const total = getTopicCount(exam);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const scores = getScores(exam.slug);
    return { exam, completed, total, percent, scores };
  });

  // Readiness calculation
  const readiness = avgScore > 75 ? 85 : avgScore > 60 ? 65 : avgScore > 40 ? 40 : 20;

  // Smart recommendations
  const recommendations = generateRecommendations(allScores, examProgressList, lang);

  // Weekly progress (mock — based on scores)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayScores = allScores.filter(s => new Date(s.date).toDateString() === d.toDateString());
    return { date: d, count: dayScores.length, avgScore: dayScores.length > 0 ? Math.round(dayScores.reduce((sum, s) => sum + s.score, 0) / dayScores.length) : 0 };
  });

  return (
    <div>
      <PageHeader
        title={lang === 'te' ? 'పురోగతి డాష్‌బోర్డ్' : 'Progress Dashboard'}
        subtitle={lang === 'te' ? 'మీ అధ్యయన ప్రయాణాన్ని ట్రాక్ చేయండి' : 'Track your learning journey, scores, and readiness'}
        icon={TrendingUp}
        image="https://images.pexels.com/photos/18012456/pexels-photo-18012456.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <div className="container-page py-8 space-y-8">
        <button onClick={() => navigate('exams')} className="btn-ghost !py-1.5 !px-3 text-sm -mt-4">
          <ArrowLeft className="w-4 h-4" /> {lang === 'te' ? 'పరీక్షల హబ్' : 'Back to Exams'}
        </button>

        {/* Hero stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Flame} label={lang === 'te' ? 'కరెంట్ స్ట్రీక్' : 'Current Streak'} value={`${streak.currentStreak} ${lang === 'te' ? 'రోజులు' : 'days'}`} color="saffron" />
          <StatCard icon={Trophy} label={lang === 'te' ? 'అత్యుత్తమ స్కోర్' : 'Best Score'} value={bestScore > 0 ? bestScore.toString() : '—'} color="brand" />
          <StatCard icon={CheckCircle2} label={lang === 'te' ? 'అంశాలు పూర్తయ్యాయి' : 'Topics Done'} value={totalTopicsCompleted.toString()} color="govt" />
          <StatCard icon={ClipboardCheck} label={lang === 'te' ? 'మాక్ టెస్ట్‌లు' : 'Mock Tests'} value={totalMockTests.toString()} color="teal" />
        </div>

        {/* Readiness + Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'పరీక్ష సిద్ధత' : 'Exam Readiness'}</h2>
            </div>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-700" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                  className={readiness > 65 ? 'text-brand-500' : readiness > 40 ? 'text-saffron-500' : 'text-red-500'}
                  strokeDasharray={`${(readiness / 100) * 327} 327`}
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{readiness}%</span>
                <span className="text-xs text-slate-500">{lang === 'te' ? 'సిద్ధం' : 'Ready'}</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              {readiness > 75 ? (lang === 'te' ? 'పరీక్షకు సిద్ధం!' : 'You are exam ready!') :
               readiness > 50 ? (lang === 'te' ? 'దగ్గరలో ఉన్నారు' : 'Almost there!') :
               (lang === 'te' ? 'మరింత సన్నాహం అవసరం' : 'Need more preparation')}
            </p>
          </Card>

          {/* Weekly progress */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-govt-600 dark:text-govt-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'వారపు పురోగతి' : 'Weekly Progress'}</h2>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${day.count > 0 ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                      style={{ height: `${day.count > 0 ? Math.max(20, day.avgScore) : 8}%` }}
                      title={day.count > 0 ? `${day.avgScore} avg score` : 'No activity'}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{day.date.toLocaleDateString('en', { weekday: 'short' }).charAt(0)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{lang === 'te' ? 'గత 7 రోజులు' : 'Last 7 days'}</span>
              <span>{allScores.filter(s => { const d = new Date(s.date); const w = new Date(); w.setDate(w.getDate() - 7); return d > w; }).length} {lang === 'te' ? 'టెస్ట్‌లు' : 'tests'}</span>
            </div>
          </Card>
        </div>

        {/* Smart Recommendations */}
        <Card className="p-6 bg-gradient-to-br from-govt-50 to-brand-50 dark:from-govt-950/30 dark:to-brand-950/30 border-govt-200 dark:border-govt-800">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-govt-600 dark:text-govt-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'స్మార్ట్ సిఫార్సులు' : 'Smart Recommendations'}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendations.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <button
                  key={i}
                  onClick={() => navigate(rec.route)}
                  className="card p-4 text-left hover:shadow-md transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg ${rec.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{rec.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{rec.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
                    {lang === 'te' ? 'ఇప్పుడు' : 'Go'} <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Per-exam progress */}
        {examProgressList.length > 0 && (
          <div>
            <h2 className="section-title mb-4">{lang === 'te' ? 'పరీక్ష-వారీ పురోగతి' : 'Per-Exam Progress'}</h2>
            <div className="space-y-3">
              {examProgressList.map(({ exam, completed, total, percent, scores }) => (
                <Card key={exam.slug} hover className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{exam.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{completed}/{total} {lang === 'te' ? 'అంశాలు' : 'topics'} • {scores.length} {lang === 'te' ? 'టెస్ట్‌లు' : 'tests'}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{percent}%</p>
                      <button onClick={() => navigate(`exam/${exam.slug}`)} className="text-xs font-semibold text-slate-500 hover:text-brand-600">
                        {lang === 'te' ? 'కొనసాగించండి' : 'Continue'} →
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent mock test scores */}
        {allScores.length > 0 && (
          <div>
            <h2 className="section-title mb-4">{lang === 'te' ? 'ఇటీవల స్కోర్‌లు' : 'Recent Mock Test Scores'}</h2>
            <Card className="divide-y divide-slate-100 dark:divide-slate-800">
              {allScores.slice(-5).reverse().map((score, i) => {
                const exam = EXAMS.find(e => e.slug === score.examSlug);
                const percent = Math.round((score.score / score.totalQuestions) * 100);
                return (
                  <div key={score.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{exam?.name ?? score.examSlug}</p>
                      <p className="text-xs text-slate-500">{new Date(score.date).toLocaleDateString()} • {score.attemptedQuestions}/{score.totalQuestions} {lang === 'te' ? 'ప్రయత్నించారు' : 'attempted'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${percent > 60 ? 'text-brand-600' : 'text-saffron-600'}`}>{score.score}</p>
                      <p className="text-xs text-slate-400">{percent}%</p>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* Bookmarks */}
        {progress.bookmarks.length > 0 && (
          <div>
            <h2 className="section-title mb-4">{lang === 'te' ? 'బుక్‌మార్క్ చేసిన పరీక్షలు' : 'Bookmarked Exams'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {progress.bookmarks.map(slug => {
                const exam = EXAMS.find(e => e.slug === slug);
                if (!exam) return null;
                return (
                  <button key={slug} onClick={() => navigate(`exam/${slug}`)} className="card card-hover p-4 text-center">
                    <Bookmark className="w-5 h-5 text-saffron-500 fill-saffron-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{exam.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {totalTopicsCompleted === 0 && totalMockTests === 0 && progress.bookmarks.length === 0 && (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{lang === 'te' ? 'ప్రారంభించడానికి సిద్ధం?' : 'Ready to start?'}</h2>
            <p className="text-sm text-slate-500 mb-4">{lang === 'te' ? 'ఒక పరీక్షను ఎంచుకుని అధ్యయనం ప్రారంభించండి' : 'Pick an exam and start studying to track your progress here'}</p>
            <button onClick={() => navigate('exams')} className="btn-primary">
              {lang === 'te' ? 'పరీక్షలు చూడండి' : 'Browse Exams'} <ChevronRight className="w-4 h-4" />
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    saffron: 'from-saffron-500 to-saffron-600',
    brand: 'from-brand-500 to-brand-600',
    govt: 'from-govt-500 to-govt-600',
    teal: 'from-teal-500 to-teal-600',
  };
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </Card>
  );
}

function generateRecommendations(
  scores: MockTestResult[],
  examProgress: { exam: typeof EXAMS[0]; percent: number; scores: MockTestResult[] }[],
  lang: 'en' | 'te' | 'hi',
) {
  const recs: { icon: typeof Target; title: string; desc: string; color: string; route: string }[] = [];

  // Find weak topics from recent scores
  const recentScores = scores.slice(-3);
  const weakTopics = new Set<string>();
  recentScores.forEach(s => s.weakTopics.forEach(t => weakTopics.add(t)));

  if (weakTopics.size > 0) {
    recs.push({
      icon: Target,
      title: lang === 'te' ? 'బలహీన అంశాలపై దృష్టి' : 'Focus on Weak Topics',
      desc: `${weakTopics.size} ${lang === 'te' ? 'అంశాలు మెరుగుపరచాలి' : 'topics need improvement'}`,
      color: 'bg-saffron-500',
      route: 'exams',
    });
  }

  // Suggest next topic to study
  const inProgressExam = examProgress.find(e => e.percent > 0 && e.percent < 100);
  if (inProgressExam) {
    recs.push({
      icon: BookOpen,
      title: lang === 'te' ? 'తదుపరి అంశం' : 'Continue Learning',
      desc: `${inProgressExam.exam.name} — ${inProgressExam.percent}% ${lang === 'te' ? 'పూర్తయ్యింది' : 'complete'}`,
      color: 'bg-brand-500',
      route: `exam/${inProgressExam.exam.slug}`,
    });
  }

  // Suggest a mock test
  if (scores.length < 5) {
    recs.push({
      icon: Zap,
      title: lang === 'te' ? 'మాక్ టెస్ట్ ప్రయత్నించండి' : 'Take a Mock Test',
      desc: lang === 'te' ? 'మీ స్థాయిని పరీక్షించండి' : 'Test your preparation level',
      color: 'bg-govt-500',
      route: 'exams',
    });
  }

  // Daily practice
  recs.push({
    icon: Calendar,
    title: lang === 'te' ? 'రోజువారీ ప్రాక్టీస్' : 'Daily Practice',
    desc: lang === 'te' ? '10 MCQs ప్రయత్నించండి' : 'Try today\'s 10 MCQs',
    color: 'bg-teal-500',
    route: 'exams',
  });

  // Revision
  if (scores.length > 0) {
    recs.push({
      icon: Brain,
      title: lang === 'te' ? 'పునశ్చరణ' : 'Revision Session',
      desc: lang === 'te' ? 'పూర్తయిన అంశాలను పునశ్చరించండి' : 'Review completed topics',
      color: 'bg-pink-500',
      route: 'exams',
    });
  }

  // New exam suggestion
  if (examProgress.length < 3) {
    recs.push({
      icon: Sparkles,
      title: lang === 'te' ? 'కొత్త పరీక్ష' : 'Explore New Exam',
      desc: lang === 'te' ? 'మరిన్ని పరీక్షలను చూడండి' : 'Discover more exams to prepare for',
      color: 'bg-indigo-500',
      route: 'exams',
    });
  }

  return recs.slice(0, 6);
}
