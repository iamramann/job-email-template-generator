import { useCallback, useEffect, useState } from 'react';

export interface UsagePlan {
  id: 'free' | 'pro';
  label: string;
  parseLimit: number;    // per month
  emailLimit: number;
  price: string;
}

export const PLANS: UsagePlan[] = [
  { id: 'free', label: 'Free', parseLimit: 5, emailLimit: 10, price: '$0/mo' },
  { id: 'pro', label: 'Pro', parseLimit: 200, emailLimit: 500, price: '$9/mo' },
];

export type UsageMode = 'byok' | 'managed';

export interface UsageState {
  plan: 'free' | 'pro';
  mode: UsageMode;
  parsesUsed: number;
  emailsUsed: number;
  resetDate: string;   // ISO date string for start of current month
}

const STORAGE_KEY = 'jobai_usage_v1';

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function loadUsage(): UsageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as UsageState & { monthKey?: string };
    // Reset counts if new month
    if (parsed.monthKey !== getMonthKey()) return { ...parsed, parsesUsed: 0, emailsUsed: 0, resetDate: new Date().toISOString() };
    return parsed;
  } catch {
    return defaultState();
  }
}

function defaultState(): UsageState {
  return { plan: 'free', mode: 'managed', parsesUsed: 0, emailsUsed: 0, resetDate: new Date().toISOString() };
}

function saveUsage(state: UsageState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, monthKey: getMonthKey() }));
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageState>(loadUsage);

  useEffect(() => { saveUsage(usage); }, [usage]);

  const currentPlan = PLANS.find(p => p.id === usage.plan) ?? PLANS[0];

  const canParse = usage.parsesUsed < currentPlan.parseLimit;
  const canEmail = usage.emailsUsed < currentPlan.emailLimit;

  const parsesLeft = Math.max(0, currentPlan.parseLimit - usage.parsesUsed);
  const emailsLeft = Math.max(0, currentPlan.emailLimit - usage.emailsUsed);
  const parsePercent = Math.min(100, Math.round((usage.parsesUsed / currentPlan.parseLimit) * 100));

  const incrementParses = useCallback(() => {
    setUsage(prev => ({ ...prev, parsesUsed: prev.parsesUsed + 1 }));
  }, []);

  const incrementEmails = useCallback(() => {
    setUsage(prev => ({ ...prev, emailsUsed: prev.emailsUsed + 1 }));
  }, []);

  const upgradeToPro = useCallback(() => {
    setUsage(prev => ({ ...prev, plan: 'pro' }));
  }, []);

  const setMode = useCallback((mode: UsageMode) => {
    setUsage(prev => ({ ...prev, mode }));
  }, []);

  const resetUsage = useCallback(() => {
    setUsage(defaultState());
  }, []);

  return {
    usage,
    currentPlan,
    canParse,
    canEmail,
    parsesLeft,
    emailsLeft,
    parsePercent,
    incrementParses,
    incrementEmails,
    upgradeToPro,
    setMode,
    resetUsage,
  };
}
