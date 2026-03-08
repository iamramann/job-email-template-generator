import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Crown,
  FileSearch,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { Page } from '../components/Sidebar';
import UpgradeModal from '../components/UpgradeModal';
import { useUsage } from '../hooks/useUsage';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  {
    label: 'Emails Generated',
    value: '24',
    change: '+8 this week',
    up: true,
    icon: Mail,
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    textColor: 'text-violet-400',
  },
  {
    label: 'Jobs Applied',
    value: '12',
    change: '+3 this week',
    up: true,
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
  },
  {
    label: 'Resume Score',
    value: '78%',
    change: '+5 since last scan',
    up: true,
    icon: FileSearch,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    textColor: 'text-amber-400',
  },
  {
    label: 'Response Rate',
    value: '33%',
    change: '+2% this month',
    up: true,
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    textColor: 'text-pink-400',
  },
];

const recentActivity = [
  { icon: Mail, label: 'Email generated for', detail: 'Senior React Developer @ Stripe', time: '2h ago', done: true, color: 'text-violet-400' },
  { icon: Briefcase, label: 'Auto-applied to', detail: 'Full Stack Engineer @ Vercel', time: '5h ago', done: true, color: 'text-emerald-400' },
  { icon: FileSearch, label: 'Resume scanned —', detail: '3 suggestions ready', time: '1d ago', done: false, color: 'text-amber-400' },
  { icon: Mail, label: 'Email generated for', detail: 'Backend Engineer @ GitHub', time: '2d ago', done: true, color: 'text-violet-400' },
  { icon: Briefcase, label: 'Auto-applied to', detail: 'Software Engineer @ Linear', time: '2d ago', done: true, color: 'text-emerald-400' },
];

const quickActions = [
  {
    page: 'email-templates' as Page,
    title: 'Generate Email',
    desc: 'Create a tailored cold email with AI',
    icon: Mail,
    gradient: 'from-violet-600 to-indigo-600',
    shadow: 'shadow-violet-900/30',
  },
  {
    page: 'auto-apply' as Page,
    title: 'Auto Apply',
    desc: 'Find and apply to matching jobs',
    icon: Briefcase,
    gradient: 'from-emerald-600 to-teal-600',
    shadow: 'shadow-emerald-900/30',
  },
  {
    page: 'resume-parser' as Page,
    title: 'Parse Resume',
    desc: 'Upload and get AI-powered suggestions',
    icon: FileSearch,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-900/30',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { usage, currentPlan, parsesLeft, parsePercent, upgradeToPro, setMode } = useUsage();
  const isBYOK = usage.mode === 'byok';
  const [showUpgrade, setShowUpgrade] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => { upgradeToPro(); setShowUpgrade(false); }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting} 👋</h1>
          <p className="text-gray-400 mt-1 text-sm">Here's your job search overview for today.</p>
        </div>
        <div className="flex items-center gap-2">
          {usage.plan === 'pro' ? (
            <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 px-4 py-2 rounded-xl">
              <Crown className="w-4 h-4 text-violet-400" />
              <span className="text-violet-300 text-sm font-medium">Pro Plan</span>
            </div>
          ) : (
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/20 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">{parsesLeft} parses left</span>
            </button>
          )}
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 px-4 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">AI Ready</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} ${stat.bg} p-5 flex flex-col gap-4`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.textColor}`}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white leading-none">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-white font-semibold text-sm">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.page}
                  onClick={() => onNavigate(action.page)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/80 transition-all duration-200 group text-left shadow-sm`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${action.shadow}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{action.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Plan / Usage Card */}
          <div className={`rounded-2xl border p-5 ${usage.plan === 'pro'
            ? 'bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border-violet-800/30'
            : 'bg-gray-900 border-gray-800'
            }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {usage.plan === 'pro'
                  ? <Crown className="w-4 h-4 text-violet-400" />
                  : <Zap className="w-4 h-4 text-amber-400" />}
                <h3 className="text-white font-semibold text-sm">
                  {usage.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${isBYOK
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    : 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                  }`}>
                  {isBYOK ? 'BYOK' : 'Managed'}
                </span>
              </div>
              {usage.plan === 'free' && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <Crown className="w-3 h-3" /> Upgrade
                </button>
              )}
            </div>
            {usage.plan === 'free' ? (
              <div className="space-y-2">
                {isBYOK ? (
                  <p className="text-blue-300 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    BYOK mode — no parse limits, you pay your AI provider
                  </p>
                ) : (
                  <>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Managed parses this month</span>
                      <span>{usage.parsesUsed} / {currentPlan.parseLimit}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${parsePercent >= 80 ? 'bg-red-500' : parsePercent >= 50 ? 'bg-amber-500' : 'bg-violet-500'
                          }`}
                        style={{ width: `${parsePercent}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-xs">
                      {parsesLeft > 0 ? `${parsesLeft} parses remaining` : 'Limit reached — upgrade or switch to BYOK'}
                    </p>
                  </>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setMode(isBYOK ? 'managed' : 'byok')}
                    className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
                  >
                    Switch to {isBYOK ? 'Managed' : 'BYOK'} mode
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">
                  {isBYOK ? 'BYOK — unlimited parses, all providers' : 'Managed — 200 parses/month · 500 emails'}
                </p>
                <button
                  onClick={() => setMode(isBYOK ? 'managed' : 'byok')}
                  className="text-xs text-gray-600 hover:text-gray-400 underline transition-colors"
                >
                  Switch to {isBYOK ? 'Managed' : 'BYOK'} mode
                </button>
              </div>
            )}
          </div>

          {/* AI Tips Card */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border border-violet-800/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-400" />
              <h3 className="text-white font-semibold text-sm">AI Tip of the Day</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Personalizing the first line of your cold email with a company-specific detail can increase response rates by up to <span className="text-violet-300 font-semibold">3×</span>.
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {recentActivity.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-4 px-5 py-4 ${idx !== recentActivity.length - 1 ? 'border-b border-gray-800' : ''
                    } hover:bg-gray-800/40 transition-colors`}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm truncate">
                      {activity.label}{' '}
                      <span className="text-white font-medium">{activity.detail}</span>
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{activity.time}</p>
                  </div>
                  {activity.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Weekly Goal</h3>
              <span className="text-gray-400 text-xs">12 / 20 applications</span>
            </div>
            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">60% complete — 8 more to hit your goal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
