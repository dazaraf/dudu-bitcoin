import { neon } from '@neondatabase/serverless';

function getConnectionString(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      'No Postgres connection string. Set DATABASE_URL or POSTGRES_URL.',
    );
  }
  return url;
}

let _sql: ReturnType<typeof neon> | null = null;
function sql() {
  if (!_sql) _sql = neon(getConnectionString());
  return _sql;
}

let _initialized = false;
async function init(): Promise<void> {
  if (_initialized) return;
  const q = sql();
  await q`
    CREATE TABLE IF NOT EXISTS pg_codes (
      code TEXT PRIMARY KEY,
      initial_credits INTEGER NOT NULL,
      credits_remaining INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await q`
    CREATE TABLE IF NOT EXISTS pg_profiles (
      code TEXT PRIMARY KEY REFERENCES pg_codes(code) ON DELETE CASCADE,
      bio TEXT NOT NULL DEFAULT '',
      icp_audience TEXT NOT NULL DEFAULT '',
      icp_problem TEXT NOT NULL DEFAULT '',
      topics JSONB NOT NULL DEFAULT '[]'::jsonb,
      avoid_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
      avoid_patterns TEXT NOT NULL DEFAULT '',
      onboarded_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await q`
    CREATE TABLE IF NOT EXISTS pg_kanbans (
      code TEXT NOT NULL REFERENCES pg_codes(code) ON DELETE CASCADE,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      cache_read_tokens INTEGER NOT NULL DEFAULT 0,
      cache_creation_tokens INTEGER NOT NULL DEFAULT 0,
      estimated_cost_usd DOUBLE PRECISION NOT NULL DEFAULT 0,
      generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (code, date)
    )
  `;
  await q`
    CREATE TABLE IF NOT EXISTS pg_usage_log (
      id BIGSERIAL PRIMARY KEY,
      code TEXT NOT NULL REFERENCES pg_codes(code) ON DELETE CASCADE,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
      model TEXT NOT NULL,
      request_type TEXT NOT NULL,
      input_tokens INTEGER NOT NULL DEFAULT 0,
      cache_read_tokens INTEGER NOT NULL DEFAULT 0,
      cache_creation_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      estimated_cost_usd DOUBLE PRECISION NOT NULL DEFAULT 0
    )
  `;
  _initialized = true;
}

// Parses INITIAL_CODES env: "code1:50,code2:9999" → array of {code, credits}.
function parseInitialCodes(): { code: string; credits: number }[] {
  const raw = process.env.INITIAL_CODES;
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [code, creditsStr] = pair.split(':');
      const credits = parseInt(creditsStr ?? '0', 10);
      if (!code || Number.isNaN(credits)) return null;
      return { code: code.trim(), credits };
    })
    .filter((x): x is { code: string; credits: number } => x !== null);
}

let _seeded = false;
async function seedInitialCodes(): Promise<void> {
  if (_seeded) return;
  const pairs = parseInitialCodes();
  if (pairs.length === 0) {
    _seeded = true;
    return;
  }
  const q = sql();
  for (const { code, credits } of pairs) {
    // Upsert: never override an existing balance — only set on first seed.
    await q`
      INSERT INTO pg_codes (code, initial_credits, credits_remaining)
      VALUES (${code}, ${credits}, ${credits})
      ON CONFLICT (code) DO NOTHING
    `;
  }
  _seeded = true;
}

export async function ensureReady(): Promise<void> {
  await init();
  await seedInitialCodes();
}

export type Profile = {
  bio: string;
  icp_audience: string;
  icp_problem: string;
  topics: string[];
  avoid_topics: string[];
  avoid_patterns: string;
};

export type CodeRow = {
  code: string;
  initial_credits: number;
  credits_remaining: number;
  created_at: string;
};

export async function getCode(code: string): Promise<CodeRow | null> {
  await ensureReady();
  const rows = (await sql()`
    SELECT code, initial_credits, credits_remaining, created_at
    FROM pg_codes WHERE code = ${code}
  `) as CodeRow[];
  return rows[0] ?? null;
}

// Atomically decrement credits. Returns new balance or null if insufficient / unknown code.
export async function debitCredit(code: string): Promise<number | null> {
  await ensureReady();
  const rows = (await sql()`
    UPDATE pg_codes
    SET credits_remaining = credits_remaining - 1
    WHERE code = ${code} AND credits_remaining > 0
    RETURNING credits_remaining
  `) as { credits_remaining: number }[];
  return rows[0]?.credits_remaining ?? null;
}

type ProfileRow = {
  code: string;
  bio: string;
  icp_audience: string;
  icp_problem: string;
  topics: unknown;
  avoid_topics: unknown;
  avoid_patterns: string;
  onboarded_at: string | null;
  updated_at: string;
};

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.map((x) => String(x)) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function getProfile(
  code: string,
): Promise<(Profile & { onboarded_at: string | null; updated_at: string }) | null> {
  await ensureReady();
  const rows = (await sql()`
    SELECT code, bio, icp_audience, icp_problem, topics, avoid_topics,
           avoid_patterns, onboarded_at, updated_at
    FROM pg_profiles WHERE code = ${code}
  `) as ProfileRow[];
  const row = rows[0];
  if (!row) return null;
  return {
    bio: row.bio ?? '',
    icp_audience: row.icp_audience ?? '',
    icp_problem: row.icp_problem ?? '',
    topics: asStringArray(row.topics),
    avoid_topics: asStringArray(row.avoid_topics),
    avoid_patterns: row.avoid_patterns ?? '',
    onboarded_at: row.onboarded_at,
    updated_at: row.updated_at,
  };
}

