import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Crown,
  FileSearch,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { Page } from '../components/Sidebar';
import UpgradeModal from '../components/UpgradeModal';
import { useUsage } from '../hooks/useUsage';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const STATIC_STATS = [
  {
    label: 'Emails Generated',
    key: 'emailsUsed' as const,
    suffix: '',
    placeholder: '—',
    icon: Mail,
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    textColor: 'text-violet-400',
    note: 'this month',
  },
  {
    label: 'AI JD Parses',
    key: 'parsesUsed' as const,
    suffix: '',
    placeholder: '—',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    textColor: 'text-emerald-400',
    note: 'this month',
  },
  {
    label: 'Jobs Applied',
    key: null,
    suffix: '',
    placeholder: 'Coming soon',
    icon: Briefcase,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    textColor: 'text-amber-400',
    note: 'auto-apply coming',
  },
  {
    label: 'Resume Score',
    key: null,
    suffix: '',
    placeholder: 'Coming soon',
    icon: FileSearch,
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    textColor: 'text-pink-400',
    note: 'parser coming',
  },
];

const quickActions = [
  {
    page: 'email-templates' as Page,
    title: 'Generate Email',
    desc: 'Create a tailored cold email with AI',
    icon: Mail,
    gradient: 'from-violet-600 to-indigo-600',
    shadow: 'shadow-violet-900/30',
    comingSoon: false,
  },
  {
    page: 'auto-apply' as Page,
    title: 'Job Search',
    desc: 'Browse live jobs from 1000+ boards',
    icon: Briefcase,
    gradient: 'from-emerald-600 to-teal-600',
    shadow: 'shadow-emerald-900/30',
    comingSoon: false,
  },
  {
    page: 'resume-parser' as Page,
    title: 'Parse Resume',
    desc: 'Upload and get AI-powered suggestions',
    icon: FileSearch,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-900/30',
    comingSoon: true,
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
        {STATIC_STATS.map((stat) => {
          const Icon = stat.icon;
          const value = stat.key ? usage[stat.key] : null;
          const isReal = stat.key !== null;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} ${stat.bg} p-5 flex flex-col gap-4 ${!isReal ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {isReal ? (
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.textColor}`}>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {stat.note}
                  </div>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-800 text-gray-500 border border-gray-700">Soon</span>
                )}
              </div>
              <div>
                <p className={`text-3xl font-bold leading-none ${isReal ? 'text-white' : 'text-gray-600'}`}>
                  {isReal ? (value ?? 0) : stat.placeholder}
                </p>
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
                  onClick={() => !action.comingSoon && onNavigate(action.page)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800 transition-all duration-200 group text-left shadow-sm ${action.comingSoon
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-gray-700 hover:bg-gray-800/80'
                    }`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${action.shadow}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm">{action.title}</p>
                      {action.comingSoon && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-800 text-gray-500 border border-gray-700">Soon</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
                  </div>
                  {!action.comingSoon && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />}
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

        {/* Right column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <h2 className="text-white font-semibold text-sm">Activity This Month</h2>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {usage.emailsUsed === 0 && usage.parsesUsed === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-gray-600 text-sm text-center">No activity yet.<br />Generate your first email to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {usage.parsesUsed > 0 && (
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">Completed <span className="text-white font-medium">{usage.parsesUsed} AI parse{usage.parsesUsed !== 1 ? 's' : ''}</span></p>
                      <p className="text-gray-600 text-xs mt-0.5">This month</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  </div>
                )}
                {usage.emailsUsed > 0 && (
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">Generated <span className="text-white font-medium">{usage.emailsUsed} email{usage.emailsUsed !== 1 ? 's' : ''}</span></p>
                      <p className="text-gray-600 text-xs mt-0.5">This month</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Weekly Goal */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Monthly Parse Goal</h3>
              <span className="text-gray-400 text-xs">{usage.parsesUsed} / {currentPlan.parseLimit}</span>
            </div>
            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${parsePercent >= 80 ? 'bg-gradient-to-r from-red-500 to-rose-500'
                  : parsePercent >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`}
                style={{ width: `${parsePercent}%` }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {parsesLeft > 0
                ? `${parsesLeft} parses remaining this month`
                : 'Monthly limit reached — upgrade or switch to BYOK'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
