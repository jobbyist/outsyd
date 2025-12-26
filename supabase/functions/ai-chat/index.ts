import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are OUTSYD's friendly AI assistant. OUTSYD is Africa's premier event discovery platform, helping users find and attend amazing events across South Africa, Nigeria, Ghana, Kenya, Botswana, Tanzania, and more.

You can help with:
- Finding events (concerts, festivals, conferences, sports, nightlife, etc.)
- Understanding how to use the OUTSYD platform
- Information about OUTSYD Premium ($4.99/month) benefits: cashback on tickets, exclusive giveaways, members-only perks
- Information about OUTSYD for Business: event listing packages for organizers
- General questions about events in Africa

Guidelines:
- Be friendly, concise, and helpful
- If asked about specific event details, ticket purchases, or account issues you cannot resolve, politely suggest visiting the Contact page for direct support
- Always mention that users can contact support directly at /contact for complex issues
- Keep responses brief and actionable
- If you don't know something, admit it and suggest contacting support

For complex inquiries about refunds, technical issues, account problems, or specific event disputes, always recommend: "For this type of inquiry, I'd recommend reaching out to our support team directly. You can contact them at outsyd.africa/contact"`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      suggestion: "Please visit our contact page for direct support."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
