import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AuditResult } from '@/lib/audit-engine';
import LeadForm from '@/components/LeadForm';

async function getAudit(id: string) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('public_id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function AuditResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  const result = audit.result_data as AuditResult;
  const annualCurrentSpend = result.totalCurrentSpend * 12;
  const savingsPercent = Math.round((result.annualSavings / annualCurrentSpend) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      {/* Result Hero */}
      <div className="bg-white border-b border-gray-100 pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-2">Audit Report <span className="font-mono text-sm text-gray-400">#{id.slice(0, 8)}</span></h1>
            <p className="text-gray-500 max-w-2xl">
              A comprehensive analysis of your organization&apos;s AI tool architecture, identifying redundancies, licensing inefficiencies, and enterprise credit eligibility.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
              Share Report
            </button>
            <button className="px-4 py-2 bg-[#086841] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#064d30] transition-colors">
              Download PDF
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#086841] font-mono text-sm font-bold tracking-widest uppercase">
                <span className="w-2 h-2 bg-[#086841] rotate-45" />
                Executive Summary
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
                Potential Savings <br />
                <span className="text-[#086841]">${result.annualSavings.toLocaleString()}</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-xl">
                Our engine identified a <span className="font-bold text-gray-900">{savingsPercent}% reduction</span> in your annual AI operational expenditure through license optimization and tool consolidation.
              </p>
            </div>
            
            <div className="bg-[#f8faf9] border border-emerald-100 p-8 rounded-sm w-full md:w-80">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Current Annual Run Rate</div>
              <div className="text-2xl font-mono font-bold text-gray-900">${annualCurrentSpend.toLocaleString()}</div>
              <div className="h-px bg-emerald-100 my-4" />
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Optimized Annual Run Rate</div>
              <div className="text-2xl font-mono font-bold text-[#086841]">${(annualCurrentSpend - result.annualSavings).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        {/* Cost Analysis Visualization */}
        <div className="bg-white border border-gray-100 p-8 rounded-sm mb-12 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Cost Efficiency Analysis</h3>
          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
                    Current Spend
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-gray-600">
                    ${annualCurrentSpend.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-gray-100">
                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-400"></div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#086841] bg-emerald-50">
                    Optimized Run Rate
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-[#086841]">
                    ${(annualCurrentSpend - result.annualSavings).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-gray-100">
                <div style={{ width: `${100 - savingsPercent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#086841]"></div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-tighter">
            * Projected savings based on 2026 pricing benchmarks and enterprise credit eligibility.
          </p>
        </div>

        {/* AI Executive Summary */}
        <div className="institutional-card mb-12 bg-emerald-50/30 border-emerald-100">
           <h3 className="text-xs font-bold text-[#086841] uppercase tracking-widest mb-4 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             AI Executive Summary
           </h3>
           <p className="text-gray-800 leading-relaxed font-medium italic">
             "{audit.ai_summary || 'Generating analysis...'}"
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Detailed Findings */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                Technical Optimization Path
              </h2>
              <div className="space-y-4">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm hover:border-[#086841] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                        rec.type === 'overlap' ? 'bg-blue-50 text-blue-600' :
                        rec.type === 'downgrade' ? 'bg-orange-50 text-orange-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {rec.type}
                      </span>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Est. Monthly Savings</div>
                        <div className="text-lg font-mono font-bold text-[#086841]">${rec.potentialSavings.toLocaleString()}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{rec.toolName} - {rec.issue}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{rec.action}</p>
                    
                    {/* Action Item */}
                    <div className="bg-gray-50 border-l-4 border-gray-200 p-4 font-mono text-xs text-gray-500 group-hover:border-[#086841] transition-colors">
                      STRATEGY: {rec.type.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Credex CTA & Intelligence */}
          <div className="space-y-8">
            {/* Credex High-Value CTA */}
            <div className="bg-gray-900 text-white p-8 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" />
              <h3 className="text-xl font-bold mb-4 relative z-10">Scale your savings with Credex</h3>
              <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
                For organizations with &gt;$5k monthly spend, we unlock direct enterprise credits and volume discounts not available to the public.
              </p>
              <Link 
                href="https://credex.io" 
                className="inline-flex items-center gap-2 bg-[#086841] hover:bg-[#0a8252] text-white font-bold py-3 px-6 text-sm transition-all w-full justify-center"
              >
                Request Enterprise Audit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Lead Capture Form */}
            <LeadForm auditId={id} />

            {/* Share Section */}
            <div className="institutional-card">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Share Report</h4>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={`https://audit.credex.io/audit/${id}`} 
                  className="flex-1 bg-gray-50 border border-gray-100 px-3 py-2 text-xs font-mono text-gray-500 outline-none"
                />
                <button className="bg-gray-100 hover:bg-gray-200 p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
