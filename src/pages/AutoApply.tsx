import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  XCircle,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';

type ApplyStatus = 'idle' | 'applying' | 'applied' | 'failed';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  match: number;
  tags: string[];
  logo: string;
  status: ApplyStatus;
}

const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'Stripe',
    location: 'Remote',
    salary: '$130k – $170k',
    type: 'Full-time',
    posted: '2h ago',
    match: 94,
    tags: ['React', 'TypeScript', 'Node.js'],
    logo: 'S',
    status: 'idle',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'Vercel',
    location: 'Remote',
    salary: '$120k – $155k',
    type: 'Full-time',
    posted: '5h ago',
    match: 88,
    tags: ['Next.js', 'React', 'Go'],
    logo: 'V',
    status: 'applied',
  },
  {
    id: '3',
    title: 'Frontend Engineer',
    company: 'Linear',
    location: 'San Francisco, CA',
    salary: '$115k – $145k',
    type: 'Full-time',
    posted: '1d ago',
    match: 85,
    tags: ['React', 'GraphQL', 'CSS'],
    logo: 'L',
    status: 'idle',
  },
  {
    id: '4',
    title: 'Software Engineer II',
    company: 'GitHub',
    location: 'Remote',
    salary: '$140k – $180k',
    type: 'Full-time',
    posted: '2d ago',
    match: 80,
    tags: ['Ruby', 'React', 'TypeScript'],
    logo: 'G',
    status: 'failed',
  },
  {
    id: '5',
    title: 'React Native Developer',
    company: 'Notion',
    location: 'New York, NY',
    salary: '$110k – $140k',
    type: 'Full-time',
    posted: '3d ago',
    match: 77,
    tags: ['React Native', 'TypeScript', 'Redux'],
    logo: 'N',
    status: 'idle',
  },
  {
    id: '6',
    title: 'Frontend Infrastructure Engineer',
    company: 'Figma',
    location: 'Remote',
    salary: '$150k – $190k',
    type: 'Full-time',
    posted: '3d ago',
    match: 75,
    tags: ['Webpack', 'React', 'Performance'],
    logo: 'F',
    status: 'idle',
  },
];

const logoColors: Record<string, string> = {
  S: 'bg-violet-600',
  V: 'bg-gray-900',
  L: 'bg-indigo-600',
  G: 'bg-gray-700',
  N: 'bg-gray-800',
  F: 'bg-pink-600',
};

const matchColor = (score: number) => {
  if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
  if (score >= 80) return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
  return 'text-gray-400 bg-gray-500/10 border-gray-500/25';
};

const AutoApply: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'applied' | 'pending'>('all');

  const handleApply = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'applying' } : j))
    );
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: 'applied' } : j))
      );
    }, 1800);
  };

  const handleApplyAll = () => {
    const idleIds = jobs.filter((j) => j.status === 'idle').map((j) => j.id);
    idleIds.forEach((id, idx) => {
      setTimeout(() => {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: 'applying' } : j))
        );
        setTimeout(() => {
          setJobs((prev) =>
            prev.map((j) => (j.id === id ? { ...j, status: 'applied' } : j))
          );
        }, 1500);
      }, idx * 600);
    });
  };

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'applied'
          ? j.status === 'applied'
          : j.status === 'idle' || j.status === 'applying';
    return matchesSearch && matchesFilter;
  });

  const appliedCount = jobs.filter((j) => j.status === 'applied').length;
  const idleCount = jobs.filter((j) => j.status === 'idle').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Auto Apply</h1>
          <p className="text-gray-400 mt-1 text-sm">AI matches and applies to jobs on your behalf.</p>
        </div>
        <button
          onClick={handleApplyAll}
          disabled={idleCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          Apply to All ({idleCount})
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Matches', value: jobs.length, color: 'text-white', bg: 'bg-gray-800', border: 'border-gray-700' },
          { label: 'Applied', value: appliedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Pending', value: idleCount, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-5 py-4 flex items-center justify-between`}>
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search jobs or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'applied', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${filter === f
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
            >
              {f}
            </button>
          ))}
          <button className="px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className={`w-12 h-12 rounded-xl ${logoColors[job.logo] || 'bg-gray-700'} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {job.logo}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{job.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <p className="text-gray-400 text-xs">{job.company}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg border flex-shrink-0 ${matchColor(job.match)}`}>
                    {job.match}% match
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.posted}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                View Job
              </button>

              {job.status === 'idle' && (
                <button
                  onClick={() => handleApply(job.id)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-violet-900/30"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto Apply
                </button>
              )}
              {job.status === 'applying' && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Applying...
                </div>
              )}
              {job.status === 'applied' && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Applied
                </div>
              )}
              {job.status === 'failed' && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
                  <XCircle className="w-3 h-3" />
                  Failed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl py-16 flex flex-col items-center gap-3">
          <Briefcase className="w-10 h-10 text-gray-700" />
          <p className="text-gray-500 text-sm">No jobs match your search</p>
          <button onClick={() => { setSearch(''); setFilter('all'); }} className="text-violet-400 text-sm hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {/* Coming Soon Banner */}
      <div className="flex items-start gap-4 bg-amber-500/8 border border-amber-500/25 rounded-2xl px-5 py-4">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-amber-300 font-semibold text-sm">Coming Soon — Auto Apply</p>
          <p className="text-amber-400/70 text-xs mt-0.5 leading-relaxed">
            This feature is currently in development. The job listings below are demo data. Real job search and one-click apply are on the roadmap.
          </p>
        </div>
        <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">In Progress</span>
      </div>

      {/* AI Notice */}
      <div className="flex items-center gap-3 bg-indigo-900/20 border border-indigo-800/30 rounded-2xl px-5 py-4">
        <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <p className="text-indigo-300 text-sm">
          <span className="font-semibold">AI Matching Active — </span>
          <span className="text-indigo-400">Jobs are ranked by match score based on your resume and preferences. Connect your accounts to enable auto-apply.</span>
        </p>
        <button className="ml-auto flex items-center gap-1 text-indigo-400 text-sm font-medium hover:text-indigo-300 whitespace-nowrap">
          Connect <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AutoApply;
