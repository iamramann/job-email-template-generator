const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID as string;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY as string;
const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs';
const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com/search';

export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  contract_time: string | null;
  contract_type: string | null;
  redirect_url: string;
  description: string;
  created: string;
  category: string;
}

export interface AdzunaSearchParams {
  what?: string;
  where?: string;
  country?: string;
  page?: number;
  results_per_page?: number;
  sort_by?: 'relevance' | 'date' | 'salary';
  full_time?: boolean;
  part_time?: boolean;
  permanent?: boolean;
  contract?: boolean;
  salary_min?: number;
}

export interface AdzunaSearchResult {
  jobs: AdzunaJob[];
  count: number;
  page: number;
}

function formatSalary(min: number | null, max: number | null): string {
  const fmt = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}k`;
    return `$${n}`;
  };
  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Not specified';
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function extractTags(description: string, title: string): string[] {
  const techKeywords = [
    'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Java', 'Go',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'C#', 'C++', 'Rust', 'SQL', 'GraphQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Next.js', 'Vue', 'Angular',
    'Django', 'Flask', 'Spring', 'Rails', 'PostgreSQL', 'MongoDB', 'Redis',
    'REST', 'API', 'CI/CD', 'DevOps', 'Machine Learning', 'AI', 'Data Science',
  ];
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\#/]/g, '\\$&');
  const combined = `${title} ${description}`;
  const found = techKeywords.filter((kw) =>
    new RegExp(escapeRegex(kw), 'i').test(combined)
  );
  return found.slice(0, 4);
}

async function searchViaAdzuna(params: AdzunaSearchParams): Promise<AdzunaSearchResult> {
  const page = params.page ?? 1;
  const country = params.country ?? 'in';

  const qs = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: String(params.results_per_page ?? 12),
    'content-type': 'application/json',
  });

  if (params.what) qs.set('what', params.what);
  if (params.where) qs.set('where', params.where);
  if (params.sort_by) qs.set('sort_by', params.sort_by);
  if (params.salary_min) qs.set('salary_min', String(params.salary_min));
  if (params.full_time) qs.set('full_time', '1');
  if (params.part_time) qs.set('part_time', '1');
  if (params.permanent) qs.set('permanent', '1');
  if (params.contract) qs.set('contract', '1');

  const url = `${ADZUNA_BASE}/${country}/search/${page}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Adzuna error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const jobs: AdzunaJob[] = (data.results ?? []).map((r: any) => ({
    id: String(r.id),
    title: r.title ?? 'Untitled',
    company: r.company?.display_name ?? 'Unknown Company',
    location: r.location?.display_name ?? 'Unknown Location',
    salary_min: r.salary_min ?? null,
    salary_max: r.salary_max ?? null,
    contract_time: r.contract_time ?? null,
    contract_type: r.contract_type ?? null,
    redirect_url: r.redirect_url ?? '#',
    description: r.description ?? '',
    created: r.created ?? new Date().toISOString(),
    category: r.category?.label ?? 'Tech',
  }));

  return { jobs, count: data.count ?? 0, page };
}

async function searchViaJSearch(params: AdzunaSearchParams): Promise<AdzunaSearchResult> {
  const page = params.page ?? 1;

  const queryParts: string[] = [];
  if (params.what) queryParts.push(params.what);
  if (params.where) queryParts.push(`in ${params.where}`);
  const query = queryParts.join(' ') || 'software engineer';

  const qs = new URLSearchParams({
    query,
    page: String(page),
    num_pages: '1',
    date_posted: params.sort_by === 'date' ? 'today' : 'all',
  });
  if (params.full_time) qs.set('employment_types', 'FULLTIME');
  else if (params.part_time) qs.set('employment_types', 'PARTTIME');
  else if (params.contract) qs.set('employment_types', 'CONTRACTOR');

  const res = await fetch(`${JSEARCH_BASE}?${qs.toString()}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': RAPIDAPI_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RapidAPI JSearch error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const raw: any[] = data.data ?? [];

  const jobs: AdzunaJob[] = raw.map((r) => {
    const cityParts = [r.job_city, r.job_state, r.job_country].filter(Boolean);
    const location = r.job_is_remote ? 'Remote' : (cityParts.join(', ') || 'Unknown Location');
    const contractTime = r.job_employment_type === 'FULLTIME' ? 'full_time'
      : r.job_employment_type === 'PARTTIME' ? 'part_time' : null;
    const contractType = r.job_employment_type === 'CONTRACTOR' ? 'contract'
      : (r.job_employment_type === 'FULLTIME' || r.job_employment_type === 'PARTTIME') ? 'permanent' : null;

    return {
      id: r.job_id ?? String(Math.random()),
      title: r.job_title ?? 'Untitled',
      company: r.employer_name ?? 'Unknown Company',
      location,
      salary_min: r.job_min_salary ?? null,
      salary_max: r.job_max_salary ?? null,
      contract_time: contractTime,
      contract_type: contractType,
      redirect_url: r.job_apply_link ?? r.job_google_link ?? '#',
      description: r.job_description ?? '',
      created: r.job_posted_at_datetime_utc ?? new Date().toISOString(),
      category: r.job_highlights?.Qualifications?.[0]?.slice(0, 30) ?? 'Tech',
    };
  });

  const estimatedTotal = jobs.length >= 10 ? page * jobs.length + jobs.length : jobs.length;
  return { jobs, count: data.count ?? estimatedTotal, page };
}

export async function searchJobs(params: AdzunaSearchParams): Promise<AdzunaSearchResult> {
  const adzunaReady = ADZUNA_APP_ID && ADZUNA_APP_ID !== 'your_adzuna_app_id_here';
  const jsearchReady = RAPIDAPI_KEY && RAPIDAPI_KEY !== 'your_rapidapi_key_here';

  if (!adzunaReady && !jsearchReady) {
    throw new Error('RAPIDAPI_NOT_CONFIGURED');
  }

  if (adzunaReady) {
    try {
      return await searchViaAdzuna(params);
    } catch (err: any) {
      if (jsearchReady) {
        console.warn('Adzuna failed, falling back to JSearch:', err.message);
        return await searchViaJSearch(params);
      }
      throw err;
    }
  }

  return await searchViaJSearch(params);
}

export { extractTags, formatSalary, timeAgo };

