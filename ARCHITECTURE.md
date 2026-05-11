# Architecture Overview: Credex AI Spend Audit

## Stack Definition
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS + Tailwind Core (Bespoke Design Tokens)
- **Database**: Supabase (PostgreSQL + Auth)
- **AI Engine**: Anthropic Claude 3.5 Sonnet (via SDK)
- **Testing**: Vitest (Unit & Logic Testing)

## System Components

### 1. The Audit Engine (`src/lib/audit-engine.ts`)
The heart of the application. It performs three primary operations:
- **Redundancy Check**: Cross-references IDEs (Cursor/Copilot) and Chat interfaces (ChatGPT/Claude) to find functional overlaps.
- **Billing Optimization**: Analyzes monthly vs. annual spreads to identify quick-win savings.
- **Credex Credit Logic**: Triggers "Credex Infrastructure Credits" recommendations for high-spend entities ($500+ annual savings).

### 2. Data Persistence Flow
1. **Input**: User submits tool usage via `AuditForm`.
2. **Execution**: `runAudit` processes inputs and generates a JSON result.
3. **Persistence**: The result is saved to the `audits` table in Supabase via `POST /api/audit`.
4. **AI Summary**: A background call to Anthropic generates the executive narrative based on the specific audit data.
5. **Retrieval**: The `AuditResultsPage` fetches the stored JSON and displays it with a high-fidelity visualizer.

### 3. Design System (`src/app/globals.css`)
- **Tokens**: Centralized color palette using Emerald-800 for the Credex brand.
- **Typography**: Inter (Sans-serif) for primary UI, JetBrains Mono (Monospace) for all financial figures.
- **Layout**: Grid-based "Institutional" layout with strict spacing and minimalist borders.

## Security & Performance
- **Server-Side Generation (SSG)**: Public audit pages are server-rendered for speed and SEO.
- **Rate Limiting**: API routes are protected to prevent abuse of the Anthropic SDK.
- **Type Safety**: End-to-end TypeScript types for all audit and pricing data.

## Deployment Pipeline
- **CI**: GitHub Actions run linting and unit tests on every PR.
- **Hosting**: Vercel (Edge-optimized).
- **Environment**: Strict separation of Production and Preview environments.
