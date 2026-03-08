import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Suggestion {
  id: string;
  type: 'error' | 'warning' | 'success';
  category: string;
  text: string;
  impact: 'high' | 'medium' | 'low';
}

const mockSuggestions: Suggestion[] = [
  { id: '1', type: 'error', category: 'Summary', text: 'Add a professional summary section — it increases interview callbacks by 40%.', impact: 'high' },
  { id: '2', type: 'warning', category: 'Skills', text: 'Add quantified achievements (e.g., "Improved performance by 35%") to your work experience.', impact: 'high' },
  { id: '3', type: 'warning', category: 'Keywords', text: 'Missing ATS keywords: "CI/CD", "Docker", "Agile", "REST API". Add them to increase match rate.', impact: 'high' },
  { id: '4', type: 'success', category: 'Education', text: 'Education section is well-formatted and clearly presented.', impact: 'low' },
  { id: '5', type: 'warning', category: 'Experience', text: 'Use action verbs to start bullet points: "Led", "Built", "Optimized", "Deployed".', impact: 'medium' },
  { id: '6', type: 'error', category: 'Contact', text: 'LinkedIn URL is missing. Add it to improve recruiter trust.', impact: 'medium' },
  { id: '7', type: 'success', category: 'Format', text: 'Clean, single-column layout — ATS-friendly.', impact: 'low' },
  { id: '8', type: 'warning', category: 'Length', text: 'Resume is 3 pages. Trim to 1–2 pages for better readability.', impact: 'medium' },
];

