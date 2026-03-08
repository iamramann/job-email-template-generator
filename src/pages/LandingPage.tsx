import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Crown,
  FileSearch,
  Github,
  Mail,
  Sparkles,
  Twitter,
  Wand2,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const FEATURES = [
  {
    icon: Wand2,
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    title: 'AI Job Description Parser',
    desc: 'Paste any job posting and our AI instantly extracts company name, role, required skills, and key requirements — auto-filling your email template.',
  },
  {
    icon: Mail,
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'Smart Email Templates',
    desc: 'Professional cold email templates built for job seekers. Personalized per role with live preview, separate subject/body copy, and one-click download.',
  },
  {
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'Auto Apply (Coming Soon)',
    desc: 'Browse matching jobs and auto-apply in bulk. Track application status from a single dashboard without switching tabs.',
  },
  {
    icon: FileSearch,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: 'Resume AI Suggestions',
    desc: 'Upload your resume and get tailored suggestions to match job descriptions, improve your score, and stand out from the crowd.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste the Job Description',
    desc: 'Copy any job posting URL or paste the full description into the AI parser.',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
  },
  {
    step: '02',
    title: 'AI Extracts Key Details',
    desc: 'Gemini or ChatGPT pulls out company, role, tech stack, and requirements in seconds.',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  {
    step: '03',
    title: 'Auto-Fill & Send',
    desc: 'Fields are auto-populated in your email template. Copy subject + body separately and send.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started',
    features: [
      '5 AI parses / month',
      '10 email generations / month',
      'All email templates',
      'Regex fallback parsing',
      'Subject + body copy',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'For serious job seekers',
    features: [
      '200 AI parses / month',
      '500 email generations / month',
      'All AI providers (Gemini, ChatGPT)',
      'Bulk auto-apply to jobs',
      'Resume AI suggestions',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    name: 'BYOK',
    price: 'Free',
    period: 'bring your key',
    desc: 'Use your own API key',
    features: [
      'Unlimited AI parses',
      'Unlimited email generations',
      'Gemini, ChatGPT, DeepSeek',
      'All templates',
      'You pay your AI provider',
      'No subscription needed',
    ],
    cta: 'Use Your Own Key',
    highlight: false,
  },
];

const STATS = [
  { value: '10x', label: 'Faster applications' },
  { value: '3×', label: 'Higher response rate' },
  { value: '< 60s', label: 'From JD to email' },
  { value: '100%', label: 'Client-side private' },
];

function AnimatedCounter({ value }: { value: string }) {
  return <span>{value}</span>;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 40 ? 'bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">JobAI</span>
            <span className="text-gray-600 text-sm font-normal hidden sm:block">Career Copilot</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">How it works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
          </nav>
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-violet-900/30"
          >
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Job Application Copilot
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            Land your dream job{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              10× faster
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Paste a job description, let AI parse the requirements, and generate a perfectly tailored cold email — all in under 60 seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-violet-900/40 hover:shadow-violet-900/60 hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              Start for Free
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-semibold text-base transition-all"
            >
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <p className="text-gray-600 text-sm">No sign-up required · Free forever plan · BYOK option available</p>
        </div>

        {/* App preview card */}
        <div className="relative z-10 mt-16 w-full max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-black/60 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-950/80 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="flex-1 mx-4 h-6 bg-gray-800 rounded-md flex items-center px-3">
                <span className="text-gray-600 text-xs">jobai.app/dashboard</span>
              </div>
            </div>
            {/* App content preview */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Sidebar mockup */}
              <div className="col-span-1 space-y-2">
                <div className="h-8 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 rounded-xl border border-violet-700/30" />
                {['Dashboard', 'Email Templates', 'Auto Apply', 'Resume Parser'].map((item, i) => (
                  <div key={item} className={`h-9 rounded-xl flex items-center px-3 gap-2 ${i === 1 ? 'bg-violet-600/20 border border-violet-700/30' : 'bg-gray-800/50'}`}>
                    <div className={`w-4 h-4 rounded-md ${i === 1 ? 'bg-violet-500/60' : 'bg-gray-700'}`} />
                    <div className={`h-2 rounded-full ${i === 1 ? 'bg-gray-300 w-24' : 'bg-gray-700 w-20'}`} />
                  </div>
                ))}
              </div>
              {/* Main content mockup */}
              <div className="col-span-2 space-y-3">
                <div className="h-8 bg-gray-800/60 rounded-xl w-48" />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { color: 'from-violet-500/20 to-indigo-500/20', border: 'border-violet-500/20' },
                    { color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20' },
                  ].map((card, i) => (
                    <div key={i} className={`h-20 rounded-xl bg-gradient-to-br ${card.color} border ${card.border}`} />
                  ))}
                </div>
                <div className="h-28 bg-gray-800/60 rounded-xl border border-gray-700/50" />
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-800/60 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-violet-600/20 blur-3xl rounded-full" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-gray-800/60 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black">Everything you need to<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">get hired faster</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">One platform to parse job descriptions, generate emails, track applications, and optimize your resume.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={`group relative rounded-2xl border ${f.border} ${f.bg} p-6 hover:scale-[1.01] transition-all duration-300`}>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-900/30 border-y border-gray-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> How it works
            </div>
            <h2 className="text-4xl sm:text-5xl font-black">
              From job posting to<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">sent email in 60 seconds</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(50%-1px)] w-0.5 h-full bg-gradient-to-b from-violet-500/30 via-blue-500/30 to-emerald-500/30" />

            <div className="space-y-8">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.step} className={`flex items-start gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`relative flex-shrink-0 w-20 h-20 rounded-2xl border ${step.border} bg-gray-900 flex items-center justify-center`}>
                    <span className={`text-2xl font-black ${step.color}`}>{step.step}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Crown className="w-3 h-3" /> Pricing
            </div>
            <h2 className="text-4xl sm:text-5xl font-black">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 text-lg">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 flex flex-col gap-5 transition-all ${
                  plan.highlight
                    ? 'border-violet-500/60 bg-gradient-to-b from-violet-900/20 to-gray-900 shadow-2xl shadow-violet-900/20 scale-[1.02]'
                    : 'border-gray-800 bg-gray-900/60'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      <Crown className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm font-medium">{plan.name}</p>
                  <div className="flex items-end gap-1 mt-1">
                    <span className={`text-4xl font-black ${plan.highlight ? 'text-violet-300' : 'text-white'}`}>{plan.price}</span>
                    <span className="text-gray-500 text-sm mb-1">/ {plan.period}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-violet-400' : 'text-gray-600'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onEnterApp}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="relative rounded-3xl border border-violet-700/40 bg-gradient-to-br from-violet-900/30 via-gray-900 to-indigo-900/20 p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_70%)]" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-900/50">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black">
                Ready to supercharge<br />your job search?
              </h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Join job seekers who are already using AI to get more responses and land interviews faster.
              </p>
              <button
                onClick={onEnterApp}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-violet-900/40 hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4" />
                Launch JobAI Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-gray-600 text-sm">No account needed · Free forever plan available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-sm">JobAI</span>
            <span className="text-gray-600 text-sm">— Career Copilot MVP</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <span>Built with ♥ and AI</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
          <p className="text-gray-700 text-xs">© 2026 JobAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
