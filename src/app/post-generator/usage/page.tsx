import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getCode,
  getStats,
  listUsage14d,
} from '@/lib/post-generator/db';

export const dynamic = 'force-dynamic';

export default async function UsagePage() {
  const jar = await cookies();
  const code = jar.get('pg_code')?.value;
  if (!code) redirect('/post-generator');
  const row = await getCode(code);
  if (!row) redirect('/post-generator');

  const stats = await getStats(code);
  const rows = await listUsage14d(code);

  return (
    <div className="animate-in min-h-screen flex flex-col">
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full bg-pg-accent"
            aria-hidden
          />
          <span className="font-display text-lg">Post Generator</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a
            href="/post-generator/today"
            className="text-pg-muted hover:text-pg-ink transition-colors"
          >
            Today
          </a>
          <a
            href="/post-generator/briefing"
            className="text-pg-muted hover:text-pg-ink transition-colors"
          >
            Briefing
          </a>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-12 py-10 md:py-14">
        <section className="mb-10 md:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
            Usage
          </p>
          <h1 className="font-display text-4xl">Credits &amp; history</h1>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-pg-paper border border-pg-ink rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
              Credits left
            </p>
            <p className="font-display text-4xl text-pg-accent">
              {stats.creditsRemaining}
            </p>
          </div>
          <div className="bg-pg-paper border border-pg-line rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
              Total runs
            </p>
            <p className="font-display text-4xl">{stats.totalRuns}</p>
          </div>
          <div className="bg-pg-paper border border-pg-line rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
              Today&apos;s runs
            </p>
            <p className="font-display text-4xl">{stats.todayRuns}</p>
          </div>
          <div className="bg-pg-paper border border-pg-line rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
              Initial credits
            </p>
            <p className="font-display text-4xl">{row.initial_credits}</p>
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-4">
            Last 14 days
          </p>
          {stats.totalRuns === 0 ? (
            <p className="text-pg-muted py-12 text-center">No usage yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-pg-muted text-xs uppercase tracking-[0.18em] border-b border-pg-line">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Runs</th>
                  <th className="py-3 pr-4">Tokens in</th>
                  <th className="py-3 pr-4">Tokens out</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.date} className="border-b border-pg-line">
                    <td className="py-3 pr-4 font-mono">{r.date}</td>
                    <td className="py-3 pr-4">{r.runs}</td>
                    <td className="py-3 pr-4">
                      {r.tokens_in.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      {r.tokens_out.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
