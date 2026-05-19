'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import {
  saveProfile,
  getProfile,
  getKanban,
  saveKanban,
  logUsage,
  getCode,
  debitCredit,
  ensureReady,
  type Profile,
} from '@/lib/post-generator/db';
import { generateKanban } from '@/lib/post-generator/generate-kanban';

const COOKIE = 'pg_code';
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/post-generator',
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

async function getCurrentCode(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}

export async function redeemCodeAction(rawCode: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const code = (rawCode ?? '').trim();
  if (!code) return { ok: false, error: 'Enter a code.' };

  await ensureReady();
  const row = await getCode(code);
  if (!row) return { ok: false, error: 'Code not recognized.' };

  const jar = await cookies();
  jar.set(COOKIE, code, COOKIE_OPTS);

  const profile = await getProfile(code);
  revalidatePath('/post-generator');
  if (profile?.bio?.trim()) {
    redirect('/post-generator/today');
  }
  redirect('/post-generator/onboarding');
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
  revalidatePath('/post-generator');
  redirect('/post-generator');
}

export async function saveProfileAction(profile: Profile): Promise<void> {
  const code = await getCurrentCode();
  if (!code) redirect('/post-generator');
  await saveProfile(code, profile);
  revalidatePath('/post-generator/today');
}

export async function completeOnboardingAction(profile: Profile): Promise<void> {
  const code = await getCurrentCode();
  if (!code) redirect('/post-generator');
  await saveProfile(code, profile);
  revalidatePath('/post-generator/today');
  redirect('/post-generator/today');
}

async function runGeneration(opts: { overwrite: boolean }): Promise<{
  ok: boolean;
  error?: string;
  cost?: number;
  date?: string;
}> {
  const code = await getCurrentCode();
  if (!code) return { ok: false, error: 'Session expired. Re-enter your code.' };

  const profile = await getProfile(code);
  if (!profile?.bio) {
    return { ok: false, error: 'No profile. Set up your voice first.' };
  }

  const date = new Date().toISOString().slice(0, 10);
  if (!opts.overwrite && (await getKanban(code, date))) {
    return {
      ok: false,
      error: 'A kanban for today already exists. Use Regenerate to overwrite.',
    };
  }

  // Debit first; if generation fails we refund implicitly by NOT issuing a credit back —
  // we accept this trade-off in v1. To avoid eating a credit on bad-state errors we
  // checked profile + duplicate already.
  const balance = await debitCredit(code);
  if (balance === null) {
    return {
      ok: false,
      error: 'Out of credits. Ping Dudu for more.',
    };
  }

  try {
    const { rawMarkdown, usage, cost } = await generateKanban(profile, date);
    await saveKanban(code, {
      date,
      content: rawMarkdown,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cache_read_tokens: usage.cache_read_tokens,
      cache_creation_tokens: usage.cache_creation_tokens,
      estimated_cost_usd: cost,
    });
    await logUsage(code, {
      model: 'claude-opus-4-7',
      request_type: 'kanban',
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cache_read_tokens: usage.cache_read_tokens,
      cache_creation_tokens: usage.cache_creation_tokens,
      estimated_cost_usd: cost,
    });
    revalidatePath('/post-generator/today');
    return { ok: true, cost, date };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Generation failed.';
    return { ok: false, error: msg };
  }
}

export async function generateTodayKanban() {
  return runGeneration({ overwrite: false });
}

export async function regenerateKanban() {
  return runGeneration({ overwrite: true });
}
