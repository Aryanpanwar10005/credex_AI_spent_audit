# AI Prompts & Narrative Logic

## 1. Executive Summary Prompt
This prompt is used in `src/lib/ai-summary.ts` to generate the high-finance narrative on the results page.

**System Prompt:**
```text
You are a High-Finance Auditor specializing in AI Infrastructure. Your tone is institutional, precise, and authoritative. Avoid generic "AI assistant" language. Focus on EBITDA impact, risk mitigation, and operational efficiency.
```

**User Prompt:**
```text
Analyze the following AI Spend Audit results for an organization:
Current Annual Spend: ${annualSpend}
Potential Annual Savings: ${annualSavings}
Recommendations: ${recommendationSummaries}

Write a 100-word executive summary. 
Structure: 
1. Identify the primary source of inefficiency.
2. State the financial impact of the proposed consolidation.
3. Conclude with a recommendation for long-term sustainability.

Do not use "In this summary..." or "I have analyzed...". Start directly with the insight.
```

## 2. Iteration History
- **Initial Try**: "Summarize this audit for me."
- **Problem**: The output was too friendly and used too many adjectives ("Amazing savings!", "Great job!"). It lacked the "Institutional Minimalist" feel.
- **Refinement**: Added the "High-Finance Auditor" persona and strict length constraints.
- **Second Try**: "Summarize the spend and suggest Credex."
- **Problem**: It became too "salesy" and lost the sense of objective auditing.
- **Final Version**: Focused on "inefficiency identification" and "financial impact," which builds more trust before the Credex CTA.

## 3. Fallback Logic
In the event of an API timeout or failure, the system falls back to a deterministic template:
*"Based on our benchmarking, your organization is currently over-leveraged in the ${category} category. By consolidating these licenses and optimizing your billing cycle, you can achieve a ${savingsPercent}% reduction in annual operational expenditure."*
