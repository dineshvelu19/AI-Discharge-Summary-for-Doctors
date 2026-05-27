// supabase/functions/generate_draft/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { runSafetyGate } from "../_shared/safety_gate.ts"

serve(async (req) => {
  // 1. Handle CORS Preflight OPTIONS Request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Parse Incoming POST Payload
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { 
      patientName, 
      rawText, 
      medications = [], 
      allergies = [],
      draftId,
      orgId,
      actorId,
      modelName = "gemini-3.1-pro" 
    } = await req.json()

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "Missing required rawText field." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 3. Securely Fetch API Key from Environment Variables (Supabase Vault Secrets Manager)
    const apiKey = Deno.env.get("GEMINI_API_KEY")
    if (!apiKey) {
      console.error("QAS/PRD STAGING WARNING: GEMINI_API_KEY environment variable is missing inside Supabase Vault.")
      return new Response(
        JSON.stringify({ 
          error: "API Key Configuration Error. Supabase Vault GEMINI_API_KEY secret is not set in the backend.",
          suggestion: "Please configure GEMINI_API_KEY using: 'supabase secrets set GEMINI_API_KEY=your_key_here'"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 4. Formulate the Structured, Grounded Clinical Prompt Envelope (QTV Standards)
    const prompt = `
    You are an expert clinical documentation AI agent operating within the QuickDischarge 2.0 platform.
    Analyze the provided raw bedside notes, medication list, and patient name to draft a comprehensive, source-grounded discharge summary.

    RAW BEDSIDE NOTES:
    "${rawText}"

    CURRENT PRESCRIBED MEDICATIONS:
    ${JSON.stringify(medications)}

    PATIENT CONTEXT:
    Name: "${patientName}"

    CONSTRAINTS & GROUNDING ENVELOPE:
    1. Base all structured data strictly on the provided clinical notes and medications. 
    2. Do NOT hallucinate, guess, or invent any clinical findings, vitals, or investigation results.
    3. If any field or detail (like a follow-up date, specific lab value, or warning sign) is NOT explicitly mentioned or derivable from the bedside notes, output "[MISSING]" for that specific field.
    4. Provide simplified, 6th-grade reading level plain-language explanations for the patient's visit summaries. Translate complex jargon (e.g. STEMI -> heart attack, occlusion -> block).

    You MUST return your output strictly in valid JSON format matching this exact schema:
    {
      "diagnosis": "Primary diagnosis with standard nomenclature, and secondary diagnoses if present.",
      "chiefComplaint": "The patient's initial presenting symptoms and HPI details.",
      "clinicalFindings": "Objective vitals, physical exams, and clinical findings on admission.",
      "investigations": "Summarized laboratory results, radiological studies, and pending tests.",
      "condition": "Patient's current status and objective vitals recorded at time of discharge.",
      "qa": {
        "why": "Simplified, plain-language layperson explanation answering: 'Why was I in the hospital?'",
        "treatments": "Simplified, plain-language explanation of treatments, procedures, and support received.",
        "restrictions": "Detailed activity, physical labor, and dietary restrictions to observe at home.",
        "warnings": "Specific red-flag warning signs that mandate immediate emergency care return.",
        "followup": "Clear instructions on which outpatient clinic to visit and when."
      }
    }

    Ensure your output is strictly a JSON object. Do NOT wrap the JSON in markdown code blocks (\`\`\`json ... \`\`\`).
    `

    // 5. Call the Google Gemini 2.x Edge API Endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    })

    if (!response.ok) {
      const errorMsg = await response.text()
      console.error(`Gemini API Call Failure: Status ${response.status}`, errorMsg)
      throw new Error(`Google Gemini API responded with status ${response.status}: ${errorMsg}`)
    }

    const data = await response.json()
    
    // 6. Extract and Validate the Generated Candidate JSON Content
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!candidateText) {
      throw new Error("Invalid response format received from Google Gemini API candidates.")
    }

    // Try parsing to verify it is valid JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(candidateText.trim())
    } catch (parseErr) {
      console.error("JSON Parsing Failure on AI output:", candidateText)
      throw new Error("AI engine failed to output a valid JSON format. Raw output was: " + candidateText)
    }

    // 6.5 Run Clinical Safety Gate
    const safetyGateResult = runSafetyGate(
      JSON.stringify(parsedContent),
      medications,
      allergies
    );

    parsedContent.safetyWarnings = safetyGateResult.warnings;
    parsedContent.safetyPassed = safetyGateResult.passed;

    // 6.6 Write robustly to audit_log table for compliance tracking
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || 'Unknown User Agent';
      const entityId = draftId || crypto.randomUUID();
      
      const { error: auditError } = await supabase
        .from('audit_log')
        .insert({
          org_id: orgId || null,
          actor_id: actorId || null,
          action: 'DRAFT_GENERATED',
          entity_type: 'discharge_drafts',
          entity_id: entityId,
          diff: { safetyPassed: safetyGateResult.passed, warningsCount: safetyGateResult.warnings.length },
          ip_address: ipAddress,
          user_agent: userAgent
        });

      if (auditError) {
        console.error("Failed to write to audit_log:", auditError);
      }
    }

    // 7. Return the Final Structured Clinical Draft
    return new Response(
      JSON.stringify(parsedContent),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0" 
        } 
      }
    )

  } catch (error) {
    console.error("generate_draft Edge Function Exception:", error)
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error in QuickDischarge Edge Function.",
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
