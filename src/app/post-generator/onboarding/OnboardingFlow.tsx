'use client';

import { useState, useTransition, type KeyboardEvent } from 'react';
import { completeOnboardingAction } from '../actions';
import type { Profile } from '@/lib/post-generator/db';

type InitialProfile =
  | (Profile & { onboarded_at: string | null; updated_at: string })
  | null;

type Props = {
  initial: InitialProfile;
};

type ChipInputProps = {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
};

function ChipInput({ label, values, onChange }: ChipInputProps) {
  const [draft, setDraft] = useState('');

  const addChip = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (values.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...values, trimmed]);
    setDraft('');
  };

  const removeAt = (i: number) => {
    onChange(values.filter((_, idx) => idx !== i));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addChip(draft);
      return;
    }
    if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      e.preventDefault();
      onChange(values.slice(0, -1));
    }
  };

  const onBlur = () => {
    if (draft.trim()) addChip(draft);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-[0.18em] text-pg-muted">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-pg-cream border border-pg-line text-sm"
          >
            <span>{v}</span>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="text-pg-muted hover:text-pg-ink transition-colors duration-200"
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder="Type and press Enter"
        className="border-b border-pg-line focus:border-pg-ink py-2 w-full bg-transparent focus:outline-none"
      />
    </div>
  );
}

export default function OnboardingFlow({ initial }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bio, setBio] = useState(initial?.bio ?? '');
  const [icpAudience, setIcpAudience] = useState(initial?.icp_audience ?? '');
  const [icpProblem, setIcpProblem] = useState(initial?.icp_problem ?? '');
  const [topics, setTopics] = useState<string[]>(initial?.topics ?? []);
  const [avoidTopics, setAvoidTopics] = useState<string[]>(
    initial?.avoid_topics ?? [],
  );
  const [avoidPatterns, setAvoidPatterns] = useState(
    initial?.avoid_patterns ?? '',
  );

  const [isPending, startTransition] = useTransition();

  const canContinue1 = bio.trim().length > 20;
  const canContinue2 =
    icpAudience.trim().length > 5 && icpProblem.trim().length > 5;
  const canFinish = topics.length > 0;

  const goNext = () => {
    if (step === 1 && canContinue1) setStep(2);
    else if (step === 2 && canContinue2) setStep(3);
  };
  const goBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const onFinish = () => {
    startTransition(async () => {
      await completeOnboardingAction({
        bio,
        icp_audience: icpAudience,
        icp_problem: icpProblem,
        topics,
        avoid_topics: avoidTopics,
        avoid_patterns: avoidPatterns,
      });
    });
  };

  return (
    <>
      <header className="px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-pg-accent" aria-hidden />
          <span className="font-display text-lg">Post Generator</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`inline-block w-2 h-2 rounded-full ${
                  n <= step ? 'bg-pg-ink' : 'bg-pg-line'
                }`}
                aria-hidden
              />
            ))}
          </div>
          <span className="font-mono text-sm text-pg-muted">{step} / 3</span>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-12 py-6 md:py-12 max-w-2xl w-full mx-auto">
        {step === 1 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display font-medium text-3xl md:text-5xl leading-tight">
                Who are you?
              </h1>
              <p className="text-pg-muted leading-relaxed">
                A few sentences. Roles, projects, what you ship, what
                you&apos;ve built that&apos;s worth mentioning.
              </p>
            </div>
            <textarea
              name="bio"
              rows={8}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-pg-cream border border-pg-line rounded-md p-4 w-full focus:outline-none focus:border-pg-ink"
            />
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                disabled
                className="rounded-full px-5 py-2.5 border border-pg-line text-pg-ink hover:border-pg-ink disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue1}
                className="rounded-full px-5 py-2.5 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display font-medium text-3xl md:text-5xl leading-tight">
                Who reads you?
              </h1>
              <p className="text-pg-muted leading-relaxed">
                Two short answers. We use these to pick which news matters and
                what angles will land.
              </p>
            </div>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="icp_audience"
                  className="text-xs uppercase tracking-[0.18em] text-pg-muted"
                >
                  Your audience
                </label>
                <input
                  id="icp_audience"
                  name="icp_audience"
                  type="text"
                  value={icpAudience}
                  onChange={(e) => setIcpAudience(e.target.value)}
                  className="border-b border-pg-line focus:border-pg-ink py-2 w-full bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="icp_problem"
                  className="text-xs uppercase tracking-[0.18em] text-pg-muted"
                >
                  The problem you help them solve
                </label>
                <input
                  id="icp_problem"
                  name="icp_problem"
                  type="text"
                  value={icpProblem}
                  onChange={(e) => setIcpProblem(e.target.value)}
                  className="border-b border-pg-line focus:border-pg-ink py-2 w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full px-5 py-2.5 border border-pg-line text-pg-ink hover:border-pg-ink transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue2}
                className="rounded-full px-5 py-2.5 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="font-display font-medium text-3xl md:text-5xl leading-tight">
                What do you write about?
              </h1>
              <p className="text-pg-muted leading-relaxed">
                Topics you go deep on, topics you refuse, and patterns
                you&apos;ve decided are dead to you.
              </p>
            </div>
            <div className="flex flex-col gap-6 mt-4">
              <ChipInput
                label="Topics you go deep on"
                values={topics}
                onChange={setTopics}
              />
              <ChipInput
                label="Topics you refuse to write about"
                values={avoidTopics}
                onChange={setAvoidTopics}
              />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="avoid_patterns"
                  className="text-xs uppercase tracking-[0.18em] text-pg-muted"
                >
                  Patterns to avoid
                </label>
                <textarea
                  id="avoid_patterns"
                  name="avoid_patterns"
                  rows={5}
                  value={avoidPatterns}
                  onChange={(e) => setAvoidPatterns(e.target.value)}
                  className="bg-pg-cream border border-pg-line rounded-md p-4 w-full focus:outline-none focus:border-pg-ink"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={goBack}
                disabled={isPending}
                className="rounded-full px-5 py-2.5 border border-pg-line text-pg-ink hover:border-pg-ink transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onFinish}
                disabled={!canFinish || isPending}
                className="rounded-full px-5 py-2.5 bg-pg-ink text-pg-paper hover:bg-pg-accent transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending ? 'Saving…' : 'Finish'}
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
