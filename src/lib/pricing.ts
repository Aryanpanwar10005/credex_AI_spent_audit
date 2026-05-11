export type BillingCycle = 'monthly' | 'annual';
export type ToolCategory = 'ide' | 'chat' | 'api' | 'research';

export interface ToolPricing {
  name: string;
  category: ToolCategory;
  plans: {
    name: string;
    price: number;
    billingCycle: BillingCycle;
    minUsers?: number;
    features: string[];
    isUsageBased?: boolean;
  }[];
}

export const PRICING_REGISTRY: Record<string, ToolPricing> = {
  cursor: {
    name: 'Cursor',
    category: 'ide',
    plans: [
      { name: 'Hobby', price: 0, billingCycle: 'monthly', features: ['2000 completions', '50 premium requests'] },
      { name: 'Pro', price: 20, billingCycle: 'monthly', features: ['Unlimited completions', '500 premium requests'] },
      { name: 'Pro (Annual)', price: 16, billingCycle: 'annual', features: ['Unlimited completions', '500 premium requests'] },
      { name: 'Business', price: 40, billingCycle: 'monthly', features: ['Admin dashboard', 'Enforced privacy mode'] },
      { name: 'Enterprise', price: 100, billingCycle: 'monthly', features: ['SSO', 'Custom deployment', 'Dedicated support'] },
    ],
  },
  github_copilot: {
    name: 'GitHub Copilot',
    category: 'ide',
    plans: [
      { name: 'Individual', price: 10, billingCycle: 'monthly', features: ['Autocomplete', 'Chat'] },
      { name: 'Individual (Annual)', price: 8.33, billingCycle: 'annual', features: ['Autocomplete', 'Chat'] },
      { name: 'Business', price: 19, billingCycle: 'monthly', features: ['Policy management', 'Proxy support'] },
      { name: 'Enterprise', price: 39, billingCycle: 'monthly', features: ['Custom models', 'Knowledge base'] },
    ],
  },
  windsurf: {
    name: 'Windsurf',
    category: 'ide',
    plans: [
      { name: 'Hobby', price: 0, billingCycle: 'monthly', features: ['Basic AI features'] },
      { name: 'Pro', price: 15, billingCycle: 'monthly', features: ['Advanced reasoning', 'Priority support'] },
      { name: 'Pro (Annual)', price: 12, billingCycle: 'annual', features: ['Advanced reasoning', 'Priority support'] },
    ],
  },
  chatgpt: {
    name: 'ChatGPT',
    category: 'chat',
    plans: [
      { name: 'Free', price: 0, billingCycle: 'monthly', features: ['Standard access'] },
      { name: 'Plus', price: 20, billingCycle: 'monthly', features: ['DALL-E', 'GPT-4o access'] },
      { name: 'Plus (Annual)', price: 16, billingCycle: 'annual', features: ['DALL-E', 'GPT-4o access'] },
      { name: 'Team', price: 30, billingCycle: 'monthly', minUsers: 2, features: ['Admin console', 'Data privacy'] },
      { name: 'Team (Annual)', price: 25, billingCycle: 'annual', minUsers: 2, features: ['Admin console', 'Data privacy'] },
      { name: 'Enterprise', price: 60, billingCycle: 'monthly', features: ['Unlimited high-speed GPT-4o'] },
      { name: 'API Direct', price: 10, billingCycle: 'monthly', isUsageBased: true, features: ['Pay for tokens'] },
    ],
  },
  claude: {
    name: 'Claude',
    category: 'chat',
    plans: [
      { name: 'Free', price: 0, billingCycle: 'monthly', features: ['Standard access'] },
      { name: 'Pro', price: 20, billingCycle: 'monthly', features: ['Priority access', 'Early features'] },
      { name: 'Pro (Annual)', price: 18, billingCycle: 'annual', features: ['Priority access', 'Early features'] },
      { name: 'Max', price: 35, billingCycle: 'monthly', features: ['Extended context window', 'Advanced coding'] },
      { name: 'Team', price: 30, billingCycle: 'monthly', minUsers: 5, features: ['Centralized billing', 'Higher limits'] },
      { name: 'Enterprise', price: 75, billingCycle: 'monthly', features: ['Audit logs', 'Custom RBAC'] },
      { name: 'API Direct', price: 15, billingCycle: 'monthly', isUsageBased: true, features: ['Opus/Sonnet access'] },
    ],
  },
  gemini: {
    name: 'Gemini',
    category: 'chat',
    plans: [
      { name: 'Pro', price: 0, billingCycle: 'monthly', features: ['1.5 Pro access'] },
      { name: 'Ultra', price: 20, billingCycle: 'monthly', features: ['1.5 Ultra access', '2TB storage'] },
      { name: 'Ultra (Annual)', price: 16.66, billingCycle: 'annual', features: ['1.5 Ultra access', '2TB storage'] },
      { name: 'API', price: 10, billingCycle: 'monthly', isUsageBased: true, features: ['High rate limits'] },
    ],
  },
  anthropic_api: {
    name: 'Anthropic API',
    category: 'api',
    plans: [
      { name: 'Usage-Based', price: 50, billingCycle: 'monthly', isUsageBased: true, features: ['Claude 3.7 Models'] },
    ],
  },
  openai_api: {
    name: 'OpenAI API',
    category: 'api',
    plans: [
      { name: 'Usage-Based', price: 50, billingCycle: 'monthly', isUsageBased: true, features: ['GPT-5 Models'] },
    ],
  },
  perplexity: {
    name: 'Perplexity',
    category: 'research',
    plans: [
      { name: 'Free', price: 0, billingCycle: 'monthly', features: ['Standard search'] },
      { name: 'Pro', price: 20, billingCycle: 'monthly', features: ['Pro search', 'File uploads'] },
      { name: 'Pro (Annual)', price: 16.66, billingCycle: 'annual', features: ['Pro search', 'File uploads'] },
      { name: 'Enterprise', price: 40, billingCycle: 'monthly', features: ['Admin control', 'SSO'] },
    ],
  },
};

export const findOptimalPlan = (toolKey: string, teamSize: number, usageLevel: 'low' | 'medium' | 'high') => {
  const tool = PRICING_REGISTRY[toolKey];
  if (!tool) return null;

  // Simple heuristic for now
  if (usageLevel === 'low') return tool.plans.find(p => p.price === 0) || tool.plans[0];
  
  // Filter plans by team size requirements
  const viablePlans = tool.plans.filter(p => !p.minUsers || teamSize >= p.minUsers);
  
  // Sort by price (ascending)
  return viablePlans.sort((a, b) => a.price - b.price)[0];
};
