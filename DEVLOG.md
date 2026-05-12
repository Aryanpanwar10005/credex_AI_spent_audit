# Devlog: Credex AI Spend Audit

---

> **Note on Git History**
>
> All development from Day 1 (May 5) through Day 6 (May 10) was conducted locally in a private development environment on my machine. I chose not to push to a remote repository mid-build because the codebase was in a heavily iterative state — I was refactoring the audit engine logic daily and didn't want an unstable branch history.
>
> The GitHub repository was initialized and first pushed on **May 11**, once the core MVP was feature-complete and passing all tests locally. As a result, the public git history reflects commits from May 11 onward. The devlog dates accurately reflect when the work was done; the commit timestamps reflect when it was pushed. This is not backdating — both facts are stated transparently here.
>
> I flagged this in `REFLECTION.md` (Q1 — discipline rating) and note it here so reviewers have full context.

---

## Day 1 — 2026-05-05

**Hours worked:** 4
**What I did:** Read the assignment brief three times. Spent the first hour resisting the urge to open VS Code — wanted to fully understand the product problem before writing a line. Mapped the user journey on paper: cold visitor → input form → results → lead capture → shareable URL. Identified the core product risk: if the audit recommendations aren't defensible to a finance person, the whole thing falls apart. Decided on Next.js 14 App Router (server components + API routes in one repo) and TypeScript strict mode. Scaffolded the project with `create-next-app`. Defined the design direction: "Institutional Minimalist" — high information density, near-black background, JetBrains Mono for all financial figures.
**What I learned:** The 2026 AI tool market is more fragmented than I expected. Almost every tool now positions itself as an "all-in-one AI workspace." This actually makes the redundancy detection *more* valuable, not less — teams are paying for overlapping tools without realizing it.
**Blockers / what I'm stuck on:** Undecided on the core audit engine architecture: pure rule-based TypeScript vs. LLM-driven recommendations. Both have a defensibility argument. Need to resolve this tomorrow before touching the pricing registry.
**Plan for tomorrow:** Decide on engine architecture, build the pricing registry, and write the first audit rule.

---

## Day 2 — 2026-05-06

**Hours worked:** 5
**What I did:** Resolved the engine architecture debate: **deterministic TypeScript rules, LLM for narrative only.** A CFO needs to verify every number. An LLM that says "you'd save $200 by switching" and is wrong by 15% is worse than no recommendation at all — it destroys trust. Built `PRICING_DATA.md` with verified URLs for all 8 required tools. Spent 90 minutes just on pricing research — more than expected. Implemented the first version of the audit engine in `src/lib/audit-engine.ts` with redundancy detection for IDE tools (Cursor vs. GitHub Copilot).
**What I learned:** GitHub Copilot Enterprise pricing (`$39/user/month`) is not prominently displayed on their main pricing page — it's buried in a comparison table. This kind of pricing opacity is exactly what the tool should surface. Deterministic math is better for trust than LLM estimation for financial audits.
**Blockers / what I'm stuck on:** Handling "API direct" pricing for Anthropic and OpenAI, which is pure usage-based. No fixed monthly cost means the audit engine can't make a plan comparison — it can only flag high usage-based spend against a team-plan alternative. Decided to use a configurable estimated monthly spend field for API tools.
**Plan for tomorrow:** Build the multi-tool input form and integrate Supabase for audit persistence.

---

## Day 3 — 2026-05-07

**Hours worked:** 6
**What I did:** Built the `AuditForm` component with dynamic tool rows — each row captures tool name, plan, seats, and monthly spend. Integrated Supabase: created the `audits` and `leads` tables with RLS policies. Implemented `POST /api/audit` which runs the engine and persists the result. Spent the last 2 hours debugging a form state bug.
**What I learned:** React state management for multi-row dynamic forms requires precise indexing. The bug was in the seat count update handler — I was mutating the wrong index in the `inputs` array because the `onChange` closure was capturing a stale reference to the index from the time the handler was created, not the current render. Fixed by using a functional state update (`setInputs(prev => ...)`) and deriving the new array immutably.
**Blockers / what I'm stuck on:** Supabase RLS policies for the public audit retrieval. The policy needs to allow anonymous reads on `audits` but only expose the `tools` and `savings` columns — not `email` or `company`. Getting the column-level security right took longer than expected.
**Plan for tomorrow:** Create the results page and visualizer. The results page is the viral asset — it needs to look shareable.

---

## Day 4 — 2026-05-08

**Hours worked:** 5
**What I did:** Designed and implemented the high-fidelity results page at `/audit/[publicId]`. Built the hero section (total monthly + annual savings, large and clear), the per-tool breakdown table, and the conditional Credex CTA (triggered when savings > $500/month). Added a "You're spending well" path for optimized stacks. Also cold-DM'd potential users for interviews — got two responses same day, scheduled for tomorrow.
**What I learned:** The design choice of JetBrains Mono + emerald-800 on near-black creates a "terminal authority" effect that makes the savings figures feel more credible. I tested an alternative with Inter (the body font) for the numbers — it looked like a marketing page, not an audit. The monospace dissonance is intentional and right.
**Blockers / what I'm stuck on:** Mobile responsiveness on the results table. The per-tool breakdown has 5 columns (tool, plan, current spend, recommended action, savings) which doesn't reflow gracefully below 768px. Added horizontal scroll as a stopgap — needs a proper card-based mobile layout, but that's a polish-pass problem, not a blocker.
**Plan for tomorrow:** Integrate an LLM API for the personalized executive summary. Conduct user interviews. Draft GTM.md and ECONOMICS.md.

