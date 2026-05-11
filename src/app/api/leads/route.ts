import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendLeadConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, auditId, source } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials missing. Simulating lead capture success.');
      
      // Still trigger email if key exists
      sendLeadConfirmationEmail(email, auditId).catch((err: any) => {
        console.error('Background email sending failed:', err);
      });

      return NextResponse.json({ success: true, simulated: true });
    }

    let internalAuditId = null;
    if (auditId && /^[a-zA-Z0-9_-]{10}$/.test(auditId)) {
      const { data: auditData } = await supabase
        .from('audits')
        .select('id')
        .eq('public_id', auditId)
        .single();
      if (auditData) {
        internalAuditId = auditData.id;
      }
    } else if (auditId) {
      internalAuditId = auditId; // Assume it's a UUID if not a nanoid
    }

    const { error } = await supabase
      .from('leads')
      .insert([
        {
          email,
          audit_id: internalAuditId,
          // Removed 'source' as it is not in the current schema
        },
      ]);

    if (error) throw error;

    // Trigger transactional email (non-blocking)
    sendLeadConfirmationEmail(email, auditId).catch((err: any) => {
      console.error('Background email sending failed:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
