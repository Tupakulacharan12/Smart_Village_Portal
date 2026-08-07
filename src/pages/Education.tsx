import { GraduationCap, MapPin, BookOpen, Award, FileText, School, ExternalLink, Trophy, ChevronRight, Laptop, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader, Card } from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { SCHOOLS } from '@/lib/data';
import { EXAMS } from '@/lib/examData';

interface EducationProps {
  navigate: (to: string) => void;
}

export function Education({ navigate }: EducationProps) {
  const { t, lang } = useLanguage();

  const scholarships = [
    { name: 'YSR Vidya Deevena', desc: lang === 'te' ? 'పూర్తి ఫీ రీయంబర్స్‌మెంట్' : 'Full fee reimbursement for higher education', link: 'https://jnanabhumi.ap.gov.in/' },
    { name: 'YSR Vasathi Deevena', desc: lang === 'te' ? 'బోర్డింగ్ & నివాస భత్తం' : 'Boarding & hostel maintenance allowance', link: 'https://jnanabhumi.ap.gov.in/' },
    { name: 'Ambedkar Overseas Vidya Nidhi', desc: lang === 'te' ? 'విదేశ విద్య కోసం ఆర్థిక సాయం' : 'Financial aid for overseas studies (SC/ST)', link: 'https://epass.apcfss.in/' },
    { name: 'Pre-Matric Scholarship', desc: lang === 'te' ? '9th-10th తరగతుల విద్యార్థులకు' : 'For 9th–10th class students (SC/ST)', link: 'https://jnanabhumi.ap.gov.in/' },
  ];

  const exams = [
    { name: 'SSC Public Exams', date: lang === 'te' ? 'ఏప్రిల్ 2026' : 'April 2026' },
    { name: 'Intermediate Exams', date: lang === 'te' ? 'మార్చి 2026' : 'March 2026' },
    { name: 'AP EAPCET (EAMCET)', date: lang === 'te' ? 'మే 2026' : 'May 2026' },
    { name: 'AP Polycet', date: lang === 'te' ? 'ఏప్రిల్ 2026' : 'April 2026' },
  ];

  const popularExams = EXAMS.slice(0, 6);

  return (
    <div>
      <PageHeader
        title={t('education')}
        subtitle={lang === 'te' ? 'పాఠశాలలు, కళాశాలలు, స్కాలర్‌షిప్‌లు' : 'Schools, colleges, scholarships, and exam notifications'}
        icon={GraduationCap}
        image="https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      <div className="container-page py-10 sm:py-14 space-y-10">
        {/* Competitive Exams Hub banner */}
        <Card className="p-6 bg-gradient-to-br from-brand-600 to-govt-700 border-0 overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10">
            <Trophy className="w-40 h-40 text-white -mr-8 -mt-8" />
          </div>
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{lang === 'te' ? 'పోటీ పరీక్షల హబ్' : 'Competitive Exams Hub'}</h2>
                <p className="text-sm text-brand-100 mt-1">{lang === 'te' ? '50+ పరీక్షలు, మాక్ టెస్ట్‌లు, సిలబస్, పురోగతి ట్రాకింగ్' : '50+ exams, mock tests, syllabus, progress tracking & study materials'}</p>
              </div>
            </div>
            <button onClick={() => navigate('exams')} className="btn !bg-white !text-brand-700 hover:!bg-brand-50 shadow-lg">
              {lang === 'te' ? 'అన్ని పరీక్షలు చూడండి' : 'Explore All Exams'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick exam chips */}
          <div className="relative mt-5 flex flex-wrap gap-2">
            {popularExams.map(e => (
              <button
                key={e.slug}
                onClick={() => navigate(`exam/${e.slug}`)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white hover:bg-white/25 transition-colors backdrop-blur-sm"
              >
                {e.name}
              </button>
            ))}
            <button
              onClick={() => navigate('exams')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              +{EXAMS.length - 6} {lang === 'te' ? 'మరిన్ని' : 'more'}
            </button>
          </div>
        </Card>

        {/* Schools & colleges */}
        <section>
          <h2 className="section-title mb-6">{lang === 'te' ? 'పాఠశాలలు & కళాశాలలు' : 'Schools & Colleges'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCHOOLS.map((s, i) => (
              <Card key={i} hover className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-govt-100 dark:bg-govt-900/40 flex items-center justify-center shrink-0">
                    <School className="w-5 h-5 text-govt-600 dark:text-govt-400" />
                  </div>
                  <span className="badge bg-govt-100 text-govt-700 dark:bg-govt-900/40 dark:text-govt-300">{s.type}</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{s.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{s.address}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><BookOpen className="w-3 h-3" />{s.classes}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Scholarships */}
        <section>
          <h2 className="section-title mb-6">{lang === 'te' ? 'స్కాలర్‌షిప్‌లు' : 'Scholarships'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scholarships.map((s, i) => (
              <Card key={i} hover className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-saffron-100 dark:bg-saffron-900/30 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{s.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                </div>
                <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:scale-110 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* Exam notifications */}
        <section>
          <h2 className="section-title mb-6">{lang === 'te' ? 'పరీక్షా సూచనలు' : 'Exam Notifications'}</h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {exams.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{e.name}</span>
                </div>
                <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{e.date}</span>
              </div>
            ))}
          </Card>
        </section>

        {/* SWAYAM */}
        <section>
          <Card className="overflow-hidden border-0">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Laptop className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">SWAYAM — Free Online Courses</h2>
                  <p className="text-blue-100 text-sm">
                    {lang === 'te'
                      ? 'ప్రభుత్వ ఉచిత ఆన్‌లైన్ కోర్సులు — ఐఐటి, ఐఐఎం, ఎన్ఐటి ప్రొఫెసర్ల నుండి నేరుగా'
                      : 'Government free online courses — taught directly by IIT, IIM, and NIT professors'}
                  </p>
                </div>
                <a href="https://swayam.gov.in" target="_blank" rel="noopener noreferrer" className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center gap-1.5">
                  {lang === 'te' ? 'స్వయం వెబ్‌సైట్' : 'Visit SWAYAM'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="p-6">
              {/* Importance */}
              <div className="mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  {lang === 'te' ? 'స్వయం ఎందుకు ముఖ్యం?' : 'Why is SWAYAM important?'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { te: 'ఐఐటి, ఐఐఎం, ఎన్ఐటి వంటి టాప్ సంస్థల కోర్సులు ఉచితం', en: 'Courses from top institutes like IIT, IIM, NIT — completely free' },
                    { te: 'ఇంట్లోనే గ్రాడ్యుయేషన్, పోస్ట్ గ్రాడ్యుయేషన్ స్థాయి విద్య', en: 'Graduation and post-graduation level education from home' },
                    { te: 'సర్టిఫికెట్ పొందండి — ఉద్యోగాలకు చెల్లుబాటు అవుతుంది', en: 'Get certificates valid for jobs and higher education' },
                    { te: 'మీ స్వంత వేగంతో నేర్చుకోండి — మొబైల్ లేదా కంప్యూటర్‌లో', en: 'Learn at your own pace — on mobile or computer, anytime' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {lang === 'te' ? item.te : item.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular courses */}
              <div className="mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                  {lang === 'te' ? 'ప్రజాదరణ పొందిన కోర్సులు' : 'Popular Course Categories'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Engineering', 'Management', 'Computer Science', 'Mathematics',
                    'English Speaking', 'Agriculture', 'Commerce', 'Humanities',
                    'Teacher Training', 'Data Science',
                  ].map((cat) => (
                    <span key={cat} className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{cat}</span>
                  ))}
                </div>
              </div>

              {/* How to enroll */}
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                  {lang === 'te' ? 'ఎలా నమోదు చేయాలి?' : 'How to Enroll'}
                </h3>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {[
                    { te: 'swayam.gov.in సందర్శించండి', en: 'Visit swayam.gov.in' },
                    { te: 'మొబైల్ నంబర్‌తో ఉచిత ఖాతా సృష్టించండి', en: 'Create a free account with your mobile number' },
                    { te: 'కోర్సు ఎంచుకుని నమోదు చేయండి — తరగతులు వీడియోలో', en: 'Choose a course and enroll — classes are in video format' },
                    { te: 'పరీక్ష రాసి సర్టిఫికెట్ పొందండి (చిన్న రుసుము)', en: 'Take the exam and get a certificate (small fee for certificate)' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span>{lang === 'te' ? step.te : step.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://swayam.gov.in" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-5" style={{ background: 'linear-gradient(to right, #4f46e5, #2563eb)' }}>
                {lang === 'te' ? 'ఇప్పుడే నమోదు చేయండి' : 'Enroll Now — It\'s Free'}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
