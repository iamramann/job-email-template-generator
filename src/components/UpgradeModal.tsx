import { CheckCircle2, Crown, Sparkles, X, Zap } from 'lucide-react';
import { PLANS, UsagePlan } from '../hooks/useUsage';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason?: string;
}

const PRO_FEATURES = [
  '200 AI JD parses / month — we pay the API',
  '500 email generations / month',
  'All AI providers (Gemini, ChatGPT, DeepSeek)',
  'Bulk auto-apply to jobs',
  'Resume AI suggestions',
  'Priority support',
];

const FREE_FEATURES = [
  '5 AI JD parses / month — we pay the API',
  '10 email generations / month',
  'Regex fallback (no API key needed)',
];

function PlanCard({ plan, isCurrent, onSelect }: { plan: UsagePlan; isCurrent: boolean; onSelect: () => void }) {
  const isPro = plan.id === 'pro';
  return (
    <div className={`relative rounded-2xl border p-5 flex flex-col gap-4 transition-all ${isPro
        ? 'border-violet-500/60 bg-violet-500/5 shadow-lg shadow-violet-900/20'
        : 'border-gray-700 bg-gray-800/50'
      }`}>
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            <Crown className="w-3 h-3" /> Most Popular
          </span>
        </div>
      )}
      <div>
        <p className="text-white font-bold text-base">{plan.label}</p>
        <p className={`text-2xl font-black mt-1 ${isPro ? 'text-violet-300' : 'text-gray-300'}`}>{plan.price}</p>
      </div>
      <ul className="space-y-2 flex-1">
        {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isPro ? 'text-violet-400' : 'text-gray-500'}`} />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={isCurrent && !isPro}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isPro
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-900/30'
            : isCurrent
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
      >
        {isCurrent && !isPro ? 'Current Plan' : isPro ? 'Upgrade to Pro' : 'Stay Free'}
      </button>
    </div>
  );
}

const UpgradeModal = ({ open, onClose, onUpgrade, reason }: UpgradeModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-violet-900/60 to-indigo-900/40 border-b border-gray-800 px-6 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Upgrade to Pro — Managed Mode</p>
              <p className="text-gray-400 text-xs">No API key needed — we handle the AI for you</p>
            </div>
          </div>
          {reason && (
            <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <p className="text-amber-300 text-xs">{reason}</p>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === 'free'}
              onSelect={plan.id === 'pro' ? onUpgrade : onClose}
            />
          ))}
        </div>

        <div className="px-6 pb-5 space-y-2">
          <p className="text-center text-gray-600 text-xs">
            Demo only — no actual payment required in this MVP
          </p>
          <p className="text-center text-gray-700 text-xs">
            💡 Tip: Switch to <span className="text-violet-400 font-medium">BYOK mode</span> to use your own API key with no limits
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
