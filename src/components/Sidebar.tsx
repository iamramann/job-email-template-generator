import React from 'react';
import {
  LayoutDashboard,
  Mail,
  Briefcase,
  FileSearch,
  Sparkles,
  ChevronRight,
  Bot,
} from 'lucide-react';

export type Page = 'dashboard' | 'email-templates' | 'auto-apply' | 'resume-parser';

interface NavItem {
  id: Page;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'email-templates', label: 'Email Templates', icon: Mail, badge: 'AI' },
  { id: 'auto-apply', label: 'Auto Apply', icon: Briefcase, badge: 'AI' },
  { id: 'resume-parser', label: 'Resume Parser', icon: FileSearch, badge: 'AI' },
];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-950 flex flex-col z-20 border-r border-gray-800">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight tracking-tight">JobAI</h1>
            <p className="text-gray-500 text-xs leading-tight">Career Copilot</p>
          </div>
        </div>
      </div>

      {/* AI Badge */}
      <div className="mx-4 mt-5 mb-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-800/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-violet-300 text-xs font-medium">AI-Powered Platform</span>
        </div>
        <p className="text-gray-500 text-xs mt-1 leading-snug">Automate your entire job search</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 py-2">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-700/40 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-900/50'
                  : 'bg-gray-800 group-hover:bg-gray-700'
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
              </div>
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-violet-500/30 text-violet-300' : 'bg-gray-800 text-gray-500'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-400" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm font-medium truncate">User</p>
            <p className="text-gray-500 text-xs truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