---

## Day 5 — 2026-05-09

**Hours worked:** 6
**What I did:** Integrated the Anthropic API (`claude-3-5-sonnet-20241022`) to generate the ~100-word executive summary. Wrote the full prompt in `PROMPTS.md` — took four iterations to get the "high-finance" tone right. First draft was too casual ("looks like you're overpaying!"), last draft sounds like something a McKinsey analyst would write. Conducted all three user interviews (two from yesterday's outreach, one from a Slack group). Drafted `GTM.md` and `ECONOMICS.md` based on what users told me. Completed `USER_INTERVIEWS.md`.
**What I learned:** The most surprising user insight: founders don't audit their AI tools because they don't feel *authorized* to question the tools their engineers chose. The spend guilt is real, but challenging the stack feels like undermining the team. The audit gives them a neutral third-party "permission slip" to have that conversation. This completely changed how I wrote the Credex CTA copy — it's not "you're wasting money," it's "here's what the data says."
**Blockers / what I'm stuck on:** Prompt engineering for the high-finance tone is harder than expected. Getting the AI to cite specific numbers from the audit (not hallucinate new ones) required explicit instruction in the system prompt: "Use ONLY the numbers provided in the audit JSON. Do not calculate or invent values."
**Plan for tomorrow:** Add Framer Motion polish to the form, write the Vitest test suite, complete remaining documentation files.

---

## Day 6 — 2026-05-10

**Hours worked:** 5
**What I did:** Added Framer Motion micro-interactions: staggered tool row entry on the audit form, savings reveal animation on the results page hero. Completed `REFLECTION.md`, `METRICS.md`, and `LANDING_COPY.md`. Wrote the full Vitest unit test suite — 5 tests covering the audit engine: plan optimization, redundancy detection, Credex threshold trigger, annual savings calculation, and the "spending well" path. All 5 pass.
**What I learned:** 100% test coverage on the engine logic is non-negotiable for a financial tool. I also discovered during testing that the Credex eligibility threshold had an off-by-one error — the condition was `savings >= 500` when it should have been `savings > 500`. Small but meaningful: a user with exactly $500/month savings was getting the Credex CTA when they shouldn't. Fixed.
**Blockers / what I'm stuck on:** The Anthropic API occasionally takes 3–5 seconds to respond, which makes the results page feel slow on first load. Considering moving the summary generation to a background job — but that adds complexity. Will evaluate tomorrow during the final check.
**Plan for tomorrow:** Final recheck of all 12 documentation files, create GitHub repo, set up CI/CD, and push everything for submission.

---

## Day 7 — 2026-05-11

**Hours worked:** 4
**What I did:** Created the public GitHub repository and pushed the full codebase. Set up the `.github/workflows/ci.yml` GitHub Actions pipeline (lint + vitest on every push to `main`). Provisioned Supabase production project and ran `internal/schema.sql`. Set up Resend transactional email. Configured all environment variables in Vercel and deployed to production. Final review pass on all 12 required documentation files. Fixed a minor OG metadata issue — the `og:image` was pointing to a relative path that didn't resolve on social preview scrapers; switched to an absolute URL.
**What I learned:** Shipping is 90% logic and 10% extreme attention to detail in documentation. The gap between "works locally" and "works for a reviewer who opens it cold" is bigger than it seems — especially for OG previews, environment variables, and Supabase RLS policies that behave differently in production vs. development.
**Blockers / what I'm stuck on:** Resend domain verification for `credex.rocks` is pending DNS propagation. Transactional emails are queued but not delivering until DNS clears. Not blocking submission — lead capture to Supabase is working correctly.
**Plan for tomorrow:** Monitor CI pipeline, verify DNS for Resend, and address any issues flagged in the first production E2E test.

---

## Day 8 — 2026-05-12 *(Post-submission hardening)*

**Hours worked:** 6
**What I did:** Migrated the AI summary engine from Anthropic Claude to **Cerebras Cloud SDK** (`llama3.1-8b`). The motivation: Cerebras's inference is approximately 10× faster than Anthropic for this model size — the 3–5 second latency on the results page dropped to under 500ms. The prompt and fallback logic were preserved; only the SDK and model changed. Updated all documentation (`README.md`, `ARCHITECTURE.md`, `REFLECTION.md`, `TESTS.md`) to reflect the new integration. Added `localStorage` persistence to `AuditForm` so form state survives page reloads. Added honeypot fields to both `AuditForm` and `LeadForm` for bot abuse protection. Fixed a CI lint failure (`react-hooks/set-state-in-effect` rule) and confirmed GitHub Actions run green. Conducted a full E2E production test on the live Vercel URL.
**What I learned:** The decision to not hardcode the Anthropic SDK too deeply paid off — the migration to Cerebras took under an hour because all AI logic was isolated in `src/lib/ai-summary.ts`. Abstraction boundaries matter, even in a week-long project.
**Blockers / what I'm stuck on:** Resend DNS still pending. Everything else is green.
**Plan for tomorrow:** Final documentation polish and project submission.
