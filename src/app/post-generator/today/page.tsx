import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getCode,
  getProfile,
  getKanban,
  getStats,
} from '@/lib/post-generator/db';
import { parseKanban } from '@/lib/post-generator/generate-kanban';
import TodayView from './TodayView';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const jar = await cookies();
  const code = jar.get('pg_code')?.value;
  if (!code) redirect('/post-generator');
  const row = await getCode(code);
  if (!row) redirect('/post-generator');

  const profile = await getProfile(code);
  if (!profile?.bio) redirect('/post-generator/onboarding');

  const date = new Date().toISOString().slice(0, 10);
  const k = await getKanban(code, date);
  const cards = k ? parseKanban(k.content) : [];
  const stats = await getStats(code);

  return (
    <TodayView
      profile={profile}
      date={date}
      rawMarkdown={k?.content ?? null}
      cards={cards}
      cost={k?.estimated_cost_usd ?? null}
      inputTokens={k?.input_tokens ?? null}
      outputTokens={k?.output_tokens ?? null}
      generatedAt={k?.generated_at ?? null}
      creditsRemaining={stats.creditsRemaining}
    />
  );
}
