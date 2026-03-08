import { useState } from 'react';
import Sidebar, { Page } from './components/Sidebar';
import AutoApply from './pages/AutoApply';
import Dashboard from './pages/Dashboard';
import EmailTemplates from './pages/EmailTemplates';
import ResumeParser from './pages/ResumeParser';

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

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
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;