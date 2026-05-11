import { Resend } from 'resend';

let resend: Resend | null = null;

export async function sendLeadConfirmationEmail(email: string, auditId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY is missing. Skipping email sending.');
    return;
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Credex Audit <audit@credex.rocks>', // Use a verified domain in production
      to: email,
      subject: 'Your AI Spend Audit is Ready',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h1 style="color: #086841;">Your AI Spend Audit</h1>
          <p>Thank you for using the Credex AI Spend Audit tool.</p>
          <p>You can view your full report at any time using this link:</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_BASE_URL}/audit/${auditId}" style="display: inline-block; padding: 10px 20px; background-color: #086841; color: white; text-decoration: none; border-radius: 3px;">View Audit Report</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Credex helps startups save up to 40% on AI infrastructure. If your audit showed significant savings, our team will reach out shortly to discuss enterprise credit eligibility.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
    }
    return { data, error };
  } catch (err) {
    console.error('Email sending failed:', err);
    return { error: err };
  }
}
