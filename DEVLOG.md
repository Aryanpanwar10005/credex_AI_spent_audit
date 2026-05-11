# Devlog: Credex AI Spend Audit

## Day 1 — 2026-05-05
**Hours worked:** 4
**What I did:** Initial project scoping and market research. Analyzed the AI tool landscape in 2026. Set up the Next.js 14 project structure and defined the core design system (Institutional Minimalist).
**What I learned:** The 2026 AI market is highly fragmented; users are suffering from "subscription fatigue" as every tool converges on similar feature sets.
**Blockers / what I'm stuck on:** Deciding between a pure rule-based engine and an LLM-driven one.
**Plan for tomorrow:** Finalize the pricing registry and start the audit engine logic.

## Day 2 — 2026-05-06
**Hours worked:** 5
**What I did:** Created `PRICING_DATA.md` with verified URLs. Built the first version of the audit engine in TypeScript. Implemented redundancy detection for IDEs (Cursor vs. Copilot).
**What I learned:** Deterministic math is better for trust than LLM estimation for financial audits.
**Blockers / what I'm stuck on:** Handling "API direct" pricing which is usage-based and variable.
**Plan for tomorrow:** Build the multi-tool input form and integrate Supabase.

## Day 3 — 2026-05-07
**Hours worked:** 6
**What I did:** Built the `AuditForm` with dynamic seat-count logic. Set up Supabase tables for `audits` and `leads`. Implemented the POST endpoint for audit submission.
**What I learned:** React state management for multi-row dynamic forms requires careful indexing to avoid stale closures.
**Blockers / what I'm stuck on:** Supabase RLS policies for public audit retrieval.
**Plan for tomorrow:** Create the results page and visualizer.

## Day 4 — 2026-05-08
**Hours worked:** 5
**What I did:** Designed and implemented the high-fidelity results page. Added the "Cost Efficiency Analysis" bar chart using CSS transitions.
**What I learned:** "Terminal-luxury" design (Monospace + Emerald) creates a psychological sense of "audit authority."
**Blockers / what I'm stuck on:** Making the visualization responsive on mobile viewports.
**Plan for tomorrow:** Integrate Anthropic SDK for personalized summaries.

## Day 5 — 2026-05-09
**Hours worked:** 6
**What I did:** Integrated Claude 3.5 Sonnet to generate executive narratives. Drafted `GTM.md` and `ECONOMICS.md`. Conducted two user interviews via cold DMs.
**What I learned:** Narrative is what converts. People agree with the math but buy the *story* the AI tells about their inefficiency.
**Blockers / what I'm stuck on:** Prompt engineering for a "high-finance" tone.
**Plan for tomorrow:** Finalize documentation and add Framer Motion polish.

## Day 6 — 2026-05-10
**Hours worked:** 5
**What I did:** Added Framer Motion to the form for a premium feel. Completed `REFLECTION.md` and `METRICS.md`. Wrote the unit test suite with Vitest.
**What I learned:** 100% test coverage on the engine logic is non-negotiable for a financial tool.
**Blockers / what I'm stuck on:** Testing the Credex credit threshold logic.
**Plan for tomorrow:** Final recheck, GitHub repo creation, and submission.

## Day 7 — 2026-05-11
**Hours worked:** 4
**What I did:** Final production hardening. Fixed a bug in the Credex eligibility threshold. Created `LANDING_COPY.md` and `PROMPTS.md`. Set up the CI/CD workflow. Pushed to GitHub.
**What I learned:** Shipping is 90% logic and 10% extreme attention to detail in documentation.
**Blockers / what I'm stuck on:** None. Ready for launch.
**Plan for tomorrow:** Project submission.
