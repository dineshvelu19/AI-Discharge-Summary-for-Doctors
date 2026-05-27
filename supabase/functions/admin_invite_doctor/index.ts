import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Simple in-memory rate limiting map
// Key: email, Value: timestamp of last invite
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute per email

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mocked SMTP Logger for beautifully styled HTML invitations
async function sendMockEmail(email: string, link: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 8px;">
      <h2 style="color: #111827;">You've been invited to QuickDischarge 2.0</h2>
      <p style="color: #4b5563; line-height: 1.6;">
        Hello, <br/><br/>
        You have been invited to join QuickDischarge 2.0 as a doctor. 
        Please click the button below to accept your invitation and set up your account.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation</a>
      </div>
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        If you have any questions, please contact the hospital administrator.
      </p>
    </div>
  `;
  console.log("=== MOCK SMTP LOGGER: SENDING EMAIL ===");
  console.log(`To: ${email}`);
  console.log(`Subject: Invitation to QuickDischarge 2.0`);
  console.log(`Body (HTML):`);
  console.log(html);
  console.log("=======================================");
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const lastInvite = rateLimitMap.get(email);
    if (lastInvite && now - lastInvite < RATE_LIMIT_WINDOW_MS) {
       return new Response(
        JSON.stringify({ error: 'Rate limit exceeded for this email. Please wait a minute.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Generate invite link to allow custom email sending
    const { data: linkData, error: linkError } = await supabaseClient.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        data: {
          onboarding_status: 'invited',
        }
      }
    });

    if (linkError) {
      throw linkError;
    }

    // Send the custom HTML email
    await sendMockEmail(email, linkData.properties.action_link);

    // Update rate limit map on success
    rateLimitMap.set(email, now);

    return new Response(
      JSON.stringify({ message: 'Invitation sent successfully', user: linkData.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
