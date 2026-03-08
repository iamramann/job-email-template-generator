import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Crown,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Sparkles,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FieldEditor } from '../components/FieldEditor';
import { TemplatePreview } from '../components/TemplatePreview';
import UpgradeModal from '../components/UpgradeModal';
import { defaultTemplates } from '../data/templates';
import { useUsage } from '../hooks/useUsage';
import { FieldValues, Template } from '../types/template';
import { AIProvider, ParsedJD, parseJobDescription, parseWithDeepSeek, parseWithGemini, parseWithOpenAI } from '../utils/jdParser';
import { TemplateProcessor } from '../utils/templateProcessor';

type ParseState = 'idle' | 'parsing' | 'done' | 'error';

const ENV_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ENV_OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const ENV_DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined;

const PROVIDERS: { id: AIProvider; label: string; model: string; color: string; placeholder: string; docsUrl: string }[] = [
  { id: 'gemini', label: 'Gemini', model: 'gemini-2.0-flash-lite', color: 'text-blue-400', placeholder: 'AIza...', docsUrl: 'https://aistudio.google.com/app/apikey' },
  { id: 'openai', label: 'ChatGPT', model: 'gpt-4o-mini', color: 'text-emerald-400', placeholder: 'sk-...', docsUrl: 'https://platform.openai.com/api-keys' },
  { id: 'deepseek', label: 'DeepSeek', model: 'deepseek-chat', color: 'text-violet-400', placeholder: 'sk-...', docsUrl: 'https://platform.deepseek.com/api_keys' },
];

function resolveEnvKey(provider: AIProvider): string {
  const map: Record<AIProvider, string | undefined> = {
    gemini: ENV_GEMINI_KEY,
    openai: ENV_OPENAI_KEY,
    deepseek: ENV_DEEPSEEK_KEY,
  };
  const val = map[provider];
  return val && !val.includes('your_') ? val : '';
}

const EmailTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [processedContent, setProcessedContent] = useState<string>('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const { usage, currentPlan, canParse, parsesLeft, parsePercent, incrementParses, upgradeToPro, setMode } = useUsage();
  const isBYOK = usage.mode === 'byok';

  // JD Parser state
  const [jdText, setJdText] = useState('');
  const [parseState, setParseState] = useState<ParseState>('idle');
  const [parsedJD, setParsedJD] = useState<ParsedJD | null>(null);
  const [parseError, setParseError] = useState('');
  const [jdPanelOpen, setJdPanelOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Provider + API key state
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    gemini: resolveEnvKey('gemini'),
    openai: resolveEnvKey('openai'),
    deepseek: resolveEnvKey('deepseek'),
  });
  const [showKey, setShowKey] = useState(false);
  const [keyPanelOpen, setKeyPanelOpen] = useState(!resolveEnvKey('gemini'));

  const activeKey = apiKeys[provider];

  useEffect(() => {
    if (selectedTemplate) {
      const initialValues: FieldValues = {};
      selectedTemplate.fields.forEach((field) => {
        initialValues[field.key] = field.type === 'array' ? [''] : '';
      });
      setFieldValues(initialValues);
      // Re-apply parsed JD if one exists
      if (parsedJD) applyParsedJD(parsedJD, initialValues);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate) {
      const processed = TemplateProcessor.process(selectedTemplate.content, fieldValues);
      setProcessedContent(processed);
    }
  }, [selectedTemplate, fieldValues]);

  const applyParsedJD = (jd: ParsedJD, base?: FieldValues) => {
    const current = base ?? { ...fieldValues };
    const updated: FieldValues = { ...current };

    const map: Record<string, string> = {
      companyName: jd.companyName,
      jobPosition: jd.jobPosition,
      recipient: jd.recipient,
      subject: jd.subject,
      backendTechnologies: jd.backendTechnologies,
      frontendTechnology: jd.frontendTechnology,
    };

    Object.entries(map).forEach(([key, val]) => {
      if (val && key in updated) updated[key] = val;
    });

    setFieldValues(updated);
  };

  const handleParse = async () => {
    if (!jdText.trim()) return;

    // Paywall gate — only applies in Managed mode
    if (!isBYOK && !canParse) {
      setUpgradeReason(`You've used all ${currentPlan.parseLimit} managed parses this month. Upgrade to Pro for 200/month, or switch to BYOK mode to use your own key with no limits.`);
      setShowUpgrade(true);
      return;
    }

    setParseState('parsing');
    setParseError('');
    try {
      let result: ParsedJD;
      if (activeKey) {
        if (provider === 'gemini') result = await parseWithGemini(jdText, activeKey);
        else if (provider === 'openai') result = await parseWithOpenAI(jdText, activeKey);
        else result = await parseWithDeepSeek(jdText, activeKey);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        result = parseJobDescription(jdText);
      }
      const hasData = result.companyName || result.jobPosition || result.keySkills.length > 0 || result.requirements.length > 0;
      if (!hasData) {
        setParseState('error');
        setParseError('Could not extract enough data. Try pasting a more complete job description.');
        return;
      }
      setParsedJD(result);
      setParseState('done');
      if (!isBYOK) incrementParses();
      if (!selectedTemplate) setSelectedTemplate(defaultTemplates[0]);
      applyParsedJD(result);
    } catch (err: unknown) {
      setParseState('error');
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('API_KEY_INVALID') || msg.includes('API key') || msg.includes('Incorrect API key') || msg.includes('401')) {
        setParseError(`Invalid ${PROVIDERS.find(p => p.id === provider)?.label} API key. Please check and try again.`);
      } else if (msg.includes('quota') || msg.includes('429') || msg.includes('rate limit')) {
        setParseError('API quota / rate limit exceeded. Try again later or switch provider.');
      } else {
        setParseError(`Parsing failed: ${msg}`);
      }
    }
  };

  const handleReset = () => {
    setJdText('');
    setParsedJD(null);
    setParseState('idle');
    setParseError('');
    textareaRef.current?.focus();
  };

  const handleAutoFill = () => {
    if (!parsedJD) return;
    if (!selectedTemplate) setSelectedTemplate(defaultTemplates[0]);
    applyParsedJD(parsedJD);
  };

  return (
    <div className="space-y-6">
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
        onUpgrade={() => { upgradeToPro(); setShowUpgrade(false); }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Templates</h1>
          <p className="text-gray-400 mt-1 text-sm">Paste a job description, let AI parse it, and generate your email instantly.</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Usage pill */}
          <button
            onClick={() => { setUpgradeReason(''); setShowUpgrade(true); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${usage.plan === 'pro'
              ? 'bg-violet-500/10 border-violet-500/20 text-violet-300'
              : parsesLeft <= 1
                ? 'bg-red-500/10 border-red-500/20 text-red-300 animate-pulse'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
          >
            {usage.plan === 'pro' ? <Crown className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            {usage.plan === 'pro' ? 'Pro Plan' : `${parsesLeft} parse${parsesLeft !== 1 ? 's' : ''} left`}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 transition-all">
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Usage bar — only show on free plan */}
      {usage.plan === 'free' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-gray-300 text-sm font-medium">Free Plan Usage</p>
            </div>
            <button
              onClick={() => { setUpgradeReason(''); setShowUpgrade(true); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Crown className="w-3 h-3" />
              Upgrade to Pro
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>AI Parses</span>
                <span>{usage.parsesUsed} / {currentPlan.parseLimit}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${parsePercent >= 80 ? 'bg-red-500' : parsePercent >= 50 ? 'bg-amber-500' : 'bg-violet-500'
                    }`}
                  style={{ width: `${parsePercent}%` }}
                />
              </div>
            </div>
            {parsesLeft === 0 && (
              <button
                onClick={() => { setUpgradeReason(`You've used all ${currentPlan.parseLimit} free parses this month.`); setShowUpgrade(true); }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors"
              >
                <Crown className="w-3 h-3" /> Upgrade
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── AI PROVIDER + KEY PANEL ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setKeyPanelOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors"
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isBYOK ? 'bg-blue-500/20' : 'bg-violet-500/20'
            }`}>
            <Key className={`w-3.5 h-3.5 ${isBYOK ? 'text-blue-400' : 'text-violet-400'}`} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-semibold text-sm">AI Provider</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {isBYOK
                ? activeKey
                  ? `BYOK — ${PROVIDERS.find(p => p.id === provider)?.label} key set, no usage limits`
                  : 'BYOK — paste your API key below'
                : 'Managed — we handle the API, usage is metered'}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${isBYOK
            ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            : 'text-violet-400 bg-violet-500/10 border-violet-500/20'
            }`}>
            {isBYOK ? 'BYOK' : 'Managed'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${keyPanelOpen ? 'rotate-180' : ''}`} />
        </button>

        {keyPanelOpen && (
          <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-4">
            {/* Mode toggle */}
            <div className="flex gap-2 p-1 bg-gray-800 rounded-xl">
              <button
                onClick={() => setMode('managed')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${!isBYOK
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-300'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Managed
              </button>
              <button
                onClick={() => setMode('byok')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${isBYOK
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-300'
                  }`}
              >
                <Key className="w-3.5 h-3.5" />
                BYOK
              </button>
            </div>

            {/* Mode description */}
            {isBYOK ? (
              <div className="flex items-start gap-2.5 bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
                <Key className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-xs leading-relaxed">
                  <span className="font-semibold">Bring Your Own Key</span> — paste your API key below. You pay your provider directly. <span className="text-blue-400 font-semibold">No usage limits.</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 bg-violet-500/5 border border-violet-500/15 rounded-xl px-4 py-3">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-violet-300 text-xs leading-relaxed">
                    <span className="font-semibold">Managed Mode</span> — we handle the API key. Free plan: {currentPlan.parseLimit} parses/month. <button onClick={() => setShowUpgrade(true)} className="underline hover:text-violet-200">Upgrade to Pro</button> for 200/month.
                  </p>
                </div>

                {/* Managed provider selector */}
                <div>
                  <p className="text-gray-500 text-xs mb-2 font-medium">Preferred AI model</p>
                  <div className="flex gap-2">
                    {PROVIDERS.filter(p => p.id !== 'deepseek').map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setProvider(p.id)}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-semibold transition-all ${provider === p.id
                            ? 'border-violet-500/60 bg-violet-500/10 text-white shadow-md shadow-violet-900/20'
                            : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                          }`}
                      >
                        <span className="text-base">{p.id === 'gemini' ? '✦' : '◈'}</span>
                        <span>{p.label}</span>
                        <span className="text-xs font-normal opacity-60">{p.model}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Provider tabs + key input — only shown in BYOK mode */}
            {isBYOK && (
              <>
                <div className="flex gap-2">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${provider === p.id
                        ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-900/30'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-300 hover:border-gray-600'
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {PROVIDERS.map((p) => p.id === provider && (
                  <div key={p.id} className="space-y-2">
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Get your {p.label} API key from{' '}
                      <a href={p.docsUrl} target="_blank" rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 underline">
                        {p.docsUrl.replace('https://', '')}
                      </a>
                      . You pay your provider directly — no limits here.
                    </p>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKeys[p.id]}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, [p.id]: e.target.value.trim() }))}
                        placeholder={p.placeholder}
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-600 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {apiKeys[p.id] && (
                      <p className="text-emerald-400 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {p.label} ({p.model}) — unlimited parses
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── JD PARSER PANEL ── */}
      <div className="bg-gray-900 border border-violet-800/40 rounded-2xl overflow-hidden">
        {/* Panel header */}
        <button
          onClick={() => setJdPanelOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-800/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-semibold text-sm">AI Job Description Parser</p>
            <p className="text-gray-500 text-xs mt-0.5">
              Paste any JD → AI extracts requirements and auto-fills your template
            </p>
          </div>
          {parsedJD && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Parsed
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${jdPanelOpen ? 'rotate-180' : ''}`} />
        </button>

        {jdPanelOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-800">
            {/* Textarea */}
            <div className="relative mt-4">
              <textarea
                ref={textareaRef}
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  if (parseState !== 'idle') setParseState('idle');
                }}
                placeholder={`Paste the full job description here...\n\nExample:\n  Software Engineer at Stripe\n  We are looking for a Senior React Developer...\n  Requirements:\n  • 3+ years of React experience\n  • Strong TypeScript skills\n  • Experience with Node.js`}
                rows={8}
                className="w-full bg-gray-800/60 border border-gray-700 text-gray-200 placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-none leading-relaxed"
              />
              {jdText && (
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 p-1 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-gray-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Parse button row */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleParse}
                disabled={!jdText.trim() || parseState === 'parsing'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {parseState === 'parsing' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Parsing...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Parse with AI</>
                )}
              </button>

              {parsedJD && (
                <button
                  onClick={handleAutoFill}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Auto-fill Template
                </button>
              )}

              {parsedJD && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-sm font-medium hover:bg-gray-700 hover:text-gray-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}

              {parseState === 'error' && (
                <div className="flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{parseError || "Couldn't extract data. Try pasting a more detailed JD."}</span>
                </div>
              )}
            </div>

            {/* Parsed Results */}
            {parsedJD && parseState === 'done' && (
              <div className="space-y-4 pt-1">
                {/* Extracted fields summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Company', value: parsedJD.companyName, icon: '🏢' },
                    { label: 'Position', value: parsedJD.jobPosition, icon: '💼' },
                    { label: 'Frontend Tech', value: parsedJD.frontendTechnology, icon: '🎨' },
                    { label: 'Backend Tech', value: parsedJD.backendTechnologies, icon: '⚙️' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
                      <span className="text-base leading-tight mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                        <p className="text-gray-200 text-sm font-medium truncate">
                          {item.value || <span className="text-gray-600 italic">Not detected</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI badge */}
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${activeKey
                    ? 'text-violet-300 bg-violet-500/10 border-violet-500/20'
                    : 'text-gray-400 bg-gray-800 border-gray-700'
                    }`}>
                    <Sparkles className="w-3 h-3" />
                    {activeKey ? `Parsed by ${PROVIDERS.find(p => p.id === provider)?.label} AI` : 'Parsed by Regex'}
                  </span>
                </div>

                {/* Key skills */}
                {parsedJD.keySkills.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Detected Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {parsedJD.keySkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {parsedJD.requirements.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      Requirements ({parsedJD.requirements.length})
                    </p>
                    <div className="space-y-1.5">
                      {parsedJD.requirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-snug">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject line preview */}
                {parsedJD.subject && (
                  <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-xl px-4 py-3">
                    <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">Generated Subject Line</p>
                    <p className="text-indigo-200 text-sm font-medium">{parsedJD.subject}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template Selector */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h2 className="text-white font-semibold text-sm">Choose a Template</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {defaultTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${selectedTemplate?.id === template.id
                ? 'border-violet-500/60 bg-violet-500/10 shadow-md shadow-violet-900/20'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedTemplate?.id === template.id
                ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                : 'bg-gray-700'
                }`}>
                <Mail className={`w-4 h-4 ${selectedTemplate?.id === template.id ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${selectedTemplate?.id === template.id ? 'text-white' : 'text-gray-300'}`}>
                  {template.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{template.fields.length} fields</p>
              </div>
            </button>
          ))}
          <button disabled className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-700 bg-transparent text-left opacity-50 cursor-not-allowed">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-800">
              <Plus className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-500">Cover Letter</p>
              <p className="text-gray-600 text-xs mt-0.5">Coming soon</p>
            </div>
          </button>
          <button disabled className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-gray-700 bg-transparent text-left opacity-50 cursor-not-allowed">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-800">
              <Plus className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-500">Follow-Up Email</p>
              <p className="text-gray-600 text-xs mt-0.5">Coming soon</p>
            </div>
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      {selectedTemplate ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Field Editor */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-white font-semibold text-sm">Fill in the Details</h2>
              </div>
              {parsedJD && (
                <button
                  onClick={handleAutoFill}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-500/25 transition-colors"
                >
                  <Wand2 className="w-3 h-3" />
                  Re-fill from JD
                </button>
              )}
            </div>
            <FieldEditor
              fields={selectedTemplate.fields}
              values={fieldValues}
              onChange={setFieldValues}
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-white font-semibold text-sm">Live Preview</h2>
            </div>
            <TemplatePreview
              content={processedContent}
              templateName={selectedTemplate.name}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl py-16 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
            <Mail className="w-7 h-7 text-gray-600" />
          </div>
          <div className="text-center">
            <h3 className="text-gray-300 font-semibold">Select a template above</h3>
            <p className="text-gray-600 text-sm mt-1">Or paste a job description to auto-fill everything</p>
          </div>
          <button
            onClick={() => setSelectedTemplate(defaultTemplates[0])}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailTemplates;
