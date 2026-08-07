import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock, ChevronLeft, ChevronRight, Flag, AlertCircle, CheckCircle2,
  XCircle, BarChart3, Download, Home, RotateCcw, Target, TrendingUp,
  Trophy, Circle, ClipboardCheck,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ExamInfo } from '@/lib/examData';
import { getQuestionsForExam, getPracticeQuestions, getDailyQuestions } from '@/lib/questionBank';
import type { MCQ } from '@/lib/questionBank';
import { addMockTestResult } from '@/lib/progress';

interface MockTestProps {
  exam: ExamInfo;
  testNumber: number;
  lang: 'en' | 'te' | 'hi';
  onExit: () => void;
  practiceTopic?: string;
  practiceLevel?: 'easy' | 'medium' | 'hard' | 'expert';
  dailyMode?: boolean;
}

type Phase = 'instructions' | 'running' | 'results';

export function MockTest({ exam, testNumber, lang, onExit, practiceTopic, practiceLevel, dailyMode }: MockTestProps) {
  const [phase, setPhase] = useState<Phase>('instructions');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<{
    score: number; correct: number; wrong: number; attempted: number;
    timeTaken: number; weakTopics: string[];
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPractice = !!practiceTopic;
  const isDaily = !!dailyMode;
  const questionCount = isDaily ? 10 : isPractice ? 20 : 50;
  const duration = isDaily ? 5 : isPractice ? 15 : 60; // minutes

  // Generate questions
  useEffect(() => {
    if (phase === 'instructions') {
      let qs: MCQ[];
      if (isPractice && practiceTopic) {
        qs = getPracticeQuestions(practiceTopic, practiceLevel ?? 'easy', questionCount);
      } else if (isDaily) {
        qs = getDailyQuestions(questionCount);
      } else {
        qs = getQuestionsForExam(exam.slug, questionCount);
      }
      setQuestions(qs);
    }
  }, [phase, exam.slug, isPractice, isDaily, practiceTopic, practiceLevel, questionCount]);

  // Timer
  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [phase]);

  const startTest = () => {
    setPhase('running');
    setTimeLeft(duration * 60);
    setStartTime(Date.now());
    setAnswers({});
    setMarked(new Set());
    setCurrentQ(0);
  };

  const selectAnswer = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const toggleMark = (qIndex: number) => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(qIndex)) next.delete(qIndex);
      else next.add(qIndex);
      return next;
    });
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let correct = 0, wrong = 0, attempted = 0;
    const wrongTopics: string[] = [];
    questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        attempted++;
        if (answers[i] === q.correctIndex) correct++;
        else {
          wrong++;
          if (!wrongTopics.includes(q.topic)) wrongTopics.push(q.topic);
        }
      }
    });
    const score = correct - Math.floor(wrong / 4); // 1/4 negative marking
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    setResults({ score, correct, wrong, attempted, timeTaken, weakTopics: wrongTopics });

    // Save result
    addMockTestResult({
      examSlug: exam.slug,
      testId: `mt-${exam.slug}-${testNumber}`,
      score: Math.max(0, score),
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      attemptedQuestions: attempted,
      timeTaken,
      weakTopics: wrongTopics,
    });

    setPhase('results');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ===== Instructions Phase =====
  if (phase === 'instructions') {
    return (
      <div className="container-page py-10 max-w-2xl">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4">
              <ClipboardCheck className="w-8 h-8 text-brand-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {isDaily ? (lang === 'te' ? 'రోజువారీ ప్రాక్టీస్' : 'Daily Practice') :
                isPractice ? (lang === 'te' ? 'ప్రాక్టీస్ టెస్ట్' : 'Practice Test') :
                `${lang === 'te' ? 'మాక్ టెస్ట్' : 'Mock Test'} ${testNumber}`}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{exam.name}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{questionCount}</p>
              <p className="text-xs text-slate-500">{lang === 'te' ? 'ప్రశ్నలు' : 'Questions'}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{duration}</p>
              <p className="text-xs text-slate-500">{lang === 'te' ? 'నిమిషాలు' : 'Minutes'}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">-0.25</p>
              <p className="text-xs text-slate-500">{lang === 'te' ? 'నెగిటివ్' : 'Negative'}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lang === 'te' ? 'సూచనలు' : 'Instructions'}</h3>
            {[
              lang === 'te' ? 'ప్రతి సరైన సమాధానానికి +1 మార్కు' : '+1 mark for each correct answer',
              lang === 'te' ? 'ప్రతి తప్పు సమాధానానికి -0.25 మార్కు' : '-0.25 marks for each wrong answer',
              lang === 'te' ? 'సమాధానం ఇవ్వని ప్రశ్నకు 0 మార్కులు' : '0 marks for unattempted questions',
              lang === 'te' ? 'సమయం ముగిసేసరికి ఆటో సబ్మిషన్' : 'Auto-submit when time runs out',
              lang === 'te' ? 'మీరు ప్రశ్నలను తిరిగి చూడవచ్చు' : 'You can navigate between questions',
              lang === 'te' ? 'తర్వాత సమీక్ష కోసం ప్రశ్నను గుర్తించండి' : 'Flag questions for later review',
            ].map((inst, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                {inst}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={onExit} className="btn-outline flex-1">{lang === 'te' ? 'రద్దు' : 'Cancel'}</button>
            <button onClick={startTest} className="btn-primary flex-1">
              {lang === 'te' ? 'టెస్ట్ ప్రారంభించండి' : 'Start Test'}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ===== Results Phase =====
  if (phase === 'results' && results) {
    return <MockTestResults exam={exam} results={results} lang={lang} questions={questions} answers={answers} onExit={onExit} onRetake={startTest} />;
  }

  // ===== Running Phase =====
  const q = questions[currentQ];
  if (!q) return null;
  const answered = answers[currentQ] !== undefined;
  const isMarked = marked.has(currentQ);

  return (
    <div className="container-page py-6">
      {/* Timer bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="btn-ghost !py-1.5 !px-3 text-sm">
            <ChevronLeft className="w-4 h-4" /> {lang === 'te' ? 'నిష్క్రమించు' : 'Exit'}
          </button>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isDaily ? (lang === 'te' ? 'రోజువారీ' : 'Daily') : isPractice ? (lang === 'te' ? 'ప్రాక్టీస్' : 'Practice') : `${lang === 'te' ? 'మాక్' : 'Mock'} ${testNumber}`}
          </span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'}`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        {/* Question area */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {lang === 'te' ? 'ప్రశ్న' : 'Question'} {currentQ + 1}/{questions.length}
            </span>
            <div className="flex items-center gap-2">
              {q.difficulty === 'easy' && <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">Easy</span>}
              {q.difficulty === 'medium' && <span className="badge bg-govt-100 text-govt-700 dark:bg-govt-900/40 dark:text-govt-300">Medium</span>}
              {q.difficulty === 'hard' && <span className="badge bg-saffron-100 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-300">Hard</span>}
              <button
                onClick={() => toggleMark(currentQ)}
                className={`p-1.5 rounded-lg transition-colors ${isMarked ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-slate-900 dark:text-white font-medium text-base mb-6 leading-relaxed">{q.question}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(currentQ, i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  answers[currentQ] === i
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  answers[currentQ] === i ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {answers[currentQ] === i && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
              </button>
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className="btn-outline !py-2"
            >
              <ChevronLeft className="w-4 h-4" /> {lang === 'te' ? 'ముందు' : 'Prev'}
            </button>
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                className="btn-primary !py-2"
              >
                {lang === 'te' ? 'తర్వాత' : 'Next'} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn !bg-brand-600 !text-white hover:!bg-brand-700 !py-2">
                <CheckCircle2 className="w-4 h-4" /> {lang === 'te' ? 'సబ్మిట్' : 'Submit'}
              </button>
            )}
          </div>
        </Card>

        {/* Question palette */}
        <Card className="p-4 h-fit lg:sticky lg:top-24">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">{lang === 'te' ? 'ప్రశ్న ప్యాలెట్' : 'Question Palette'}</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isCurrent = i === currentQ;
              const isFlagged = marked.has(i);
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center relative transition-all ${
                    isCurrent ? 'ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-slate-900' : ''
                  } ${
                    isAnswered ? 'bg-brand-500 text-white' : isFlagged ? 'bg-saffron-100 text-saffron-700 dark:bg-saffron-900/40 dark:text-saffron-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {i + 1}
                  {isFlagged && <Flag className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-saffron-500" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-brand-500" />{lang === 'te' ? 'సమాధానం ఇచ్చారు' : 'Answered'} ({Object.keys(answers).length})</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-saffron-100 dark:bg-saffron-900/40" />{lang === 'te' ? 'గుర్తించబడింది' : 'Flagged'} ({marked.size})</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800" />{lang === 'te' ? 'చూడలేదు' : 'Not visited'}</div>
          </div>
          <button onClick={handleSubmit} className="mt-4 w-full btn !bg-brand-600 !text-white hover:!bg-brand-700 !py-2 text-sm">
            <CheckCircle2 className="w-4 h-4" /> {lang === 'te' ? 'టెస్ట్ సబ్మిట్' : 'Submit Test'}
          </button>
        </Card>
      </div>
    </div>
  );
}

// ===== Results Component =====

function MockTestResults({
  exam, results, lang, questions, answers, onExit, onRetake,
}: {
  exam: ExamInfo;
  results: { score: number; correct: number; wrong: number; attempted: number; timeTaken: number; weakTopics: string[] };
  lang: 'en' | 'te' | 'hi';
  questions: MCQ[];
  answers: Record<number, number>;
  onExit: () => void;
  onRetake: () => void;
}) {
  const [showSolutions, setShowSolutions] = useState(false);
  const percent = Math.round((results.score / questions.length) * 100);
  const accuracy = results.attempted > 0 ? Math.round((results.correct / results.attempted) * 100) : 0;

  // Rank prediction (mock based on score percentage)
  const predictedRank = percent > 80 ? 'Top 5%' : percent > 60 ? 'Top 20%' : percent > 40 ? 'Top 50%' : 'Needs Improvement';
  const readiness = percent > 75 ? (lang === 'te' ? 'సిద్ధం' : 'Exam Ready') : percent > 50 ? (lang === 'te' ? 'దగ్గరలో' : 'Almost Ready') : (lang === 'te' ? 'సన్నాహం అవసరం' : 'Need More Prep');

  const downloadScorecard = () => {
    const content = `MOCK TEST SCORECARD\n${'='.repeat(30)}\n\nExam: ${exam.name}\nTest: Mock Test\nDate: ${new Date().toLocaleString()}\n\nScore: ${results.score}/${questions.length}\nCorrect: ${results.correct}\nWrong: ${results.wrong}\nAttempted: ${results.attempted}/${questions.length}\nAccuracy: ${accuracy}%\nTime Taken: ${Math.floor(results.timeTaken / 60)}m ${results.timeTaken % 60}s\n\nWeak Topics:\n${results.weakTopics.map(t => `  - ${t}`).join('\n')}\n\nPredicted Rank: ${predictedRank}\nReadiness: ${readiness}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scorecard-${exam.slug}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-page py-8 max-w-3xl">
      {/* Score card */}
      <Card className="p-8 text-center mb-6">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
          percent > 75 ? 'bg-brand-100 dark:bg-brand-900/40' : percent > 50 ? 'bg-saffron-100 dark:bg-saffron-900/40' : 'bg-red-100 dark:bg-red-900/40'
        }`}>
          <Trophy className={`w-10 h-10 ${percent > 75 ? 'text-brand-600' : percent > 50 ? 'text-saffron-600' : 'text-red-600'}`} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lang === 'te' ? 'టెస్ట్ పూర్తయ్యింది!' : 'Test Complete!'}</h1>
        <p className="text-sm text-slate-500 mt-1">{exam.name}</p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          <div>
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{results.score}</p>
            <p className="text-xs text-slate-500">{lang === 'te' ? 'స్కోర్' : 'Score'}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{results.correct}</p>
            <p className="text-xs text-slate-500">{lang === 'te' ? 'సరైనవి' : 'Correct'}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-500">{results.wrong}</p>
            <p className="text-xs text-slate-500">{lang === 'te' ? 'తప్పులు' : 'Wrong'}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{accuracy}%</p>
            <p className="text-xs text-slate-500">{lang === 'te' ? 'ఖచ్చితత్వం' : 'Accuracy'}</p>
          </div>
        </div>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-govt-600 dark:text-govt-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{lang === 'te' ? 'పనితీరు విశ్లేషణ' : 'Performance Analytics'}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'te' ? 'మొత్తం ప్రశ్నలు' : 'Total Questions'}</span><span className="font-semibold">{questions.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'te' ? 'ప్రయత్నించారు' : 'Attempted'}</span><span className="font-semibold">{results.attempted}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'te' ? 'ఖచ్చితత్వం' : 'Accuracy'}</span><span className="font-semibold">{accuracy}%</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'te' ? 'సమయం' : 'Time Taken'}</span><span className="font-semibold">{Math.floor(results.timeTaken / 60)}m {results.timeTaken % 60}s</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'te' ? 'ఊహించిన ర్యాంక్' : 'Predicted Rank'}</span><span className="font-semibold text-brand-600">{predictedRank}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{lang === 'te' ? 'సిద్ధత' : 'Readiness'}</span><span className="font-semibold">{readiness}</span></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{lang === 'te' ? 'బలహీన అంశాలు' : 'Weak Topic Analysis'}</h3>
          </div>
          {results.weakTopics.length > 0 ? (
            <div className="space-y-2">
              {results.weakTopics.map((t, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-saffron-50 dark:bg-saffron-900/20">
                  <AlertCircle className="w-4 h-4 text-saffron-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{t}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-600 dark:text-brand-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{lang === 'te' ? 'బలహీన అంశాలు లేవు!' : 'No weak topics — great job!'}</p>
          )}
        </Card>
      </div>

      {/* Score visual */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{lang === 'te' ? 'స్కోర్ శాతం' : 'Score Percentage'}</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">{percent}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${percent > 75 ? 'bg-brand-500' : percent > 50 ? 'bg-saffron-500' : 'bg-red-500'}`} style={{ width: `${Math.max(0, percent)}%` }} />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => setShowSolutions(s => !s)} className="btn-outline flex-1">
          <ClipboardCheck className="w-4 h-4" />
          {showSolutions ? (lang === 'te' ? 'సమాధానాలు దాచండి' : 'Hide Solutions') : (lang === 'te' ? 'సమాధానాలు చూడండి' : 'View Solutions')}
        </button>
        <button onClick={downloadScorecard} className="btn-outline flex-1">
          <Download className="w-4 h-4" />
          {lang === 'te' ? 'స్కోర్‌కార్డ్' : 'Scorecard'}
        </button>
        <button onClick={onRetake} className="btn-outline flex-1">
          <RotateCcw className="w-4 h-4" />
          {lang === 'te' ? 'మళ్ళీ' : 'Retake'}
        </button>
        <button onClick={onExit} className="btn-primary flex-1">
          <Home className="w-4 h-4" />
          {lang === 'te' ? 'హోమ్' : 'Done'}
        </button>
      </div>

      {/* Solutions */}
      {showSolutions && (
        <Card className="p-6 animate-fade-in">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">{lang === 'te' ? 'ప్రశ్నలు & సమాధానాలు' : 'Questions & Solutions'}</h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-start gap-2 mb-2">
                    {userAns === undefined ? (
                      <Circle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    ) : isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    )}
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{i + 1}. {q.question}</p>
                  </div>
                  <div className="ml-6 space-y-1">
                    {q.options.map((opt, j) => (
                      <div key={j} className={`text-sm flex items-center gap-2 ${
                        j === q.correctIndex ? 'text-brand-600 dark:text-brand-400 font-semibold' :
                        j === userAns ? 'text-red-600 dark:text-red-400' : 'text-slate-500'
                      }`}>
                        {j === q.correctIndex && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {j === userAns && j !== q.correctIndex && <XCircle className="w-3.5 h-3.5" />}
                        {opt}
                      </div>
                    ))}
                    <div className="mt-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-950/30 text-xs text-slate-600 dark:text-slate-400">
                      <strong>{lang === 'te' ? 'వివరణ' : 'Explanation'}:</strong> {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
