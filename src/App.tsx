import { Bot, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar, { Page } from './components/Sidebar';
import AutoApply from './pages/AutoApply';
import Dashboard from './pages/Dashboard';
import EmailTemplates from './pages/EmailTemplates';
import LandingPage from './pages/LandingPage';
import ResumeParser from './pages/ResumeParser';

function AppLoader({ onDone, steps = ['Initialising AI engine...', 'Loading templates...', 'Ready to launch ✨'] }: { onDone: () => void; steps?: string[] }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => { setProgress(40); setStep(1); }, 400),
      setTimeout(() => { setProgress(75); setStep(2); }, 900),
      setTimeout(() => { setProgress(100); }, 1300),
      setTimeout(() => onDone(), 1750),
    ];
    return () => intervals.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-72">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/60 animate-pulse">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">JobAI</h1>
          <p className="text-gray-500 text-sm mt-1">Career Copilot</p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-3">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs text-center transition-all duration-300">{steps[step]}</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [returningHome, setReturningHome] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const handleEnterApp = () => {
    setShowLanding(false);
    setLoading(true);
  };

  const handleGoHome = () => {
    setReturningHome(true);
  };

  if (returningHome) {
    return (
      <AppLoader
        onDone={() => { setReturningHome(false); setShowLanding(true); }}
        steps={['Saving your progress...', 'Returning to home...', 'See you soon 👋']}
      />
    );
  }

  if (showLanding) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  if (loading) {
    return <AppLoader onDone={() => setLoading(false)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'email-templates':
        return <EmailTemplates />;
      case 'auto-apply':
        return <AutoApply />;
      case 'resume-parser':
        return <ResumeParser />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} onHome={handleGoHome} />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;