export async function saveProfile(code: string, p: Profile): Promise<void> {
  await ensureReady();
  const topicsJson = JSON.stringify(p.topics ?? []);
  const avoidJson = JSON.stringify(p.avoid_topics ?? []);
  await sql()`
    INSERT INTO pg_profiles (
      code, bio, icp_audience, icp_problem, topics, avoid_topics,
      avoid_patterns, onboarded_at, updated_at
    ) VALUES (
      ${code}, ${p.bio}, ${p.icp_audience}, ${p.icp_problem},
      ${topicsJson}::jsonb, ${avoidJson}::jsonb,
      ${p.avoid_patterns}, now(), now()
    )
    ON CONFLICT (code) DO UPDATE SET
      bio = EXCLUDED.bio,
      icp_audience = EXCLUDED.icp_audience,
      icp_problem = EXCLUDED.icp_problem,
      topics = EXCLUDED.topics,
      avoid_topics = EXCLUDED.avoid_topics,
      avoid_patterns = EXCLUDED.avoid_patterns,
      onboarded_at = COALESCE(pg_profiles.onboarded_at, now()),
      updated_at = now()
  `;
}

export type KanbanRow = {
  date: string;
  content: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_creation_tokens: number;
  estimated_cost_usd: number;
  generated_at: string;
};

export async function getKanban(
  code: string,
  date: string,
): Promise<KanbanRow | null> {
  await ensureReady();
  const rows = (await sql()`
    SELECT date, content, input_tokens, output_tokens, cache_read_tokens,
           cache_creation_tokens, estimated_cost_usd, generated_at
    FROM pg_kanbans WHERE code = ${code} AND date = ${date}
  `) as KanbanRow[];
  return rows[0] ?? null;
}

export async function saveKanban(
  code: string,
  row: {
    date: string;
    content: string;
    input_tokens: number;
    output_tokens: number;
    cache_read_tokens: number;
    cache_creation_tokens: number;
    estimated_cost_usd: number;
  },
): Promise<void> {
  await ensureReady();
  await sql()`
    INSERT INTO pg_kanbans (
      code, date, content, input_tokens, output_tokens,
      cache_read_tokens, cache_creation_tokens, estimated_cost_usd, generated_at
    ) VALUES (
      ${code}, ${row.date}, ${row.content}, ${row.input_tokens}, ${row.output_tokens},
      ${row.cache_read_tokens}, ${row.cache_creation_tokens}, ${row.estimated_cost_usd}, now()
    )
    ON CONFLICT (code, date) DO UPDATE SET
      content = EXCLUDED.content,
      input_tokens = EXCLUDED.input_tokens,
      output_tokens = EXCLUDED.output_tokens,
      cache_read_tokens = EXCLUDED.cache_read_tokens,
      cache_creation_tokens = EXCLUDED.cache_creation_tokens,
      estimated_cost_usd = EXCLUDED.estimated_cost_usd,
      generated_at = now()
  `;
}

export async function logUsage(
  code: string,
  row: {
    model: string;
    request_type: string;
    input_tokens: number;
    cache_read_tokens: number;
    cache_creation_tokens: number;
    output_tokens: number;
    estimated_cost_usd: number;
  },
): Promise<void> {
  await ensureReady();
  await sql()`
    INSERT INTO pg_usage_log (
      code, model, request_type, input_tokens, cache_read_tokens,
      cache_creation_tokens, output_tokens, estimated_cost_usd
    ) VALUES (
      ${code}, ${row.model}, ${row.request_type}, ${row.input_tokens},
      ${row.cache_read_tokens}, ${row.cache_creation_tokens},
      ${row.output_tokens}, ${row.estimated_cost_usd}
    )
  `;
}

export type UsageDayRow = {
  date: string;
  runs: number;
  tokens_in: number;
  tokens_out: number;
  cost: number;
};

export async function listUsage14d(code: string): Promise<UsageDayRow[]> {
  await ensureReady();
  const rows = (await sql()`
    SELECT
      to_char(date_trunc('day', timestamp), 'YYYY-MM-DD') AS date,
      COUNT(*)::int AS runs,
      COALESCE(SUM(input_tokens), 0)::int AS tokens_in,
      COALESCE(SUM(output_tokens), 0)::int AS tokens_out,
      COALESCE(SUM(estimated_cost_usd), 0)::float AS cost
    FROM pg_usage_log
    WHERE code = ${code}
      AND timestamp >= now() - interval '13 days'
    GROUP BY date_trunc('day', timestamp)
    ORDER BY date_trunc('day', timestamp) DESC
  `) as UsageDayRow[];
  return rows;
}

export type Stats = {
  totalRuns: number;
  todayRuns: number;
  totalCost: number;
  todayCost: number;
  creditsRemaining: number;
};

export async function getStats(code: string): Promise<Stats> {
  await ensureReady();
  const total = (await sql()`
    SELECT COUNT(*)::int AS runs, COALESCE(SUM(estimated_cost_usd), 0)::float AS cost
    FROM pg_usage_log WHERE code = ${code}
  `) as { runs: number; cost: number }[];
  const today = (await sql()`
    SELECT COUNT(*)::int AS runs, COALESCE(SUM(estimated_cost_usd), 0)::float AS cost
    FROM pg_usage_log
    WHERE code = ${code} AND date_trunc('day', timestamp) = date_trunc('day', now())
  `) as { runs: number; cost: number }[];
  const codeRow = await getCode(code);
  return {
    totalRuns: total[0]?.runs ?? 0,
    todayRuns: today[0]?.runs ?? 0,
    totalCost: total[0]?.cost ?? 0,
    todayCost: today[0]?.cost ?? 0,
    creditsRemaining: codeRow?.credits_remaining ?? 0,
  };
}
