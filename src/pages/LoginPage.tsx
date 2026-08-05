import { useState, useEffect } from 'react';
import {
  Lock, Mail, User, ArrowLeft, ArrowRight, Loader2, AlertCircle, Eye, EyeOff,
  KeyRound, CheckCircle2, ShieldCheck, Building2, MailCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type Step = 'signin' | 'signup' | 'forgot' | 'email-sent' | 'reset' | 'success';

export function LoginPage({ navigate }: { navigate: (to: string) => void }) {
  const { lang } = useLanguage();
  const { signIn, signUp, sendResetEmail, updatePassword, isRecovery, clearRecovery } = useAuth();
  const [step, setStep] = useState<Step>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // When Supabase redirects back with a recovery token, jump straight to reset form
  useEffect(() => {
    if (isRecovery) {
      setStep('reset');
      setError(null);
    }
  }, [isRecovery]);

  const tr = {
    signIn: lang === 'te' ? 'సైన్ ఇన్' : lang === 'hi' ? 'साइन इन' : 'Sign In',
    signUp: lang === 'te' ? 'సైన్ అప్' : lang === 'hi' ? 'साइन अप' : 'Sign Up',
    email: lang === 'te' ? 'ఇమెయిల్' : lang === 'hi' ? 'ईमेल' : 'Email',
    password: lang === 'te' ? 'పాస్‌వర్డ్' : lang === 'hi' ? 'पासवर्ड' : 'Password',
    confirmPassword: lang === 'te' ? 'పాస్‌వర్డ్ నిర్ధారణ' : lang === 'hi' ? 'पासवर्ड की पुष्टि' : 'Confirm Password',
    forgotPassword: lang === 'te' ? 'పాస్‌వర్డ్ మర్చిపోయారా?' : lang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?',
    backToHome: lang === 'te' ? 'హోమ్‌కు తిరిగి' : lang === 'hi' ? 'होम पर वापस' : 'Back to Home',
    noAccount: lang === 'te' ? 'ఖాతా లేదా? సైన్ అప్ చేయండి' : lang === 'hi' ? 'खाता नहीं? साइन अप करें' : 'No account? Sign up',
    haveAccount: lang === 'te' ? 'ఖాతా ఉందా? సైన్ ఇన్' : lang === 'hi' ? 'खाता है? साइन इन करें' : 'Have an account? Sign in',
    welcome: lang === 'te' ? 'తిరిగి స్వాగతం' : lang === 'hi' ? 'वापसी पर स्वागत' : 'Welcome Back',
    welcomeSub: lang === 'te' ? 'మీ ఖాతాకు సైన్ ఇన్ చేయండి' : lang === 'hi' ? 'अपने खाते में साइन इन करें' : 'Sign in to your account',
    createAccount: lang === 'te' ? 'కొత్త ఖాతా' : lang === 'hi' ? 'नया खाता बनाएं' : 'Create Account',
    createSub: lang === 'te' ? 'సైన్ అప్ చేసి ప్రారంభించండి' : lang === 'hi' ? 'साइन अप करके शुरू करें' : 'Sign up to get started',
    resetPassword: lang === 'te' ? 'పాస్‌వర్డ్ రీసెట్' : lang === 'hi' ? 'पासवर्ड रीसेट' : 'Reset Password',
    forgotSub: lang === 'te' ? 'మీ ఇమెయిల్‌కు రీసెట్ లింక్ పంపుతాము' : lang === 'hi' ? 'हम आपके ईमेल पर रीसेट लिंक भेजेंगे' : "We'll email you a reset link",
    sendLink: lang === 'te' ? 'రీసెట్ లింక్ పంపండి' : lang === 'hi' ? 'रीसेट लिंक भेजें' : 'Send Reset Link',
    checkEmail: lang === 'te' ? 'మీ ఇమెయిల్ చెక్ చేయండి' : lang === 'hi' ? 'अपना ईमेल चेक करें' : 'Check Your Email',
    checkEmailSub1: lang === 'te' ? 'రీసెట్ లింక్ పంపబడింది' : lang === 'hi' ? 'रीसेट लिंक भेजा गया' : 'A reset link was sent to',
    checkEmailSub2: lang === 'te' ? 'ఇమెయిల్‌లో లింక్‌పై క్లిక్ చేయండి, అది ఈ పేజీకి తిరిగి తీసుకువస్తుంది.' : lang === 'hi' ? 'ईमेल में लिंक पर क्लिक करें, वह इस पेज पर वापस लाएगा।' : 'Click the link in your email — it will bring you back here automatically.',
    newPwd: lang === 'te' ? 'కొత్త పాస్‌వర్డ్ సెట్ చేయండి' : lang === 'hi' ? 'नया पासवर्ड सेट करें' : 'Set New Password',
    newPwdLabel: lang === 'te' ? 'కొత్త పాస్‌వర్డ్' : lang === 'hi' ? 'नया पासवर्ड' : 'New Password',
    confirmNewPwd: lang === 'te' ? 'కొత్త పాస్‌వర్డ్ నిర్ధారణ' : lang === 'hi' ? 'नया पासवर्ड की पुष्टि' : 'Confirm New Password',
    updatePwd: lang === 'te' ? 'పాస్‌వర్డ్ అప్‌డేట్ చేయండి' : lang === 'hi' ? 'पासवर्ड अपडेट करें' : 'Update Password',
    resetSuccess: lang === 'te' ? 'పాస్‌వర్డ్ అప్‌డేట్ అయింది!' : lang === 'hi' ? 'पासवर्ड अपडेट हो गया!' : 'Password Updated!',
    resetSuccessSub: lang === 'te' ? 'ఇప్పుడు మీ కొత్త పాస్‌వర్డ్‌తో సైన్ ఇన్ చేయండి' : lang === 'hi' ? 'अब अपने नए पासवर्ड से साइन इन करें' : 'You can now sign in with your new password',
    pwdMismatch: lang === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు' : lang === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match',
    pwdTooShort: lang === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు' : lang === 'hi' ? 'कम से कम 6 अक्षर होने चाहिए' : 'Password must be at least 6 characters',
    continueSignIn: lang === 'te' ? 'సైన్ ఇన్ చేయండి' : lang === 'hi' ? 'साइन इन करें' : 'Go to Sign In',
    resend: lang === 'te' ? 'తిరిగి పంపండి' : lang === 'hi' ? 'फिर से भेजें' : 'Resend email',
  };

  const clearErrors = () => { setError(null); setSuccessMsg(null); };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else navigate('home');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (password !== confirmPassword) { setError(tr.pwdMismatch); return; }
    if (password.length < 6) { setError(tr.pwdTooShort); return; }
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccessMsg(lang === 'te' ? 'ఖాతా సృష్టించబడింది! ఇప్పుడు సైన్ ఇన్ చేయండి.' : lang === 'hi' ? 'खाता बनाया गया! साइन इन करें।' : 'Account created! You can now sign in.');
      setStep('signin');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const { error } = await sendResetEmail(email);
    setLoading(false);
    if (error) setError(error);
    else setStep('email-sent');
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (newPassword !== confirmNewPassword) { setError(tr.pwdMismatch); return; }
    if (newPassword.length < 6) { setError(tr.pwdTooShort); return; }
    setLoading(true);
    const { error } = await updatePassword(newPassword);
    setLoading(false);
    if (error) setError(error);
    else setStep('success');
  };

  const heroImage = 'https://images.pexels.com/photos/36436050/pexels-photo-36436050.jpeg?auto=compress&cs=tinysrgb&h=1200';

  const stepIcon = {
    signin: <Lock className="w-8 h-8 text-white" />,
    signup: <User className="w-8 h-8 text-white" />,
    forgot: <KeyRound className="w-8 h-8 text-white" />,
    'email-sent': <MailCheck className="w-8 h-8 text-white" />,
    reset: <KeyRound className="w-8 h-8 text-white" />,
    success: <CheckCircle2 className="w-8 h-8 text-white" />,
  };

  const stepTitle: Record<Step, string> = {
    signin: tr.welcome,
    signup: tr.createAccount,
    forgot: tr.resetPassword,
    'email-sent': tr.checkEmail,
    reset: tr.newPwd,
    success: tr.resetSuccess,
  };

  const stepSub: Record<Step, string> = {
    signin: tr.welcomeSub,
    signup: tr.createSub,
    forgot: tr.forgotSub,
    'email-sent': '',
    reset: lang === 'te' ? 'కొత్త పాస్‌వర్డ్ పెట్టండి' : lang === 'hi' ? 'नया पासवर्ड दर्ज करें' : 'Enter your new password below',
    success: tr.resetSuccessSub,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="relative hidden lg:block overflow-hidden">
        <img src={heroImage} alt="Village" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-brand-800/85 to-brand-700/70" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">
              {lang === 'te' ? 'స్మార్ట్ విలేజ్ పోర్టల్' : lang === 'hi' ? 'स्मार्ट विलेज पोर्टल' : 'Smart Village Portal'}
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              {lang === 'te' ? 'మీ గ్రామ సేవలన్నీ\nఒకే చోట' : lang === 'hi' ? 'सभी गाँव सेवाएँ\nएक जगह' : 'All village services\nin one place'}
            </h2>
            <p className="text-brand-100 text-sm leading-relaxed max-w-sm">
              {lang === 'te'
                ? 'పథకాలు, వార్తలు, ఫిర్యాదులు, ఆరోగ్యం, విద్య మరియు మరిన్ని — మీ ఖాతాతో ప్రాప్తించండి.'
                : lang === 'hi'
                  ? 'योजनाएँ, खबरें, शिकायतें, स्वास्थ्य, शिक्षा और बहुत कुछ।'
                  : 'Schemes, news, complaints, health, education and more — all in your account.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-brand-200">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Secure &amp; Private</span>
              <span className="flex items-center gap-1.5"><KeyRound className="w-4 h-4" /> Encrypted</span>
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Govt. Initiative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <button onClick={() => navigate('home')} className="btn-ghost mb-6 -ml-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            {tr.backToHome}
          </button>

          <div className="card p-7 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg mb-4">
                {stepIcon[step]}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{stepTitle[step]}</h1>
              {stepSub[step] && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stepSub[step]}</p>
              )}
            </div>

            {/* Success message (e.g. after sign up) */}
            {successMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm mb-4 animate-fade-in-fast">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ── Sign In ── */}
            {step === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <Field label={tr.email}>
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-11" placeholder="you@example.com" />
                </Field>
                <Field label={tr.password}>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pl-11 pr-11" placeholder="••••••••" />
                  <EyeToggle show={showPwd} onToggle={() => setShowPwd(!showPwd)} />
                </Field>
                <div className="flex justify-end -mt-1">
                  <button type="button" onClick={() => { clearErrors(); setStep('forgot'); }} className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
                    {tr.forgotPassword}
                  </button>
                </div>
                {error && <ErrorBox text={error} />}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {tr.signIn}
                </button>
              </form>
            )}

            {/* ── Sign Up ── */}
            {step === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <Field label={tr.email}>
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-11" placeholder="you@example.com" />
                </Field>
                <Field label={tr.password}>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pl-11 pr-11" placeholder="••••••••" />
                  <EyeToggle show={showPwd} onToggle={() => setShowPwd(!showPwd)} />
                </Field>
                <Field label={tr.confirmPassword}>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-field pl-11" placeholder="••••••••" />
                </Field>
                {error && <ErrorBox text={error} />}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                  {tr.signUp}
                </button>
              </form>
            )}

            {/* ── Forgot — enter email ── */}
            {step === 'forgot' && (
              <form onSubmit={handleSendLink} className="space-y-4">
                <Field label={tr.email}>
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-11" placeholder="you@example.com" />
                </Field>
                {error && <ErrorBox text={error} />}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {tr.sendLink}
                </button>
                <button type="button" onClick={() => { clearErrors(); setStep('signin'); }} className="btn-ghost w-full text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  {tr.signIn}
                </button>
              </form>
            )}

            {/* ── Email sent — wait for link click ── */}
            {step === 'email-sent' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center py-4 gap-4">
                  <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center animate-scale-in">
                    <MailCheck className="w-10 h-10 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{tr.checkEmailSub1}:</p>
                    <p className="text-brand-700 dark:text-brand-300 font-bold mt-0.5 break-all">{email}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200 text-left">
                    <p className="font-semibold mb-1">
                      {lang === 'te' ? 'తదుపరి దశ:' : lang === 'hi' ? 'अगला कदम:' : 'Next step:'}
                    </p>
                    <p>{tr.checkEmailSub2}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSendLink}
                  disabled={loading}
                  className="btn-ghost w-full text-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {tr.resend}
                </button>
                <button type="button" onClick={() => { clearErrors(); setStep('signin'); }} className="btn-ghost w-full text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  {tr.signIn}
                </button>
              </div>
            )}

            {/* ── Set new password (after clicking email link) ── */}
            {step === 'reset' && (
              <form onSubmit={handleReset} className="space-y-4">
                <Field label={tr.newPwdLabel}>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoFocus className="input-field pl-11 pr-11" placeholder="••••••••" />
                  <EyeToggle show={showPwd} onToggle={() => setShowPwd(!showPwd)} />
                </Field>
                <Field label={tr.confirmNewPwd}>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPwd ? 'text' : 'password'} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="input-field pl-11" placeholder="••••••••" />
                </Field>
                {error && <ErrorBox text={error} />}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {tr.updatePwd}
                </button>
              </form>
            )}

            {/* ── Password reset success ── */}
            {step === 'success' && (
              <div className="text-center py-2 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scale-in">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{tr.resetSuccessSub}</p>
                <button
                  onClick={() => {
                    clearErrors();
                    clearRecovery();
                    setStep('signin');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    navigate('login');
                  }}
                  className="btn-primary w-full"
                >
                  {tr.continueSignIn}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Switch between sign-in / sign-up */}
            {(step === 'signin' || step === 'signup') && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { clearErrors(); setStep(step === 'signin' ? 'signup' : 'signin'); }}
                  className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
                >
                  {step === 'signin' ? tr.noAccount : tr.haveAccount}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="relative">{children}</div>
    </div>
  );
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-fade-in-fast">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
}
