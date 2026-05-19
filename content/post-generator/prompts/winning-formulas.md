# Winning Formulas — LinkedIn for AI Builders

12 post formats. Each has a structure, when-to-use rules, and an AI-flavored example. The kanban prompt picks 5 of these per day and drafts one post in each.

---

## Golden Rules

- Every post fits a format. If it doesn't fit, don't post it.
- Every post passes the voice filter from `voice-profile.md`.
- Every claim is grounded — in a data point, a benchmark, a real anecdote, a credible source. No vibes-only posts.
- Short lines. One idea per line. Lots of white space.
- LinkedIn rewards posts that get comments in the first hour. End with engagement.

---

## LI-1 · Personal Experiment + Tactical Insight

**What it is:** You're running a real experiment, sharing the journey live. Builds tension, ends with a question.

**Structure:**
- Bold opening — the experiment in one line
- Why you're doing it
- The problem (build tension)
- What you're actually doing (numbered)
- What you expect to learn
- Engagement hook (poll, YES/NO, question)

**When to use:** You've started something measurable in the last 7 days. Builders love this; it earns trust.

**Example:**
```
I'm replacing my entire agent stack with Claude's computer use API.

Two months of LangGraph plumbing.
Six custom tool wrappers.
A prompt caching layer I wrote myself.

All of it — gone.

Why?
Because the abstraction tax got bigger than the value.

Here's the experiment, running this week:
1. Strip the orchestration layer. Just messages.create.
2. Move all tool definitions inline.
3. Re-run our 40 evals against both stacks.
4. Compare cost, latency, success rate.

If the simpler stack wins, I'm shipping it Monday.

What would you bet wins — the framework, or the raw API?
```

---

## LI-2 · Meme + Hot Take

**What it is:** A meme image with a one-paragraph take stapled underneath. The meme earns the click; the take earns the comment.

**Structure:**
- Meme image (or describe one to commission)
- One-line setup
- The take (3–5 lines)
- A question

**When to use:** A clear cultural moment in AI. Don't force this — bad memes are worse than no memes.

**Example:**
```
[Image: "they're the same picture" meme, captioned "AGI" / "next-token prediction"]

Every six months we relabel the same model architecture.

GPT-4 was AGI-adjacent.
Claude 3 was the next leap.
o1 was reasoning.
Now agents are AGI.

The capabilities curve is real. The naming theater is exhausting.

What's the next term we'll regret in 18 months?
```

---

## LI-3 · Educational Breakdown

**What it is:** Take one technical concept your audience half-understands and explain it in 90 seconds.

**Structure:**
- Hook: a misconception or a "most people get this wrong" frame
- The concept stated cleanly
- Why it matters (the stakes)
- 3–5 numbered points or a worked example
- A line that makes them save the post

**When to use:** Anytime. Evergreen. Especially good when you can tie to a topic that just trended.

**Example:**
```
Most engineers misuse prompt caching.

They cache the system prompt. Done.

But the real win is caching CONVERSATION HISTORY for multi-turn agents.

Here's the move:

1. Put your tool definitions in cache_control: ephemeral.
2. Put your last user message OUTSIDE the cache.
3. On every turn, the cached prefix replays in ~0.1× the cost.
4. For a 50-turn agent, that's a 90%+ cost reduction.

If you're paying full price on every agent step, you're leaving 8–9× on the table.

Save this — you'll come back to it next time you build an agent loop.
```

---

## LI-4 · Step-by-Step Tutorial

**What it is:** A specific recipe someone could follow today and get a result.

