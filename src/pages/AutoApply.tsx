import {
  AlertCircle,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdzunaJob,
  AdzunaSearchParams,
  extractTags,
  formatSalary,
  searchJobs,
  timeAgo,
} from '../utils/adzunaApi';

const LOGO_GRADIENTS = [
  'from-violet-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-pink-600 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-blue-600 to-cyan-600',
  'from-fuchsia-600 to-purple-600',
];

function logoGradient(company: string): string {
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = company.charCodeAt(i) + ((hash << 5) - hash);
  return LOGO_GRADIENTS[Math.abs(hash) % LOGO_GRADIENTS.length];
}

function contractLabel(time: string | null, type: string | null): string {
  const parts: string[] = [];
  if (time === 'full_time') parts.push('Full-time');
  else if (time === 'part_time') parts.push('Part-time');
  if (type === 'permanent') parts.push('Permanent');
  else if (type === 'contract') parts.push('Contract');
  return parts.length ? parts.join(' · ') : 'Not specified';
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Newest' },
  { value: 'salary', label: 'Salary' },
] as const;

const AutoApply: React.FC = () => {
  const [keyword, setKeyword] = useState('software engineer');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [fullTimeOnly, setFullTimeOnly] = useState(false);
  const [permanentOnly, setPermanentOnly] = useState(false);

  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const RESULTS_PER_PAGE = 12;

  const fetchJobs = useCallback(async (params: AdzunaSearchParams & { page: number }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchJobs(params);
      setJobs(result.jobs);
      setTotalCount(result.count);
      setHasSearched(true);
    } catch (err: any) {
      if (err?.message === 'RAPIDAPI_NOT_CONFIGURED') {
        setNotConfigured(true);
      } else {
        setError(err?.message ?? 'Failed to fetch jobs');
      }
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const runSearch = useCallback((pg = 1) => {
    setPage(pg);
    fetchJobs({
      what: keyword.trim() || 'software engineer',
      where: location.trim() || undefined,
      sort_by: sortBy,
      full_time: fullTimeOnly || undefined,
      permanent: permanentOnly || undefined,
      results_per_page: RESULTS_PER_PAGE,
      page: pg,
    });
  }, [keyword, location, sortBy, fullTimeOnly, permanentOnly, fetchJobs]);

  useEffect(() => {
    runSearch(1);
  }, []);

  const handleSearchInput = (val: string) => {
    setKeyword(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(1), 600);
  };

  const totalPages = Math.ceil(Math.min(totalCount, 500) / RESULTS_PER_PAGE);

  if (notConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Search</h1>
          <p className="text-gray-400 mt-1 text-sm">Real-time jobs powered by RapidAPI JSearch.</p>
        </div>
        <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">RapidAPI key not configured</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md leading-relaxed">
              Add your RapidAPI key to <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded text-xs">.env</code> to enable live job search.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-left w-full max-w-md space-y-1.5">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Steps</p>
            <p className="text-gray-300 text-sm">1. Sign up at <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">rapidapi.com</a> and subscribe to <span className="text-violet-300">JSearch</span></p>
            <p className="text-gray-300 text-sm">2. Copy your <code className="text-violet-300">X-RapidAPI-Key</code> from the API dashboard</p>
            <p className="text-gray-300 text-sm">3. Add to your <code className="text-violet-300">.env</code> file:</p>
            <div className="bg-gray-900 rounded-lg px-4 py-3 mt-2 font-mono text-xs text-emerald-400">
              <p>VITE_RAPIDAPI_KEY=your_key_here</p>
            </div>
            <p className="text-gray-300 text-sm">4. Restart the dev server</p>
          </div>
          <p className="text-gray-600 text-xs">Free tier: 200 requests/month · aggregates LinkedIn, Indeed, Glassdoor &amp; more</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Search</h1>
          <p className="text-gray-400 mt-1 text-sm">Live job listings powered by <span className="text-violet-400 font-medium">RapidAPI JSearch</span> — {totalCount > 0 ? `${totalCount.toLocaleString()} results` : 'search to discover opportunities'}.</p>
        </div>
        <button
          onClick={() => runSearch(1)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Job title, keyword, or company..."
            value={keyword}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(1)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>
        <div className="relative sm:w-52">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="City or leave blank..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(1)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>
        <button
          onClick={() => runSearch(1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition-all"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters
            ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Filters</p>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Sort by</span>
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); runSearch(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === opt.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fullTimeOnly}
              onChange={(e) => { setFullTimeOnly(e.target.checked); runSearch(1); }}
              className="accent-violet-500"
            />
            <span className="text-gray-400 text-sm">Full-time only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={permanentOnly}
              onChange={(e) => { setPermanentOnly(e.target.checked); runSearch(1); }}
              className="accent-violet-500"
            />
            <span className="text-gray-400 text-sm">Permanent only</span>
          </label>
          {(fullTimeOnly || permanentOnly || location) && (
            <button
              onClick={() => { setFullTimeOnly(false); setPermanentOnly(false); setLocation(''); runSearch(1); }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors ml-auto"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      )}

      {/* Stats bar */}
      {hasSearched && !loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Results Found', value: totalCount.toLocaleString(), color: 'text-white', bg: 'bg-gray-800', border: 'border-gray-700' },
            { label: 'This Page', value: jobs.length, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
            { label: 'Page', value: `${page} / ${totalPages || 1}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl px-5 py-4 flex items-center justify-between`}>
              <p className="text-gray-400 text-sm">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-3 bg-gray-800 rounded w-16" />
                    <div className="h-3 bg-gray-800 rounded w-20" />
                    <div className="h-3 bg-gray-800 rounded w-14" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-300 font-semibold text-sm">Error fetching jobs</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
          <button onClick={() => runSearch(page)} className="text-red-400 hover:text-red-300 text-xs underline">Retry</button>
        </div>
      )}

      {/* Job Cards Grid */}
      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const tags = extractTags(job.description, job.title);
            const initials = job.company.slice(0, 2).toUpperCase();
            const gradient = logoGradient(job.company);
            const salary = formatSalary(job.salary_min, job.salary_max);
            const contract = contractLabel(job.contract_time, job.contract_type);
            const posted = timeAgo(job.created);

            return (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-sm leading-snug">{job.title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-gray-500 flex-shrink-0" />
                          <p className="text-gray-400 text-xs truncate">{job.company}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-lg border flex-shrink-0 text-violet-400 bg-violet-500/10 border-violet-500/25">
                        {job.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {contract}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {posted}
                      </span>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {tags.map((tag) => (
                          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {job.description && (
                      <p className="text-gray-600 text-xs mt-3 line-clamp-2 leading-relaxed">{job.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on Adzuna
                  </a>
                  <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-violet-900/30"
                  >
                    <Sparkles className="w-3 h-3" />
                    Apply Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && hasSearched && jobs.length === 0 && !error && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl py-16 flex flex-col items-center gap-3">
          <Briefcase className="w-10 h-10 text-gray-700" />
          <p className="text-gray-500 text-sm">No jobs found for "{keyword}"</p>
          <button onClick={() => { setKeyword('software engineer'); runSearch(1); }} className="text-violet-400 text-sm hover:underline">
            Reset search
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => runSearch(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-400 text-sm font-medium hover:border-gray-600 hover:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={pg}
                  onClick={() => runSearch(pg)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${pg === page
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                    : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  {pg}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => runSearch(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-400 text-sm font-medium hover:border-gray-600 hover:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Powered by notice */}
      <div className="flex items-center gap-3 bg-indigo-900/20 border border-indigo-800/30 rounded-2xl px-5 py-4">
        <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <p className="text-indigo-300 text-sm">
          <span className="font-semibold">Powered by JSearch (RapidAPI) — </span>
          <span className="text-indigo-400">Real-time job listings from LinkedIn, Indeed, Glassdoor and more via Google for Jobs.</span>
        </p>
        <a
          href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch"
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex items-center gap-1 text-indigo-400 text-sm font-medium hover:text-indigo-300 whitespace-nowrap"
        >
          API Docs <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default AutoApply;