const mockResumeData = {
  name: 'Alex Johnson',
  title: 'Full Stack Developer',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  score: 78,
  experience: [
    { role: 'Senior Frontend Developer', company: 'TechCorp Inc.', period: '2021 – Present' },
    { role: 'React Developer', company: 'StartupXYZ', period: '2019 – 2021' },
    { role: 'Junior Developer', company: 'WebAgency Co.', period: '2017 – 2019' },
  ],
  education: [
    { degree: 'B.Sc. Computer Science', school: 'State University', year: '2017' },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL', 'Redux', 'Tailwind'],
};

const impactColors: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const suggestionIcon = (type: Suggestion['type']) => {
  if (type === 'error') return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
  if (type === 'warning') return <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
  return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
};

const scoreColor = (score: number) => {
  if (score >= 85) return 'from-emerald-500 to-teal-500';
  if (score >= 65) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-rose-500';
};

const ResumeParser: React.FC = () => {
  const [stage, setStage] = useState<'upload' | 'parsed'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setTimeout(() => setStage('parsed'), 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const dismiss = (id: string) => setDismissed((prev) => new Set([...prev, id]));

  const visibleSuggestions = mockSuggestions.filter((s) => !dismissed.has(s.id));
  const errorCount = visibleSuggestions.filter((s) => s.type === 'error').length;
  const warningCount = visibleSuggestions.filter((s) => s.type === 'warning').length;
  const successCount = visibleSuggestions.filter((s) => s.type === 'success').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resume Parser</h1>
          <p className="text-gray-400 mt-1 text-sm">Upload your resume and get AI-powered improvement suggestions.</p>
        </div>
        {stage === 'parsed' && (
          <button
            onClick={() => { setStage('upload'); setFileName(''); setDismissed(new Set()); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload New
          </button>
        )}
      </div>

      {stage === 'upload' ? (
        <div className="space-y-6">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-5 py-20 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${isDragging
                ? 'border-violet-500 bg-violet-500/5'
                : 'border-gray-700 bg-gray-900 hover:border-violet-600/60 hover:bg-violet-500/5'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${isDragging ? 'bg-violet-500/20' : 'bg-gray-800'
              }`}>
              <Upload className={`w-9 h-9 transition-colors ${isDragging ? 'text-violet-400' : 'text-gray-500'}`} />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">
                {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-gray-500 text-sm mt-1">or click to browse — PDF, DOC, DOCX, TXT</p>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition-all">
              Choose File
            </button>
            {/* Decorative dots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-violet-500/20" />
              <div className="absolute top-12 right-16 w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
              <div className="absolute bottom-8 left-10 w-2 h-2 rounded-full bg-violet-500/20" />
              <div className="absolute bottom-14 left-20 w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: 'ATS Score', desc: 'Get a score showing how well your resume passes ATS filters', color: 'from-violet-500 to-indigo-600' },
              { icon: Lightbulb, title: 'AI Suggestions', desc: 'Actionable improvements ranked by impact on your job search', color: 'from-amber-500 to-orange-600' },
              { icon: TrendingUp, title: 'Keyword Match', desc: 'See which keywords recruiters look for and are missing', color: 'from-emerald-500 to-teal-600' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Parsed View */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Parsed Resume */}
          <div className="lg:col-span-3 space-y-4">
            {/* Score Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 34 * mockResumeData.score / 100} ${2 * Math.PI * 34}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{mockResumeData.score}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">Resume Score</p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {mockResumeData.score >= 85 ? 'Excellent' : mockResumeData.score >= 65 ? 'Good — room to improve' : 'Needs work'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle className="w-3 h-3" /> {errorCount} errors</span>
                    <span className="flex items-center gap-1 text-xs text-amber-400"><AlertCircle className="w-3 h-3" /> {warningCount} warnings</span>
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3" /> {successCount} good</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold">+14 possible</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${scoreColor(mockResumeData.score)} rounded-full transition-all duration-700`}
                  style={{ width: `${mockResumeData.score}%` }}
                />
              </div>
            </div>

            {/* Parsed Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-violet-400" />
                <h2 className="text-white font-semibold text-sm">Parsed Resume — {fileName}</h2>
              </div>

              {/* Personal Info */}
              <div className="flex items-start gap-4 pb-5 border-b border-gray-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {mockResumeData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{mockResumeData.name}</h3>
                  <p className="text-violet-400 text-sm">{mockResumeData.title}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>{mockResumeData.email}</span>
                    <span>{mockResumeData.phone}</span>
                    <span>{mockResumeData.location}</span>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Experience</p>
                </div>
                <div className="space-y-2">
                  {mockResumeData.experience.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-800/50">
                      <div>
                        <p className="text-white text-sm font-medium">{exp.role}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-gray-600 text-xs">{exp.period}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Education</p>
                </div>
                {mockResumeData.education.map((edu, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-800/50">
                    <div>
                      <p className="text-white text-sm font-medium">{edu.degree}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{edu.school}</p>
                    </div>
                    <span className="text-gray-600 text-xs">{edu.year}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Skills Detected</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockResumeData.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Suggestions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h2 className="text-white font-semibold text-sm">AI Suggestions</h2>
              <span className="ml-auto text-xs text-gray-500">{visibleSuggestions.length} remaining</span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Errors', count: errorCount, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                { label: 'Warnings', count: warningCount, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { label: 'Good', count: successCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-2.5 text-center`}>
                  <p className={`text-lg font-bold ${s.color}`}>{s.count}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Suggestion Cards */}
            <div className="space-y-2.5">
              {visibleSuggestions.map((s) => (
                <div
                  key={s.id}
                  className={`bg-gray-900 border rounded-xl p-4 transition-all ${s.type === 'error' ? 'border-red-900/50' :
                      s.type === 'warning' ? 'border-amber-900/50' : 'border-gray-800'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {suggestionIcon(s.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-400">{s.category}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${impactColors[s.impact]}`}>
                          {s.impact}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{s.text}</p>
                    </div>
                    <button
                      onClick={() => dismiss(s.id)}
                      className="text-gray-700 hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {visibleSuggestions.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl py-10 flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  <p className="text-gray-400 text-sm font-medium">All suggestions addressed!</p>
                </div>
              )}
            </div>

            {/* CTA */}
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition-all">
              <Star className="w-4 h-4" />
              Generate Optimized Resume
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeParser;