**Structure:**
- Outcome promise (what they'll have after reading)
- Prereqs (one line)
- Numbered steps (5–8)
- Common pitfall (one line)
- "Save for the next time you..." close

**When to use:** You've actually done this. Tutorials get reposted; bad ones get crucified in the comments.

**Example:**
```
How to ship an agent eval suite in one afternoon:

You need: a prod log of agent runs, an LLM judge, a spreadsheet.

1. Pull 50 real agent traces from your last 2 weeks of production.
2. Hand-label each with: success / failure / partial. ~30 min.
3. Write 1 LLM-judge prompt per failure mode you spotted (3–5 prompts).
4. Run all 50 traces through every judge prompt. Score 0/1.
5. Compute: judge precision/recall vs your hand labels.
6. Keep the judges with >0.8 F1. Throw the rest out.
7. Wire the keepers into your CI: every PR runs against the same 50.
8. Watch your prompt regressions stop happening.

Pitfall: don't write judges before you've labeled real failures. You'll catch the wrong things.

Save this for the next time someone says "we should add evals."
```

---

## LI-5 · Framework / Misconception Buster

**What it is:** Take a widely-held belief, prove it wrong, replace it with a sharper frame.

**Structure:**
- "Most [X]s think [Y]. They're wrong."
- Why the belief is everywhere
- The actual mechanism (what's really going on)
- The replacement frame (the new mental model)
- Why this matters for the reader

**When to use:** When you have a strong contrarian take backed by experience or data. This format is built for conviction.

**Example:**
```
Most teams think "RAG is a retrieval problem."

It isn't.

RAG is a CHUNKING problem dressed up as a retrieval problem.

The retrieval part is mostly solved — vector search works fine.

What kills RAG quality is upstream:
— Chunks that split mid-thought
— Chunks without enough context to stand alone
— Chunks that lose the parent document's structure

Fix the chunks, the retrieval works.
Fix the retrieval without fixing the chunks, you build a bigger sandcastle.

If your RAG is bad, look at your chunks before you swap your vector DB.
```

---

## LI-6 · Industry Thesis / Contrarian Take

**What it is:** A medium-length post stating where the industry is going — and why most people are wrong about it.

**Structure:**
- One-line thesis up top
- The consensus view (what everyone is saying)
- Why the consensus is incomplete
- Your read (with 2–3 specific signals)
- What it means for your reader's next 6 months

**When to use:** Once a week max. Theses lose power if you have a new one every day.

**Example:**
```
The "agent framework" market is going to collapse to one winner per language.

Consensus says: a thousand frameworks will bloom. LangChain. CrewAI. AutoGen. LlamaIndex. Mastra. AG2. Pick your flavor.

That's wrong.

Agent frameworks aren't web frameworks — they're orchestration runtimes. Runtimes consolidate. Always.

What I'm watching:
— Which framework owns the eval story end-to-end
— Which framework's primitives map cleanly onto provider tool schemas
— Which framework gets adopted by the model providers themselves

In 18 months we'll have one Python winner, one TypeScript winner, and a long tail of "we built our own."

If you're picking a framework today, optimize for portability — not for features.
```

---

## LI-7 · Chart + Take

**What it is:** A single chart with a one-paragraph take that the chart can't make on its own.

**Structure:**
- Chart image (clean, branded if possible)
- One-line caption stating what the chart shows
- The non-obvious takeaway (3–5 lines)
- A question

**When to use:** When the briefing has a juicy datapoint and you can find or make a chart for it. Charts get saved; saves boost reach.

**Example:**
```
[Chart: cost-per-1k-tokens for top frontier models, monthly, last 18 months]

Inference cost is dropping ~85% per year.

What people miss: the floor isn't the model — it's the GPU.

Even if model architectures stop improving tomorrow, a 2027 H200 successor running today's Sonnet would be 4–5× cheaper than today's pricing.

Plan your unit economics around 2027 inference cost, not 2026.

The features you can't build today will be trivial in twelve months.

What's a feature you've shelved because of token cost?
```

---

## LI-8 · Selfie / Picture + Story

**What it is:** A photo (you, your team, a whiteboard, a conference, a screen) with a story that the photo grounds.

**Structure:**
- Photo
- One-line scene-setting hook
- The story (5–8 short lines)
- The lesson it taught you
- A line that connects to your reader's life

**When to use:** Only when the photo is real and the story is real. Never fabricate.

**Example:**
```
[Photo: whiteboard covered in arrows and crossed-out boxes]

This is what our agent architecture looked like at hour 3 of a debugging session.

We had a multi-step agent that was randomly skipping its second tool call.

Turned out: the system prompt was 14k tokens.
And the tool descriptions were AT THE BOTTOM.
The model was forgetting them.

The fix took 4 minutes — move tool descriptions to the top.
The diagnosis took 4 hours.

Lesson: when an agent ignores a tool, check tool position before you blame the model.

You'd be amazed how often "the model is bad" is actually "your prompt is bad."
```

---

## LI-9 · Thesis Reveal / Mind-Shift

**What it is:** A post about a moment your worldview changed. Ends with the new lens you now use.

**Structure:**
- "I used to believe X."
- Why you believed it (the logic)
- The thing that broke the belief (a specific incident, datapoint, conversation)
- What you believe now
- How you'd act differently if you were starting over

**When to use:** When you have a real before-and-after story. Forces vulnerability — which earns reach.

**Example:**
```
I used to believe agents needed memory systems.

Vector DBs for long-term recall.
Episodic memory for session state.
Reflection loops for self-improvement.

Spent six months building one.

Then a junior engineer on our team replaced it with: "just put the relevant docs in the system prompt."

Cost: 1.5× the tokens.
Latency: same.
Quality: better.

Turns out — a 200k context window IS a memory system.

If I were starting over today, I'd default to "stuff the context, cache it, ship it" — and only build memory infrastructure when I've proven I need it.

What's a piece of infra you built that you'd skip if you started over?
```

---

## LI-10 · Branded Data Visual + Provocative Question

**What it is:** Like LI-7, but the chart is the post — text is minimal, the question does the work.

**Structure:**
- Strong visual (chart, table, infographic)
- Two-line caption max
- One provocative question

**When to use:** When the data is so clean it doesn't need explanation. Lets the comments fill in the analysis.

**Example:**
```
[Visual: bar chart, "% of YC W26 batch using Claude vs GPT vs open-source", with a dramatic delta]

Top YC batch model preference, plotted.

Does this tell you about the models — or about the developer experience around them?
```

---

## LI-11 · Profile / Character Story

**What it is:** A short profile of a person doing interesting work. Builds your network and theirs at the same time.

**Structure:**
- Their name + what they did
- Why it matters
- One specific detail that humanizes them
- The lesson their story teaches
- A tag or mention if appropriate

**When to use:** When the briefing surfaces an actual interesting person you can speak to credibly. Don't profile randos.

**Example:**
```
Andrej Karpathy spent his Sunday building a tokenizer in pure Python — and streaming it on YouTube for 4 hours.

Not because he had to.
Because he wanted to remember what it felt like to write code without an LLM.

The lesson buried in this:

The best AI builders are people who deeply understand what AI is replacing.

They write code without it.
They label data by hand.
They run the eval manually before automating it.

Then when they automate, they automate the right thing.

If you're building AI products, spend one day a month doing the work the AI does. You'll ship better tools.
```

---

## LI-12 · Short Video — Hot Take

**What it is:** A 30–60 second talking-head video posting a strong opinion. The body of the post is a transcript-tease, not the full take.

**Structure (for the post body):**
- Provocative one-liner that mirrors the video's first frame
- 2–3 lines that tease the argument without giving it away
- "Full take in the video below" or similar
- A question

**Structure (for the video script):**
- Hook (5 sec): the contrarian claim
- Setup (10 sec): what most people think
- Pivot (10 sec): why they're wrong
- Punchline (10–15 sec): your sharper frame
- CTA (5 sec): "what's your take?"

**When to use:** When you have a strong take and 5 minutes to film. Video posts often outperform text on AI topics right now.

**Example (post body):**
```
The "AI agents replace SaaS" thesis is going to age badly.

Most people think SaaS is a UI problem and agents will eat it.

It's not. SaaS is a workflow + permissions + audit problem. Agents are nowhere close.

Full take in the video — 45 seconds.

What's a SaaS category you'd bet survives the agent wave?
```

**Example (video script):**
```
[0:00, looking at camera] AI agents are NOT going to replace SaaS. Here's why everyone gets this wrong.

[0:05] The narrative is: agents will do the work, and dashboards become irrelevant.

[0:15] But SaaS isn't a dashboard. SaaS is a system of record. It's permissions. It's audit trails. It's the org chart encoded in software.

[0:30] Agents can DRIVE SaaS — fine. But the SaaS layer underneath isn't going anywhere. The companies that win are the ones whose product becomes the system the agents talk to.

[0:50] What SaaS category do you think survives the agent wave? Drop it below.
```
