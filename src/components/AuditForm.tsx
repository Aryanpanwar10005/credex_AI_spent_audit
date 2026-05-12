'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_REGISTRY } from '@/lib/pricing';
import { UserInput } from '@/lib/audit-engine';

export default function AuditForm() {
  const router = useRouter();
  const [inputs, setInputs] = useState<UserInput[]>([]);
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState('coding');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Load from localStorage on mount (Client-side only)
  useEffect(() => {
    const saved = localStorage.getItem('credex_audit_form');
    if (saved) {
      try {
        const { inputs: sInputs, teamSize: sTeamSize, useCase: sUseCase } = JSON.parse(saved);
        if (sInputs) setInputs(sInputs);
        if (sTeamSize) setTeamSize(sTeamSize);
        if (sUseCase) setUseCase(sUseCase);
      } catch (e) {
        console.error('Failed to parse saved form state', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('credex_audit_form', JSON.stringify({ inputs, teamSize, useCase }));
  }, [inputs, teamSize, useCase]);

  const addTool = () => {
    const firstToolKey = Object.keys(PRICING_REGISTRY)[0];
    const firstTool = PRICING_REGISTRY[firstToolKey];
    setInputs([
      ...inputs,
      {
        toolKey: firstToolKey,
        planName: firstTool.plans[0].name,
        teamSize: 1,
        monthlySpend: firstTool.plans[0].price,
        usageLevel: 'medium',
      },
    ]);
  };

  const updateInput = (index: number, updates: Partial<UserInput>) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], ...updates };
    
    // If toolKey changed, reset plan and price
    if (updates.toolKey) {
      const tool = PRICING_REGISTRY[updates.toolKey];
      newInputs[index].planName = tool.plans[0].name;
      newInputs[index].monthlySpend = tool.plans[0].price * newInputs[index].teamSize;
    }
    
    setInputs(newInputs);
  };

  const removeTool = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (honeypot) return; // Silent discard for bots
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, honeypot }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      // Clear storage on successful submission
      localStorage.removeItem('credex_audit_form');
      router.push(`/audit/${data.publicId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate audit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Honeypot Field */}
      <div className="hidden" aria-hidden="true">
        <input 
          type="text" 
          value={honeypot} 
          onChange={(e) => setHoneypot(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      <div className="institutional-card mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <span className="w-2 h-2 bg-[#086841] rotate-45" />
          General Organization Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Team Size</label>
            <input 
              type="number" 
              value={teamSize} 
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="w-full border border-gray-200 px-3 py-2 focus:border-[#086841] outline-none font-mono text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Primary Use Case</label>
            <select 
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 focus:border-[#086841] outline-none text-gray-900"
            >
              <option value="coding">Software Engineering</option>
              <option value="data">Data Science / Analytics</option>
              <option value="mixed">General Operations</option>
              <option value="writing">Content / Marketing</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-900">
          <span className="w-2 h-2 bg-[#086841] rotate-45" />
          Active Subscriptions
        </h2>
        
        <AnimatePresence>
          {inputs.map((input, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="institutional-card relative group"
            >
              <button 
                onClick={() => removeTool(index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tool</label>
                  <select 
                    value={input.toolKey}
                    onChange={(e) => updateInput(index, { toolKey: e.target.value })}
                    className="w-full border-b border-gray-200 py-1 focus:border-[#086841] outline-none bg-transparent font-medium text-gray-900"
                  >
                    {Object.entries(PRICING_REGISTRY).map(([key, tool]) => (
                      <option key={key} value={key}>{tool.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Plan</label>
                  <select 
                    value={input.planName}
                    onChange={(e) => {
                      const tool = PRICING_REGISTRY[input.toolKey];
                      if (!tool) return;
                      const plan = tool.plans.find(p => p.name === e.target.value);
                      updateInput(index, { planName: e.target.value, monthlySpend: plan ? plan.price * input.teamSize : 0 });
                    }}
                    className="w-full border-b border-gray-200 py-1 focus:border-[#086841] outline-none bg-transparent text-gray-900"
                  >
                    {PRICING_REGISTRY[input.toolKey]?.plans.map(plan => (
                      <option key={plan.name} value={plan.name}>{plan.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Seats</label>
                  <input 
                    type="number" 
                    value={input.teamSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const tool = PRICING_REGISTRY[input.toolKey];
                      const plan = tool.plans.find(p => p.name === input.planName);
                      updateInput(index, { teamSize: val, monthlySpend: plan ? plan.price * val : 0 });
                    }}
                    className="w-full border-b border-gray-200 py-1 focus:border-[#086841] outline-none bg-transparent font-mono text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Monthly Spend ($)</label>
                  <input 
                    type="number" 
                    value={input.monthlySpend}
                    onChange={(e) => updateInput(index, { monthlySpend: parseFloat(e.target.value) })}
                    className="w-full border-b border-gray-200 py-1 focus:border-[#086841] outline-none bg-transparent font-mono font-bold text-[#086841]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={addTool}
          className="w-full border-2 border-dashed border-gray-200 py-4 text-gray-400 hover:border-[#086841] hover:text-[#086841] transition-all flex items-center justify-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Tool Subscription
        </button>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={handleSubmit}
          disabled={inputs.length === 0 || isSubmitting}
          className="btn-primary w-full md:w-auto px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 text-white"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Stack...
            </>
          ) : (
            'Generate Intelligent Audit'
          )}
        </button>
      </div>
    </div>
  );
}
