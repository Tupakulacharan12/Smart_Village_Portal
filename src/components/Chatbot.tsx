import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GOVERNMENT_SCHEMES, EMERGENCY_CONTACTS, VILLAGE_INFO } from '@/lib/data';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export function Chatbot({ navigate }: { navigate: (to: string) => void }) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'bot', text: t('chatbotGreeting') }]);
  }, [lang, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const getAnswer = (q: string): string => {
    const query = q.toLowerCase();
    const te = lang === 'te';

    if (/scheme|pathak|పథక|welfare|pension|scholar|housing|farmer|రైతు|agricult/.test(query)) {
      const list = GOVERNMENT_SCHEMES.slice(0, 4).map((s) => `• ${te ? s.title_te : s.title}`).join('\n');
      return `${te ? 'అందుబాటులో ఉన్న పథకాలు:' : 'Available government schemes:'}\n${list}\n${te ? 'వివరాల కోసం ప్రభుత్వ పథకాలు పేజీని చూడండి.' : 'Visit the Govt Schemes page for full details.'}`;
    }
    if (/emergency|helpline|police|fire|ambulance|అత్యవసర|పోలీస్/.test(query)) {
      const list = EMERGENCY_CONTACTS.slice(0, 5).map((c) => `${te ? c.name_te : c.name}: ${c.number}`).join('\n');
      return `${te ? 'అత్యవసర నంబర్లు:' : 'Emergency numbers:'}\n${list}\n${te ? 'మరిన్ని కోసం అత్యవసర సేవలు పేజీని చూడండి.' : 'See the Emergency Services page for more.'}`;
    }
    if (/complaint|ఫిర్యాదు|problem|issue|water|road|light|garbage/.test(query)) {
      return te
        ? 'ఫిర్యాదు దాఖలు చేయడానికి ఫిర్యాదు పోర్టల్ పేజీకి వెళ్ళండి. మీ పేరు, మొబైల్, ప్రాంతం మరియు సమస్య వివరాలు ఇవ్వండి. టికెట్ నంబర్ లభిస్తుంది, దానితో ట్రాక్ చేయవచ్చు.'
        : 'Go to the Complaint Portal page to submit a complaint. Fill your name, mobile, area, and issue details. You will get a ticket number to track it later.';
    }
    if (/population|జనాభా|literacy|అక్షర|area|location|pincode|history|village|గ్రామ/.test(query)) {
      return te
        ? `${VILLAGE_INFO.name_te} — జనాభా: ${VILLAGE_INFO.population}, అక్షరాస్యత: ${VILLAGE_INFO.literacy}, పిన్‌కోడ్: ${VILLAGE_INFO.pincode}. మరిన్ని వివరాల కోసం గ్రామం గురించి పేజీని చూడండి.`
        : `${VILLAGE_INFO.name} — Population: ${VILLAGE_INFO.population}, Literacy: ${VILLAGE_INFO.literacy}, Pincode: ${VILLAGE_INFO.pincode}. Visit the About Village page for more.`;
    }
    if (/health|hospital|doctor|camp|ఆరోగ్య|ఆసుపత్రి/.test(query)) {
      return te
        ? 'PHC గుడ్లవల్లేరులో అందుబాటులో ఉంది. ఆరోగ్య శిబిరాలు మరియు టీకా కార్యక్రమాల వివరాల కోసం ఆరోగ్య సేవలు పేజీని చూడండి.'
        : 'The PHC is available in Gudlavalleru. Visit the Health Services page for health camps and vaccination drive details.';
    }
    if (/school|college|education|పాఠశాల|కళాశాల|విద్య/.test(query)) {
      return te
        ? 'ZP హైస్కూల్, SRK ఇన్‌స్టిట్యూట్, గవర్నమెంట్ జూనియర్ కళాశాల మరియు అనేక పాఠశాలలు ఉన్నాయి. వివరాల కోసం విద్య పేజీని చూడండి.'
        : 'ZP High School, SRK Institute, Government Junior College and several schools are here. Visit the Education page for details.';
    }
    if (/hello|hi|namaste|నమస్కారం/.test(query)) {
      return te ? 'నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?' : 'Hello! How can I help you today?';
    }
    return te
      ? 'క్షమించండి, నేను అర్థం చేసుకోలేకపోయాను. పథకాలు, ఫిర్యాదులు, అత్యవసర నంబర్లు, ఆరోగ్యం, విద్య లేదా గ్రామం గురించి అడగండి.'
      : "Sorry, I didn't understand. Ask me about schemes, complaints, emergency numbers, health, education, or the village.";
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }, { role: 'bot', text: getAnswer(text) }]);
  };

  const quickActions: { label: string; q: string }[] = [
    { label: lang === 'te' ? 'పథకాలు' : 'Schemes', q: 'schemes' },
    { label: lang === 'te' ? 'ఫిర్యాదు' : 'Complaint', q: 'complaint' },
    { label: lang === 'te' ? 'అత్యవసర' : 'Emergency', q: 'emergency numbers' },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 hover:scale-105 transition-all flex items-center justify-center group"
        aria-label="Chat assistant"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />}
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 card shadow-2xl flex flex-col max-h-[70vh] animate-scale-in origin-bottom-right">
          <div className="flex items-center gap-2.5 p-4 border-b border-slate-200 dark:border-slate-800 bg-brand-600 rounded-t-2xl">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{t('chatbotTitle')}</div>
              <div className="text-xs text-brand-100">Online</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => { setInput(qa.q); }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('chatPlaceholder')}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button onClick={send} className="w-9 h-9 rounded-xl bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center shrink-0 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
