import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { runAudit } from '@/lib/audit-engine';
import { generateAuditSummary } from '@/lib/ai-summary';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { inputs } = await request.json();
    
    if (!inputs || !Array.isArray(inputs)) {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    const result = runAudit(inputs);
    const summary = await generateAuditSummary(result);
    const publicId = nanoid(10);

    const { data, error } = await supabase
      .from('audits')
      .insert({
        public_id: publicId,
        input_data: inputs,
        result_data: result,
        ai_summary: summary,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 });
    }

    return NextResponse.json({ publicId });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
