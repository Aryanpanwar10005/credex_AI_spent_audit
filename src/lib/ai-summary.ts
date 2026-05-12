import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { AuditResult } from './audit-engine';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY || '',
});

export async function generateAuditSummary(result: AuditResult): Promise<string> {
  if (!process.env.CEREBRAS_API_KEY) {
    return "AI Summary is currently unavailable. Please check your configuration.";
  }

  const prompt = `
    You are an expert financial auditor specialized in AI infrastructure and SaaS spend.
    Review the following audit results and provide a concise, professional, and actionable executive summary (max 150 words).
    Focus on the highest impact savings and the strategic logic behind the recommendations.
    Maintain an institutional, high-finance tone. Avoid marketing fluff.

    Audit Results:
    - Annual Current Spend: $${result.totalCurrentSpend * 12}
    - Annual Potential Savings: $${result.annualSavings}
    - Number of Tools: ${result.recommendations.length}
    - Recommendations: ${JSON.stringify(result.recommendations.map(r => ({ tool: r.toolName, issue: r.issue, savings: r.potentialSavings })))}

    Provide the summary in a single paragraph.
  `;

  try {
    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3.1-8b',
      max_tokens: 300,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const choices = completion.choices as any[];
    const content = choices[0]?.message?.content;
    
    if (content) {
      return content;
    }
    return "Could not generate summary.";
  } catch (error) {
    console.error('AI Summary Error:', error);
    return "The AI analysis engine is currently processing a high volume of requests. Please refer to the technical breakdown below.";
  }
}
