# Credex AI Spend Audit

A production-grade financial intelligence tool designed to identify, analyze, and optimize enterprise AI subscription spend. Built for the Credex WebDev 2026 Round 1 assignment.

## Overview

AI Spend Audit helps organizations uncover "shadow AI" spend, identify redundant tool overlaps (e.g., Cursor vs. GitHub Copilot), and optimize seat utilization across the most popular AI platforms in 2026.

## Key Features

- **Automated Audit Engine**: Logic-driven analysis of tool usage vs. plan tiers.
- **Institutional Design**: High-fidelity UI built on a rigid 4px grid system with emerald green accent markers.
- **Pricing Intelligence**: Up-to-date 2026 pricing registry for major AI providers.
- **Lead Capture**: Integrated conversion funnel for institutional auditing services.

## Live Links
- **Deployed URL**: [https://credex-ai-audit.vercel.app](https://credex-ai-audit.vercel.app)
- **Video Walkthrough**: [Loom / Youtube Link Placeholder]

## Tech Stack

- **Core**: Next.js 14+ (App Router), TypeScript.
- **Styling**: Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL) for persistence.
- **Intelligence**: Anthropic Claude API for personalized summary generation.
- **Email**: Resend for transactional audit delivery.

## Project Structure

- `/src/app`: Next.js App Router pages and layouts.
- `/src/lib`: Core logic (Audit Engine, Pricing Registry).
- `/local`: Internal planning, research, and technical specifications (Git-ignored).

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technical & Product Decisions

### 1. Deterministic Engine vs. LLM Logic
**Decision**: Logic-heavy TypeScript for calculations; LLM only for narrative.  
**Trade-off**: Increases development time for the registry but ensures 100% audit accuracy and CFO-ready data integrity.

### 2. Bespoke CSS vs. Component Library
**Decision**: Vanilla CSS tokens and custom components over Shadcn/UI.  
**Trade-off**: Required more manual styling effort but achieved a unique "Institutional Minimalist" brand identity that avoids the "AI-generated" look.

### 3. Public Audit IDs
**Decision**: Using UUID-based public routes (`/audit/[id]`) for report sharing.  
**Trade-off**: Increases database complexity but creates a high-conversion viral loop within organizations.

### 4. Privacy-First Manual Entry
**Decision**: Manual seat-count entry instead of OAuth-based tool integrations.  
**Trade-off**: Higher friction for the user, but eliminates the massive security/trust hurdle of requesting access to corporate AI accounts.

### 5. Monospace Data Paradigm
**Decision**: Use of `JetBrains Mono` for all financial figures.  
**Trade-off**: Breaks the "sleek consumer" aesthetic in favor of "professional audit" clarity, which builds higher perceived authority.

## Development & Compliance

This project follows strict folder governance. All internal research and planning files are maintained in the `local/` directory and are excluded from version control to ensure a clean production repository.
