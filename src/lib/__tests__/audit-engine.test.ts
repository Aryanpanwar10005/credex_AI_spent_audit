import { describe, it, expect } from 'vitest';
import { runAudit, UserInput } from '../audit-engine';

describe('Audit Engine', () => {
  it('should detect overlap between Cursor and GitHub Copilot', () => {
    const inputs: UserInput[] = [
      { toolKey: 'cursor', planName: 'Pro', teamSize: 5, monthlySpend: 100, usageLevel: 'high' },
      { toolKey: 'github_copilot', planName: 'Individual', teamSize: 5, monthlySpend: 50, usageLevel: 'high' },
    ];

    const result = runAudit(inputs);
    const overlapRec = result.recommendations.find(r => r.type === 'overlap');
    
    expect(overlapRec).toBeDefined();
    expect(overlapRec?.toolName).toBe('GitHub Copilot');
    expect(overlapRec?.potentialSavings).toBe(50);
  });

  it('should suggest annual billing for Cursor Pro', () => {
    const inputs: UserInput[] = [
      { toolKey: 'cursor', planName: 'Pro', teamSize: 1, monthlySpend: 20, usageLevel: 'medium' },
    ];

    const result = runAudit(inputs);
    const billingRec = result.recommendations.find(r => r.type === 'billing');
    
    expect(billingRec).toBeDefined();
    expect(billingRec?.potentialSavings).toBe(4); // 20 - 16
  });

  it('should suggest Team plan for large groups on individual Claude accounts', () => {
    const inputs: UserInput[] = [
      { toolKey: 'claude', planName: 'Pro', teamSize: 10, monthlySpend: 400, usageLevel: 'medium' },
    ];
    const result = runAudit(inputs);
    const billingRec = result.recommendations.find(r => r.issue === 'Subscription Fragmentation');
    expect(billingRec).toBeDefined();
    expect(billingRec?.potentialSavings).toBe(100); // 400 - (30 * 10)
  });

  it('should correctly calculate annual savings', () => {
    const inputs: UserInput[] = [
      { toolKey: 'cursor', planName: 'Pro', teamSize: 1, monthlySpend: 20, usageLevel: 'medium' },
      { toolKey: 'github_copilot', planName: 'Individual', teamSize: 1, monthlySpend: 10, usageLevel: 'medium' },
    ];

    const result = runAudit(inputs);
    
    expect(result.monthlySavings).toBe(14);
    expect(result.annualSavings).toBe(168);
  });

  it('should identify Credex credit eligibility for high spend', () => {
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
