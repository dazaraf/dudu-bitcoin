import path from 'path';
import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import type { Profile } from './db';

export type ParsedCard = {
  number: number;
  formatId: string;
  formatName: string;
  status: 'ready' | 'edit' | 'stub';
  anchor: string;
  post: string;
  whyItWorks: string;
};

export type GenerateResult = {
  rawMarkdown: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_tokens: number;
    cache_creation_tokens: number;
  };
  cost: number;
};

export const PRICING: Record<
  string,
  { input: number; output: number; cache_read: number; cache_write: number }
> = {
  'claude-opus-4-7': { input: 15.0, output: 75.0, cache_read: 1.5, cache_write: 18.75 },
};

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'post-generator');
export const BRIEFINGS_DIR = path.join(CONTENT_ROOT, 'briefings');
export const PROMPTS_DIR = path.join(CONTENT_ROOT, 'prompts');

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (_client) return _client;
  _client = new Anthropic();
  return _client;
}

export function renderProfile(profile: Profile): string {
  const topicsBlock =
    profile.topics.length === 0
      ? '(none specified — lean broad)'
      : profile.topics.map((t) => `- ${t}`).join('\n');
  const avoidBlock =
    profile.avoid_topics.length === 0
      ? '(none specified)'
      : profile.avoid_topics.map((t) => `- ${t}`).join('\n');

  return `# Author Profile

## Who they are
${profile.bio}

## Who they write for
${profile.icp_audience}

## Problem they help solve
${profile.icp_problem}

## Topics they go deep on
${topicsBlock}

## Topics to avoid
${avoidBlock}

## Patterns to avoid
${profile.avoid_patterns}`;
}

export function calcCost(
  model: string,
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_tokens: number;
    cache_creation_tokens: number;
  },
): number {
  const p = PRICING[model];
  if (!p) return 0;
  return (
    ((usage.input_tokens || 0) * p.input) / 1e6 +
    ((usage.output_tokens || 0) * p.output) / 1e6 +
    ((usage.cache_read_tokens || 0) * p.cache_read) / 1e6 +
    ((usage.cache_creation_tokens || 0) * p.cache_write) / 1e6
  );
}

// Picks the most recent briefing on or before `date`. Briefings are produced daily but
// weekends/gaps happen; we fall back so users never see a hard "no briefing" error.
function findLatestBriefing(date: string): { path: string; date: string } | null {
  if (!fs.existsSync(BRIEFINGS_DIR)) return null;
  const exact = path.join(BRIEFINGS_DIR, `${date}.md`);
  if (fs.existsSync(exact)) return { path: exact, date };
  const all = fs
    .readdirSync(BRIEFINGS_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((d) => d <= date)
    .sort()
    .reverse();
  const latest = all[0];
  if (!latest) return null;
  return { path: path.join(BRIEFINGS_DIR, `${latest}.md`), date: latest };
}

export async function generateKanban(
  profile: Profile,
  date: string,
): Promise<GenerateResult & { briefingDate: string }> {
  const briefing = findLatestBriefing(date);
  if (!briefing) {
    throw new Error(
      `No briefing available. Expected files under content/post-generator/briefings/.`,
    );
  }
  const briefingText = fs.readFileSync(briefing.path, 'utf8');

  const kanbanPrompt = fs.readFileSync(
    path.join(PROMPTS_DIR, 'kanban-prompt.md'),
    'utf8',
  );
  const formulas = fs.readFileSync(
    path.join(PROMPTS_DIR, 'winning-formulas.md'),
    'utf8',
  );

  const client = getClient();
  const msg = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 16000,
    system: [
      { type: 'text', text: kanbanPrompt },
      { type: 'text', text: renderProfile(profile) },
      {
        type: 'text',
        text: `# Winning Formulas\n\n${formulas}`,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `# Today's Briefing — ${briefing.date}\n\n${briefingText}\n\nProduce the kanban now.`,
      },
    ],
  });

  const rawMarkdown = msg.content
    .filter((c): c is Extract<typeof c, { type: 'text' }> => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  if (!rawMarkdown.trim()) {
    throw new Error('Model returned no text.');
  }

  const usage = {
    input_tokens: msg.usage.input_tokens ?? 0,
    output_tokens: msg.usage.output_tokens ?? 0,
    cache_read_tokens:
      (msg.usage as unknown as { cache_read_input_tokens?: number })
        .cache_read_input_tokens ?? 0,
    cache_creation_tokens:
      (msg.usage as unknown as { cache_creation_input_tokens?: number })
        .cache_creation_input_tokens ?? 0,
  };

  const cost = calcCost('claude-opus-4-7', usage);

  return { rawMarkdown, usage, cost, briefingDate: briefing.date };
}

const STATUS_MAP: Record<string, 'ready' | 'edit' | 'stub'> = {
  '🟢': 'ready',
  '🟡': 'edit',
  '🔴': 'stub',
};

function stripCodeFences(s: string): string {
  let t = s.trim();
  t = t.replace(/^```[\w-]*\n?/, '');
  t = t.replace(/\n?```\s*$/, '');
  return t.trim();
}

export function parseKanban(markdown: string): ParsedCard[] {
  if (!markdown) return [];
  const parts = markdown.split(/^### Card /m);
  const blocks = parts.slice(1);
  const cards: ParsedCard[] = [];

  for (const block of blocks) {
    const numMatch = block.match(/^(\d+)/);
    if (!numMatch) continue;
    const number = parseInt(numMatch[1], 10);

    const headerMatch = block.match(/^\d+\s*·\s*([\w-]+)\s*·\s*(.+)$/m);
    if (!headerMatch) continue;
    const formatId = headerMatch[1].trim();
    const formatName = headerMatch[2].trim();

    const statusMatch = block.match(/\*\*Status:\*\*\s*(🟢|🟡|🔴)/);
    if (!statusMatch) continue;
    const status = STATUS_MAP[statusMatch[1]];

    const anchorMatch = block.match(/\*\*Anchor:\*\*\s*(.+)$/m);
    const anchor = anchorMatch ? anchorMatch[1].trim() : '';

    const postMatch = block.match(
      /\*\*Post:\*\*\s*([\s\S]*?)\*\*Why it works:\*\*/,
    );
    if (!postMatch) continue;
    const post = stripCodeFences(postMatch[1]);

    const whyMatch = block.match(
      /\*\*Why it works:\*\*\s*([\s\S]+?)(?=\n###|$)/,
    );
    const whyItWorks = whyMatch ? whyMatch[1].trim() : '';

    if (!post || !whyItWorks) continue;

    cards.push({
      number,
      formatId,
      formatName,
      status,
      anchor,
      post,
      whyItWorks,
    });
  }

  return cards;
}
