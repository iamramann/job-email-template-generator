import { GoogleGenerativeAI } from '@google/generative-ai';

export type AIProvider = 'gemini' | 'openai' | 'deepseek';

export interface ParsedJD {
  companyName: string;
  jobPosition: string;
  recipient: string;
  subject: string;
  backendTechnologies: string;
  frontendTechnology: string;
  requirements: string[];
  keySkills: string[];
  experienceYears: string;
}

const SYSTEM_PROMPT = `You are an expert job description parser. Extract structured information from the job description the user provides.
Return ONLY a valid JSON object with exactly these fields (no markdown, no code fences, no explanation — raw JSON only):
{
  "companyName": "company name or empty string",
  "jobPosition": "exact job title or empty string",
  "recipient": "Hiring Manager",
  "frontendTechnology": "comma-separated frontend technologies (React, TypeScript, etc.) or empty string",
  "backendTechnologies": "comma-separated backend technologies (Node.js, Python, etc.) or empty string",
  "experienceYears": "e.g. 3 or 3-5 or empty string",
  "keySkills": ["skill1", "skill2"],
  "requirements": ["up to 8 key requirements as full sentences"],
  "subject": "Application for <jobPosition> at <companyName>"
}`;

const parseCache = new Map<string, ParsedJD>();

function buildCacheKey(provider: AIProvider, apiKey: string, jd: string) {
  return `${provider}:${apiKey.slice(-8)}:${jd.trim().slice(0, 200)}`;
}

function sanitizeJSON(raw: string): ParsedJD {
  const jsonStr = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const parsed = JSON.parse(jsonStr) as ParsedJD;
  return {
    companyName: parsed.companyName ?? '',
    jobPosition: parsed.jobPosition ?? '',
    recipient: parsed.recipient || 'Hiring Manager',
    subject: parsed.subject ?? '',
    frontendTechnology: parsed.frontendTechnology ?? '',
    backendTechnologies: parsed.backendTechnologies ?? '',
    experienceYears: parsed.experienceYears ?? '',
    keySkills: Array.isArray(parsed.keySkills) ? parsed.keySkills : [],
    requirements: Array.isArray(parsed.requirements) ? parsed.requirements.slice(0, 8) : [],
  };
}

const GEMINI_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
];

export async function parseWithGemini(jd: string, apiKey: string): Promise<ParsedJD> {
  const cacheKey = buildCacheKey('gemini', apiKey, jd);
  if (parseCache.has(cacheKey)) return parseCache.get(cacheKey)!;

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: Error = new Error('All Gemini models failed');

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });
      const response = await model.generateContent(jd);
      const result = sanitizeJSON(response.response.text().trim());
      parseCache.set(cacheKey, result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRetryable = msg.includes('429') || msg.includes('quota') || msg.includes('not found') || msg.includes('404');
      lastError = err instanceof Error ? err : new Error(msg);
      if (!isRetryable) throw lastError;
      // Try next model in chain
    }
  }

  throw lastError;
}

async function fetchChatCompletion(
  baseURL: string,
  apiKey: string,
  model: string,
  jd: string
): Promise<string> {
  const res = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: jd },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? '';
}

export async function parseWithOpenAI(jd: string, apiKey: string): Promise<ParsedJD> {
  const cacheKey = buildCacheKey('openai', apiKey, jd);
  if (parseCache.has(cacheKey)) return parseCache.get(cacheKey)!;

  const text = await fetchChatCompletion('https://api.openai.com/v1', apiKey, 'gpt-4o-mini', jd);
  const result = sanitizeJSON(text);
  parseCache.set(cacheKey, result);
  return result;
}

export async function parseWithDeepSeek(jd: string, apiKey: string): Promise<ParsedJD> {
  const cacheKey = buildCacheKey('deepseek', apiKey, jd);
  if (parseCache.has(cacheKey)) return parseCache.get(cacheKey)!;

  const text = await fetchChatCompletion('https://api.deepseek.com/v1', apiKey, 'deepseek-chat', jd);
  const result = sanitizeJSON(text);
  parseCache.set(cacheKey, result);
  return result;
}

const FRONTEND_TECHS = [
  'react', 'vue', 'angular', 'next.js', 'nextjs', 'nuxt', 'svelte',
  'typescript', 'javascript', 'html', 'css', 'tailwind', 'sass', 'scss',
  'webpack', 'vite', 'redux', 'graphql', 'jest', 'cypress', 'storybook',
];

