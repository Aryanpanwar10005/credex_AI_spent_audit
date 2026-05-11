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
      { toolKey: 'claude', planName: 'Pro', teamSize: 10, monthlySpend: 200, usageLevel: 'medium' },
    ];

    // Note: Team plan is $30/user/mo, but I need to check my logic.
    // Wait, in my pricing.ts, Claude Team is $30/user/mo.
    // 10 users * $20 = $200.
    // 10 users * $30 = $300.
    // My logic says: if (teamCost < currentCost). So it shouldn't suggest it here.
    // Let's adjust spend to $400 (maybe enterprise?) or change logic.
    
    // If they were paying $40/user for some reason:
    const inputs2: UserInput[] = [
      { toolKey: 'claude', planName: 'Pro', teamSize: 10, monthlySpend: 400, usageLevel: 'medium' },
    ];
    const result = runAudit(inputs2);
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
    // Overlap savings: 10 (Copilot)
    // Billing savings: 4 (Cursor Annual)
    // Total monthly savings: 14
    // Annual: 14 * 12 = 168
    
    expect(result.monthlySavings).toBe(14);
    expect(result.annualSavings).toBe(168);
  });
});
