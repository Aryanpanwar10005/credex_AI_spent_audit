'use client';

import { useState } from 'react';

interface LeadFormProps {
  auditId: string;
}

export default function LeadForm({ auditId }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auditId }),
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-sm text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#086841] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 className="text-lg font-bold text-gray-900 mb-1">Report Saved</h4>
        <p className="text-sm text-gray-600">We've sent a permanent link to your inbox along with our AI Spend Optimization whitepaper.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
      <h4 className="text-lg font-bold text-gray-900 mb-2">Save this Report</h4>
      <p className="text-sm text-gray-500 mb-6">Receive a permanent link to these results and our "2026 AI Spend Benchmarks" whitepaper.</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="email" 
          required
          placeholder="corporate@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-[#086841] outline-none text-gray-900"
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 text-sm transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Processing...' : 'Save & Download Whitepaper'}
        </button>
        <p className="text-[10px] text-gray-400 text-center">
          By clicking, you agree to receive follow-up analysis from Credex.
        </p>
      </form>
    </div>
  );
}
