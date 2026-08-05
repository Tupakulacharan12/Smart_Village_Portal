import { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useHashRoute } from '@/hooks/useHashRoute';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';

import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Schemes } from '@/pages/Schemes';
import { News } from '@/pages/News';
import { Notices } from '@/pages/Notices';
import { Complaints } from '@/pages/Complaints';
import { Health } from '@/pages/Health';
import { Education } from '@/pages/Education';
import { Agriculture } from '@/pages/Agriculture';
import { Emergency } from '@/pages/Emergency';
import { Services } from '@/pages/Services';
import { WasteManagement } from '@/pages/WasteManagement';
import { Gallery } from '@/pages/Gallery';
import { Tourist } from '@/pages/Tourist';
import { Contact } from '@/pages/Contact';
import { SearchPage } from '@/pages/Search';
import { ExamsHub } from '@/pages/ExamsHub';
import { ExamDetail } from '@/pages/ExamDetail';
import { ProgressDashboard } from '@/pages/ExamDashboard';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { LoginPage } from '@/pages/LoginPage';

function AppContent() {
  const [route, navigate] = useHashRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const { session, loading: authLoading } = useAuth();

  const showAdmin = route === 'admin';
  const showLogin = route === 'login' || route === 'reset-password';
  const isAdmin = !!session;
  const examMatch = route.match(/^exam\/(.+)$/);
  const examSlug = examMatch ? examMatch[1] : null;

  // For navbar active state — exam pages highlight Education
  const navRoute = route.startsWith('exam') ? 'education' : route;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar route={navRoute} navigate={navigate} onSearch={setSearchQuery} />

      <main className="flex-1">
        {showAdmin ? (
          authLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : isAdmin ? (
            <AdminDashboard navigate={navigate} />
          ) : (
            <AdminLogin navigate={navigate} />
          )
        ) : showLogin ? (
          <LoginPage navigate={navigate} />
        ) : route === 'search' ? (
          <SearchPage navigate={navigate} query={searchQuery} />
        ) : examSlug ? (
          <ExamDetail examSlug={examSlug} navigate={navigate} />
        ) : (
          <>
            {route === 'home' && <Home navigate={navigate} />}
            {route === 'about' && <About />}
            {route === 'schemes' && <Schemes />}
            {route === 'news' && <News />}
            {route === 'notices' && <Notices />}
            {route === 'complaints' && <Complaints />}
            {route === 'health' && <Health />}
            {route === 'education' && <Education navigate={navigate} />}
            {route === 'exams' && <ExamsHub navigate={navigate} />}
            {route === 'exam-dashboard' && <ProgressDashboard navigate={navigate} />}
            {route === 'agriculture' && <Agriculture />}
            {route === 'emergency' && <Emergency />}
            {route === 'services' && <Services />}
            {route === 'waste' && <WasteManagement />}
            {route === 'gallery' && <Gallery />}
            {route === 'tourist' && <Tourist />}
            {route === 'contact' && <Contact />}
            {!['home','about','schemes','news','notices','complaints','health','education','exams','exam-dashboard','agriculture','emergency','services','waste','gallery','tourist','contact','login'].includes(route) && <Home navigate={navigate} />}
          </>
        )}
      </main>

      {!showAdmin && !showLogin && <Footer navigate={navigate} />}
      <Chatbot navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
