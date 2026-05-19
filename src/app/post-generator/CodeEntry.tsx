'use client';

import { useState, useTransition } from 'react';
import { redeemCodeAction } from './actions';

export default function CodeEntry() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const r = await redeemCodeAction(code);
      if (!r.ok) setError(r.error ?? 'Failed.');
    });
  };

  return (
    <div className="animate-in min-h-screen flex flex-col">
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-pg-accent" aria-hidden />
          <span className="font-display text-lg">Post Generator</span>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-12 py-10 md:py-20 max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.18em] text-pg-muted">
              A daily content engine
            </p>
            <h1 className="font-display font-medium text-4xl md:text-6xl leading-tight">
              Wake up to{' '}
              <em className="text-pg-accent not-italic">five drafts</em> in your
              voice.
            </h1>
            <p className="text-base md:text-lg text-pg-ink/80 max-w-prose leading-relaxed">
              Tell us who you are, who you write for, and what you refuse to
              post about. Every morning we hand you a kanban of five drafts,
              anchored to today&apos;s news, ready to ship.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-pg-paper border border-pg-line rounded-2xl p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-pg-muted mb-3">
                Access code
              </p>
              <h3 className="font-display text-2xl mb-4">Enter your code</h3>
              <p className="text-pg-muted text-sm leading-relaxed mb-5">
                Codes are credits. Each generation spends one credit. When
                you&apos;re out, ping Dudu.
              </p>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="gidon-XXXXXX"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  className="bg-pg-cream border border-pg-line rounded-md p-3 w-full focus:outline-none focus:border-pg-ink font-mono text-sm"
                />
                {error && (
                  <p className="text-sm text-rose-700">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={pending || !code.trim()}
                  className="rounded-full px-5 py-2.5 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors text-sm disabled:opacity-50"
                >
                  {pending ? 'Checking…' : 'Enter →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-12 py-6 flex items-center justify-between text-sm">
        <p className="text-pg-muted">Built by Dudu Bitcoin.</p>
        <p className="font-mono text-pg-muted">v0.1</p>
      </footer>
    </div>
  );
}
