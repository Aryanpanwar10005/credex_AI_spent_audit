# Reflection: Credex AI Spend Audit

---

## Q1. The Hardest Bug — and How I Debugged It

The most complex bug was in the **redundancy detection logic** inside `src/lib/audit-engine.ts`. The engine was flagging too many tool pairs as redundant — for example, it would suggest dropping ChatGPT Plus for anyone who had Claude Pro, treating them as 100% interchangeable. Early testers found the recommendations too aggressive and "felt wrong."

My first hypothesis was that the category mapping was too coarse. I had tagged both as `chat` and the engine saw any two tools in the same category as redundant. I started by logging every comparison pair to the console and running the engine manually against a 10-tool stack. That confirmed the hypothesis but not the root cause — the category overlap was intentional; the problem was the absence of **use-case weighting**.

I tried a flag-based approach: if the user's primary use case was `coding`, ChatGPT weight dropped significantly vs. Cursor or Claude Code. But this was brittle — it created a hardcoded if-else tree that would need constant maintenance.

What actually worked was switching to a **redundancy probability score** (0.0–1.0) computed from: tool category match × use-case fit × seat count ratio. If the score exceeded 0.7, the engine surfaced a redundancy recommendation. Below 0.5, it surfaced a "consider consolidating" soft note. This meant the engine could say "you probably don't need both ChatGPT Team and Claude Max for a 4-person research team" — defensible, not aggressive.

The key learning: financial reasoning requires confidence intervals, not binary logic. A finance-literate person agrees with "probably redundant given your use case" more than "these are the same, delete one."

---

## Q2. A Decision I Reversed Mid-Week

On Day 2, I planned to build a **persistent dashboard** — a logged-in experience where users could track AI spend month-over-month, see trend lines, and get re-audit alerts when vendor pricing changed. I designed a basic auth flow with Supabase Auth and sketched out a `/dashboard` route.

I reversed this completely on Day 3 afternoon.

The pivot trigger was re-reading the assignment brief: *"No login required to use the tool. Email is captured after value is shown, never before."* A dashboard requires login — which means friction before value. Every SaaS conversion funnel study I've read confirms this kills cold traffic. A user arriving from a tweet or Hacker News will not create an account to see if they might be overspending.

More importantly, I reframed who the tool actually was for. The dashboard mental model assumes a returning, engaged user. But the highest-value moment in this tool's lifecycle is the *first audit* — when a founder sees "$4,800/year in redundant seats" for the first time. That moment of shock is the conversion event. The shareable URL captures that moment and propagates it. A dashboard would have diluted the entire design effort toward a retention feature nobody would use at launch.

The right scope was: one great session, one shareable artifact, one lead captured. Dropping the dashboard freed 6 hours I reinvested entirely into the results page's visual quality — which is the page that gets screenshotted. That was the correct trade.

---

## Q3. What I Would Build in Week 2

**Priority 1: Real-time usage integration via browser extension.** The biggest gap in the current tool is that all input is self-reported. A $20/month ChatGPT Plus user might actually be using it for 80% of their team's creative work and it's irreplaceable — or they opened it twice last month. A lightweight Chrome extension that reads billing dashboard pages (OpenAI, Anthropic, Cursor) and pre-fills the audit form would eliminate the #1 objection: "I don't know my exact numbers." This is technically feasible in 48 hours and would dramatically improve recommendation quality.

**Priority 2: Credex credit calculator as a conversion layer.** When the audit surfaces >$500/month in savings, we currently show a CTA. Week 2 would turn this into a real calculator: "If you moved your Claude Enterprise contract through Credex, here's the exact discount based on current inventory." This transforms a vague CTA ("book a consultation") into a concrete offer ("save $3,200 on your next 12-month contract"). That specificity dramatically improves conversion.

**Priority 3: Webhook for Credex CRM.** Every high-savings lead currently lands in Supabase but requires manual outreach. A Zapier or native webhook to push leads with `savings > $500` directly into Credex's CRM (with audit data as context) would close the loop from tool to revenue without any ops overhead.

---

## Q4. How I Used AI Tools

I used three AI tools across the week, for different tasks, with different levels of trust.

**Antigravity (Gemini-powered IDE)** was my primary pair programmer. I used it for component scaffolding, API route boilerplate, and debugging type errors. What I didn't trust it with: the audit engine's redundancy logic and pricing data. Every number in `PRICING_DATA.md` was manually verified against official vendor pages — the AI's training data for pricing is months old and SaaS pricing changes frequently. I caught one specific error here: the AI generated a Cursor Business price of `$19/user/month`. I flagged this as suspicious, checked cursor.sh/pricing, and confirmed it was `$40/user/month`. Had I not caught this, the audit engine would have given systematically wrong recommendations for one of the most common tools in the stack.

**Claude 3.5 Sonnet** I used for brainstorming the GTM strategy and ECONOMICS.md unit economics model. It's excellent at reasoning through conversion funnel math. I did not trust it for the user interview synthesis — that would have defeated the entire purpose of actually talking to people.

**Gemini 1.5 Pro** I used for document structuring and markdown formatting. Reliable for this; no notable failures.

The pattern across all three: AI for structure, scaffolding, and reasoning; human judgment for numbers, user insights, and any decision where a wrong answer would be confidently wrong rather than obviously wrong.

---

## Q5. Self-Rating (1–10)

**Discipline: 7/10.**  
I started the project on Day 1 and maintained daily progress across all 7 days. The one honest gap: I developed locally from May 5–10 without pushing to a remote repository — the GitHub history reflects commits from May 11 onward. I made this decision consciously (the codebase was in a heavily iterative state mid-week) and disclosed it fully in the `DEVLOG.md` preamble. The work happened; the timestamps are a function of when I felt it was stable enough to push, not when I wrote it. I'm rating myself 7 rather than higher because the discipline rubric specifically rewards spread-out commits, and I understand why — it's a genuine signal of daily work habits.

**Code Quality: 8/10.**  
The audit engine is clean, well-typed, and fully testable. The API routes are straightforward. The weakest area is the results page component — it's doing too much rendering work in a single file and should be decomposed into smaller display components. A refactor to extract `SavingsHero`, `ToolBreakdownRow`, and `CredexCTA` as isolated components would make testing and iteration easier. I know exactly what to fix; I made a conscious scope decision to ship over refactor.

**Design Sense: 9/10.**  
The "Institutional Minimalist" design is genuinely differentiated. The JetBrains Mono + Inter pairing, the emerald-800 accent on a near-black background, and the strict grid system produce something that reads as professional rather than "startup demo." The one miss: mobile responsiveness on the results table could be tighter; it requires horizontal scroll on narrow viewports rather than reflowing gracefully.

**Problem-Solving: 8/10.**  
The redundancy scoring system and the graceful fallback architecture for the AI summary are good examples of thinking beyond the happy path. The place I fell short: I didn't implement any retry logic for the Cerebras API — a transient failure falls back to template immediately rather than retrying once. That's a solvable problem I should have caught in the first E2E test.

**Entrepreneurial Thinking: 9/10.**  
The GTM, ECONOMICS, and USER_INTERVIEWS documents reflect genuine founder-mode thinking about distribution, unit economics, and user psychology. The insight that the shareable URL is the *marketing page* — not a utility feature — shaped the entire design direction. Where I'd score myself lower: I didn't attempt any of the bonus features. A PDF export or embeddable widget would have demonstrated scope ambition. The MVP quality is high; the breadth is not.
