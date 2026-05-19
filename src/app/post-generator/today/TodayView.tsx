'use client';

import { useState, useTransition } from 'react';
import type { Profile } from '@/lib/post-generator/db';
import type { ParsedCard } from '@/lib/post-generator/generate-kanban';
import { generateTodayKanban, regenerateKanban } from '../actions';

type Props = {
  profile: Profile & { onboarded_at: string | null; updated_at: string };
  date: string;
  rawMarkdown: string | null;
  cards: ParsedCard[];
  cost: number | null;
  inputTokens: number | null;
  outputTokens: number | null;
  generatedAt: string | null;
  creditsRemaining: number;
};

const STATUS_PILL: Record<
  ParsedCard['status'],
  { label: string; dot: string; cls: string }
> = {
  ready: {
    label: 'Ready',
    dot: '🟢',
    cls: 'bg-emerald-50 text-emerald-900',
  },
  edit: {
    label: 'Needs editing',
    dot: '🟡',
    cls: 'bg-amber-50 text-amber-900',
  },
  stub: {
    label: 'Stub',
    dot: '🔴',
    cls: 'bg-rose-50 text-rose-900',
  },
};

function formatDateEyebrow(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(dt);
}

function formatGeneratedTime(ts: string | null): string {
  if (!ts) return '';
  const dt = new Date(ts);
  if (isNaN(dt.getTime())) return ts;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(dt);
}

export default function TodayView(props: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const onGenerate = () => {
    setError(null);
    startTransition(async () => {
      const r = await generateTodayKanban();
      if (!r.ok) setError(r.error ?? 'Failed.');
    });
  };

  const onRegenerate = () => {
    if (typeof window !== 'undefined' && !window.confirm("Overwrite today's kanban? This costs 1 credit."))
      return;
    setError(null);
    startTransition(async () => {
      const r = await regenerateKanban();
      if (!r.ok) setError(r.error ?? 'Failed.');
    });
  };

  const onCopy = async (idx: number, post: string) => {
    try {
      await navigator.clipboard.writeText(post);
      setCopiedIdx(idx);
      window.setTimeout(() => {
        setCopiedIdx((cur) => (cur === idx ? null : cur));
      }, 1800);
    } catch {
      setError('Could not copy to clipboard.');
    }
  };

  const eyebrow = formatDateEyebrow(props.date);
  const generatedTime = formatGeneratedTime(props.generatedAt);
  const hasKanban = !!props.rawMarkdown;
  const noCredits = props.creditsRemaining <= 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-pg-paper/80 backdrop-blur border-b border-pg-line">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-pg-accent w-2 h-2 rounded-full" aria-hidden />
            <span className="font-display text-lg">Post Generator</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="/post-generator/onboarding"
              className="text-pg-muted hover:text-pg-ink transition-colors"
            >
              Profile
            </a>
            <a
              href="/post-generator/usage"
              className="text-pg-muted hover:text-pg-ink transition-colors"
            >
              {props.creditsRemaining} credit{props.creditsRemaining === 1 ? '' : 's'}
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 py-10 md:py-14">
        <section className="animate-in flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted font-mono mb-3">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl md:text-5xl">
              Today&apos;s <em className="text-pg-accent not-italic">kanban</em>
            </h1>
            {hasKanban && (
              <p className="text-pg-muted text-sm mt-3">
                Generated {generatedTime}
                {props.inputTokens != null && props.outputTokens != null
                  ? ` · ${props.inputTokens.toLocaleString()} in / ${props.outputTokens.toLocaleString()} out`
                  : ''}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            {hasKanban ? (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={pending || noCredits}
                className="rounded-full px-5 py-2.5 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors text-sm disabled:opacity-50"
              >
                {pending ? 'Drafting…' : 'Regenerate'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onGenerate}
                disabled={pending || noCredits}
                className="rounded-full px-5 py-2.5 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors text-sm disabled:opacity-50"
              >
                {pending ? 'Drafting…' : "Generate today's drafts"}
              </button>
            )}
          </div>
        </section>

        {noCredits && (
          <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-md p-4 mb-8 animate-in">
            You&apos;re out of credits. Ping Dudu for a new code.
          </div>
        )}

        {error && (
          <div className="bg-rose-50 text-rose-900 border border-rose-200 rounded-md p-4 mb-8 animate-in">
            {error}
          </div>
        )}

        {pending && props.cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in">
            <div
              className="w-6 h-6 border-2 border-pg-line border-t-pg-ink rounded-full animate-spin mb-5"
              aria-hidden
            />
            <p className="text-pg-ink">
              Reading the briefing, drafting five cards…
            </p>
            <p className="text-pg-muted text-sm mt-2">
              This takes about 30 seconds.
            </p>
          </div>
        )}

        {!pending && !hasKanban && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in">
            <p className="font-display text-2xl mb-2">No drafts yet today.</p>
            <p className="text-pg-muted text-sm">
              Click Generate today&apos;s drafts to start. Costs 1 credit.
            </p>
          </div>
        )}

        {!pending && hasKanban && props.cards.length === 0 && props.rawMarkdown && (
          <div className="bg-pg-paper border border-pg-line rounded-2xl p-6 md:p-7 animate-in">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
              Raw output — couldn&apos;t parse cards.
            </p>
            <pre className="whitespace-pre-wrap font-mono text-xs text-pg-ink">
              {props.rawMarkdown}
            </pre>
          </div>
        )}

        {props.cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {props.cards.map((card, i) => {
              const pill = STATUS_PILL[card.status];
              const num = String(card.number).padStart(2, '0');
              const isCopied = copiedIdx === i;
              return (
                <article
                  key={`${card.number}-${i}`}
                  className="bg-pg-paper border border-pg-line rounded-2xl p-6 md:p-7 animate-in"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-xs text-pg-muted">
                      {card.formatId} · {card.formatName}
                    </span>
                    <span className="font-display text-5xl text-pg-line leading-none">
                      {num}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${pill.cls}`}
                    >
                      <span aria-hidden>{pill.dot}</span>
                      {pill.label}
                    </span>
                  </div>

                  {card.anchor && (
                    <p className="italic text-pg-muted text-sm mb-4">
                      Anchor: {card.anchor}
                    </p>
                  )}

                  <div className="bg-pg-cream border border-pg-line rounded-md p-4 whitespace-pre-wrap font-sans text-pg-ink leading-relaxed mb-4">
                    {card.post}
                  </div>

                  <p className="text-sm text-pg-muted mb-5">
                    <span className="text-xs uppercase tracking-[0.18em] mr-2">
                      Why
                    </span>
                    {card.whyItWorks}
                  </p>

                  <div className="border-t border-pg-line pt-4 flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => onCopy(i, card.post)}
                      className="rounded-full px-4 py-2 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors text-sm"
                    >
                      {isCopied ? '✓ Copied' : 'Copy post'}
                    </button>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.linkedin.com/feed/?shareActive=true&shareUrl=&text=${encodeURIComponent(
                        card.post,
                      )}`}
                      className="text-sm text-pg-muted hover:text-pg-ink transition-colors"
                    >
                      Open in LinkedIn ↗
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
