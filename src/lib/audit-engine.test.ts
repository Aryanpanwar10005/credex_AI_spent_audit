import { describe, it, expect } from 'vitest';
import { runAudit, UserInput } from './audit-engine';

describe('Audit Engine Logic', () => {
  it('detects redundant IDE licenses (Cursor + GitHub Copilot)', () => {
    const inputs: UserInput[] = [
      { toolKey: 'cursor', planName: 'Pro', teamSize: 1, monthlySpend: 20, usageLevel: 'medium' },
      { toolKey: 'github_copilot', planName: 'Individual', teamSize: 1, monthlySpend: 10, usageLevel: 'medium' }
    ];

    const result = runAudit(inputs);
    const overlapRec = result.recommendations.find(r => r.type === 'overlap');
    
    expect(overlapRec).toBeDefined();
    expect(overlapRec?.toolName).toBe('GitHub Copilot');
    expect(result.annualSavings).toBeGreaterThan(0);
  });

  it('suggests annual billing conversion for monthly plans', () => {
    const inputs: UserInput[] = [
      { toolKey: 'chatgpt', planName: 'Plus', teamSize: 5, monthlySpend: 100, usageLevel: 'medium' }
    ];

    const result = runAudit(inputs);
    const billingRec = result.recommendations.find(r => r.type === 'billing');
    
    expect(billingRec).toBeDefined();
    expect(billingRec?.issue).toContain('Monthly Billing');
  });

  it('identifies Credex credit eligibility for high spend', () => {
    // Ensuring some baseline savings so the Credex logic triggers
    const inputs: UserInput[] = [
      { toolKey: 'cursor', planName: 'Pro', teamSize: 50, monthlySpend: 1000, usageLevel: 'high' },
      { toolKey: 'github_copilot', planName: 'Individual', teamSize: 50, monthlySpend: 500, usageLevel: 'high' }
    ];

    const result = runAudit(inputs);
    const credexRec = result.recommendations.find(r => r.type === 'credex');
    
    expect(credexRec).toBeDefined();
    expect(result.isHighValueAudit).toBe(true);
  });
});