const BACKEND_TECHS = [
  'node.js', 'nodejs', 'express', 'python', 'django', 'flask', 'fastapi',
  'java', 'spring', 'ruby', 'rails', 'go', 'golang', 'rust', 'php', 'laravel',
  'dotnet', '.net', 'c#', 'kotlin', 'scala', 'graphql', 'rest', 'grpc',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd',
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function extractCompany(text: string): string {
  const patterns = [
    /(?:at|@|join|joining)\s+([A-Z][a-zA-Z0-9\s&.,'-]{1,40}?)(?:\s+(?:as|is|are|we|our|the|to|and|in|for|,|\.|!|\n))/,
    /(?:company|employer|organization|organisation)\s*[:\-–]\s*([A-Z][a-zA-Z0-9\s&.,'-]{1,40}?)(?:\s*[\n,.])/i,
    /^([A-Z][a-zA-Z0-9\s&.,'-]{1,40}?)\s+(?:is hiring|is looking|seeks|is seeking|has an opening)/m,
    /(?:about\s+us|about\s+)([A-Z][a-zA-Z0-9\s&.,'-]{1,40}?)(?:\s*[\n,.])/i,
    /([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)*)\s+(?:Inc\.|LLC|Ltd\.|Corp\.|Technologies|Tech|Labs|Solutions|Software|Systems)/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return m[1].trim().replace(/[,.]$/, '');
  }
  return '';
}

function extractPosition(text: string): string {
  const patterns = [
    /(?:role|position|title|opening|vacancy|job title)\s*[:\-–]\s*(.+?)(?:\n|,|\.|$)/i,
    /(?:hiring|looking for|seeking|seeking a|need a|we need)\s+(?:a\s+|an\s+)?(.+?(?:engineer|developer|designer|manager|analyst|architect|lead|specialist|consultant|scientist))(?:\s*[\n,.]|$)/i,
    /^(?:senior|junior|mid|lead|staff|principal)?\s*(.+?(?:engineer|developer|designer|manager|analyst|architect|lead|specialist|consultant|scientist))\s*$/im,
    /(?:apply for|applied for|application for)\s+(?:the\s+)?(.+?(?:engineer|developer|designer|manager|analyst|architect))(?:\s*[\n,.])/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return m[1].trim().replace(/[,.]$/, '');
  }
  return '';
}

function extractExperience(text: string): string {
  const patterns = [
    /(\d+)\+?\s*[-–to]+\s*(\d+)\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
    /(?:experience|exp)\s*[:\-–]\s*(\d+)\+?\s*(?:years?|yrs?)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      if (m[2]) return `${m[1]}-${m[2]}`;
      return m[1];
    }
  }
  return '';
}

function extractSkills(text: string, list: string[]): string[] {
  const lower = normalize(text);
  return list.filter((tech) => {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`).test(lower);
  });
}

function extractRequirements(text: string): string[] {
  const reqs: string[] = [];

  const sectionMatch = text.match(
    /(?:requirements?|qualifications?|what you['']ll need|what we['']re looking for|responsibilities|must have|you should have)[:\s]*\n([\s\S]{50,800}?)(?:\n\n|\n[A-Z]|$)/i
  );

  const block = sectionMatch?.[1] ?? text;

  const bulletLines = block.match(/^[\s]*[-•*▸◦›]\s*(.{10,150})$/gm) ?? [];
  bulletLines.forEach((line) => {
    const clean = line.replace(/^[\s\-•*▸◦›]+/, '').trim();
    if (clean.length > 10) reqs.push(clean);
  });

  if (reqs.length === 0) {
    const numbered = block.match(/^\s*\d+[.)]\s*(.{10,150})$/gm) ?? [];
    numbered.forEach((line) => {
      const clean = line.replace(/^\s*\d+[.)]\s*/, '').trim();
      if (clean.length > 10) reqs.push(clean);
    });
  }

  return reqs.slice(0, 8);
}

export function parseJobDescription(jd: string): ParsedJD {
  const companyName = extractCompany(jd);
  const jobPosition = extractPosition(jd);
  const experienceYears = extractExperience(jd);

  const frontendSkills = extractSkills(jd, FRONTEND_TECHS);
  const backendSkills = extractSkills(jd, BACKEND_TECHS);

  const formatSkills = (skills: string[]) =>
    skills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');

  const requirements = extractRequirements(jd);
  const keySkills = [...new Set([...frontendSkills, ...backendSkills])].map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1)
  );

  const subjectPosition = jobPosition || 'the open position';
  const subjectCompany = companyName || 'your company';

  return {
    companyName,
    jobPosition,
    recipient: 'Hiring Manager',
    subject: `Application for ${subjectPosition} at ${subjectCompany}`,
    backendTechnologies: formatSkills(backendSkills),
    frontendTechnology: formatSkills(frontendSkills),
    requirements,
    keySkills,
    experienceYears,
  };
}
