import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Chaos Engineering / Reliability testing hook
    const chaosMode = req.headers.get("x-chaos-mode");
    if (chaosMode === "latency") {
      // Simulate 3-6 second latency
      const delay = Math.floor(Math.random() * 3000) + 3000;
      await new Promise(res => setTimeout(res, delay));
    } else if (chaosMode === "error") {
      // Simulate 502 Bad Gateway or 500 Internal Error randomly
      const status = Math.random() > 0.5 ? 502 : 500;
      return new Response(JSON.stringify({ error: "Chaos simulation error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: status,
      });
    } else if (chaosMode === "rate_limit") {
      // Simulate rate limit
      return new Response(JSON.stringify({ error: "Too Many Requests" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { records } = await req.json();

    if (!records || !Array.isArray(records)) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: 'records' must be an array" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const insertedRecords = [];

    for (const record of records) {
      // Mock vector embedding generation (1536 dimensions for RAG engine)
      const embedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);
      
      const { data, error } = await supabase
        .from("emr_records")
        .insert({
          ...record,
          embedding,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      insertedRecords.push(data);
    }

    return new Response(
      JSON.stringify({ message: "Records ingested successfully", insertedRecords }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
