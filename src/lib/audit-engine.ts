import { PRICING_REGISTRY } from './pricing';

export interface UserInput {
  toolKey: string;
  planName: string;
  teamSize: number;
  monthlySpend: number;
  usageLevel: 'low' | 'medium' | 'high';
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalProjectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendations: Recommendation[];
  isHighValueAudit: boolean;
}

export interface Recommendation {
  toolName: string;
  issue: string;
  action: string;
  potentialSavings: number;
  type: 'overlap' | 'downgrade' | 'billing' | 'alternative' | 'credex';
}

export const runAudit = (inputs: UserInput[]): AuditResult => {
  let totalCurrentSpend = 0;
  const recommendations: Recommendation[] = [];

  inputs.forEach(input => {
    totalCurrentSpend += input.monthlySpend;
  });

  // 1. Category Overlap Detection (IDE Focus)
  const ides = inputs.filter(i => PRICING_REGISTRY[i.toolKey]?.category === 'ide');
  if (ides.length > 1) {
    // Keep the most expensive one (usually the one they prefer), flag others as overlap
    const sortedIdes = [...ides].sort((a, b) => b.monthlySpend - a.monthlySpend);
    const primaryIde = sortedIdes[0];
    const redundantIdes = sortedIdes.slice(1);

    redundantIdes.forEach(redundant => {
      recommendations.push({
        toolName: PRICING_REGISTRY[redundant.toolKey].name,
        issue: 'Redundant IDE Intelligence',
        action: `Consolidate onto ${PRICING_REGISTRY[primaryIde.toolKey].name}. Maintaining multiple AI-integrated IDEs for the same team leads to fragmented workflows and duplicate licensing costs.`,
        potentialSavings: redundant.monthlySpend,
        type: 'overlap',
      });
    });
  }

  // 2. Plan Optimization & Billing
  inputs.forEach(input => {
    // Skip if already flagged for removal
    if (recommendations.some(r => r.toolName === PRICING_REGISTRY[input.toolKey]?.name && r.type === 'overlap')) return;

    const tool = PRICING_REGISTRY[input.toolKey];
    if (!tool) return;

    // A. Monthly to Annual
    const monthlyPlan = tool.plans.find(p => p.name === input.planName && p.billingCycle === 'monthly');
    const annualVersion = tool.plans.find(p => p.name.includes(input.planName) && p.billingCycle === 'annual');

    if (monthlyPlan && annualVersion) {
      const savings = (monthlyPlan.price - annualVersion.price) * input.teamSize;
      if (savings > 0) {
        recommendations.push({
          toolName: tool.name,
          issue: 'Monthly Billing Premium',
          action: `Convert to annual billing for ${tool.name}. Monthly flexibility is costing an additional ${Math.round((monthlyPlan.price / annualVersion.price - 1) * 100)}% per seat.`,
          potentialSavings: savings,
          type: 'billing',
        });
      }
    }

    // B. Over-provisioned Seats (Chat Tools)
    if (tool.category === 'chat') {
      if (input.teamSize < 2 && input.planName === 'Team') {
        const plusPlan = tool.plans.find(p => p.name === 'Plus' || p.name === 'Pro');
        if (plusPlan) {
          const savings = input.monthlySpend - (plusPlan.price * input.teamSize);
          recommendations.push({
            toolName: tool.name,
            issue: 'Excessive Plan Tier',
            action: `Downgrade to ${plusPlan.name}. Team features (Admin console, shared workspaces) are under-utilized for teams of this size.`,
            potentialSavings: savings,
            type: 'downgrade',
          });
        }
      }

      // C. Shadow AI (Multiple Plus -> Team)
      if (input.teamSize >= 5 && (input.planName === 'Plus' || input.planName === 'Pro')) {
        const teamPlan = tool.plans.find(p => p.name === 'Team');
        if (teamPlan) {
          const teamCost = teamPlan.price * input.teamSize;
          if (teamCost < input.monthlySpend) {
            recommendations.push({
              toolName: tool.name,
              issue: 'Subscription Fragmentation',
              action: `Consolidate individual ${input.planName} accounts into a single ${tool.name} Team workspace to improve data security and reduce per-seat costs.`,
              potentialSavings: input.monthlySpend - teamCost,
              type: 'billing',
            });
          }
        }
      }
    }
  });

  // 3. Credex Specific Opportunity (Retail vs Credits)
  const totalMonthlySavings = recommendations.reduce((acc, r) => acc + r.potentialSavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  if (totalAnnualSavings > 500) {
    recommendations.push({
      toolName: 'Credex Infrastructure Credits',
      issue: 'Retail Price Inefficiency',
      action: 'Apply for Credex discounted credits. Based on your spend profile, you are eligible for up to 40% off retail pricing through our pre-negotiated enterprise pools.',
      potentialSavings: totalCurrentSpend * 0.25, // Conservative 25% estimate
      type: 'credex',
    });
  }

  const finalMonthlySavings = recommendations.reduce((acc, r) => acc + r.potentialSavings, 0);
  const totalProjectedSpend = Math.max(0, totalCurrentSpend - finalMonthlySavings);

  return {
    totalCurrentSpend,
    totalProjectedSpend,
    monthlySavings: totalCurrentSpend - totalProjectedSpend,
    annualSavings: (totalCurrentSpend - totalProjectedSpend) * 12,
    recommendations,
    isHighValueAudit: totalAnnualSavings > 1000,
  };
};
