import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { marked } from 'marked';
import { getCode } from '@/lib/post-generator/db';
import {
  listBriefingDates,
  readBriefing,
} from '@/lib/post-generator/generate-kanban';

export const dynamic = 'force-dynamic';

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dt);
}

export default async function BriefingPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const jar = await cookies();
  const code = jar.get('pg_code')?.value;
  if (!code) redirect('/post-generator');
  const row = await getCode(code);
  if (!row) redirect('/post-generator');

  const dates = listBriefingDates();
  const params = await searchParams;
  const selected =
    params.date && dates.includes(params.date) ? params.date : dates[0];

  const md = selected ? readBriefing(selected) : null;
  const html = md ? await marked.parse(md) : null;
  const recent = dates.slice(0, 14);

  return (
    <div className="animate-in min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-pg-paper/80 backdrop-blur border-b border-pg-line">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-pg-accent w-2 h-2 rounded-full" aria-hidden />
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
              href="/post-generator/usage"
              className="text-pg-muted hover:text-pg-ink transition-colors"
            >
              Usage
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 py-10 md:py-14">
        <section className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
            Briefing
          </p>
          <h1 className="font-display text-4xl md:text-5xl">
            {selected ? formatDate(selected) : 'No briefings'}
          </h1>
          <p className="text-pg-muted text-sm mt-3">
            This is the source material today&apos;s drafts are anchored to.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-8 md:gap-10">
          <article className="order-2 md:order-1">
            {html ? (
              <div
                className="pg-prose"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <p className="text-pg-muted py-12 text-center">
                No briefing available.
              </p>
            )}
          </article>

          <aside className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
              Recent
            </p>
            <ul className="flex flex-row md:flex-col gap-2 flex-wrap">
              {recent.map((d) => {
                const isActive = d === selected;
                return (
                  <li key={d}>
                    <a
                      href={`/post-generator/briefing?date=${d}`}
                      className={`block rounded-md px-3 py-1.5 text-sm font-mono transition-colors ${
                        isActive
                          ? 'bg-pg-ink text-pg-paper'
                          : 'text-pg-muted hover:text-pg-ink hover:bg-pg-cream'
                      }`}
                    >
                      {d}
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}
