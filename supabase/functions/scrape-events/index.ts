const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  category: string;
  country: string;
  city: string;
  ticket_url: string | null;
  ticket_price: number | null;
  image_url: string | null;
}

// African event websites to scrape
const EVENT_SOURCES = [
  { url: 'https://www.quicket.co.za/events/', country: 'South Africa', category: 'general' },
  { url: 'https://www.webtickets.co.za/v2/Events.aspx', country: 'South Africa', category: 'general' },
  { url: 'https://arifriky.com/events/', country: 'Nigeria', category: 'general' },
  { url: 'https://www.nairaland.com/events', country: 'Nigeria', category: 'general' },
  { url: 'https://ghana.momondo.com/events', country: 'Ghana', category: 'general' },
  { url: 'https://www.kenyabuzz.com/events/', country: 'Kenya', category: 'general' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { url, country } = await req.json().catch(() => ({}));
    
    // If specific URL provided, scrape that. Otherwise scrape all sources
    const sourcesToScrape = url 
      ? [{ url, country: country || 'Unknown', category: 'general' }]
      : EVENT_SOURCES;

    const allEvents: ScrapedEvent[] = [];

    for (const source of sourcesToScrape) {
      console.log(`Scraping: ${source.url}`);
      
      try {
        // Scrape the website using Firecrawl
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: source.url,
            formats: ['markdown'],
            onlyMainContent: true,
          }),
        });

        if (!scrapeResponse.ok) {
          console.error(`Failed to scrape ${source.url}:`, await scrapeResponse.text());
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';

        if (!markdown) {
          console.log(`No content from ${source.url}`);
          continue;
        }

        // Use AI to extract events from the scraped content
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are an event data extractor. Extract event information from the provided content and return a JSON array of events. Each event should have: title, date (in "Month DD, YYYY" format), time (in "HH:MM - HH:MM" format or "TBD"), venue, description (max 200 chars), category (one of: music, sports, tech, arts, food, business, community, wellness, education, other), city, ticket_url (if available), ticket_price (number or null), image_url (if available). Only include real upcoming events, not past events or promotional content. Return ONLY valid JSON array, no other text.`
              },
              {
                role: 'user',
                content: `Extract events from this content from ${source.country}:\n\n${markdown.slice(0, 15000)}`
              }
            ],
            tools: [
              {
                type: 'function',
                function: {
                  name: 'extract_events',
                  description: 'Extract events from website content',
                  parameters: {
                    type: 'object',
                    properties: {
                      events: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            title: { type: 'string' },
                            date: { type: 'string' },
                            time: { type: 'string' },
                            venue: { type: 'string' },
                            description: { type: 'string' },
                            category: { type: 'string', enum: ['music', 'sports', 'tech', 'arts', 'food', 'business', 'community', 'wellness', 'education', 'other'] },
                            city: { type: 'string' },
                            ticket_url: { type: 'string' },
                            ticket_price: { type: 'number' },
                            image_url: { type: 'string' }
                          },
                          required: ['title', 'date', 'venue', 'category', 'city']
                        }
                      }
                    },
                    required: ['events']
                  }
                }
              }
            ],
            tool_choice: { type: 'function', function: { name: 'extract_events' } }
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI extraction failed for ${source.url}:`, await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        
        if (toolCall?.function?.arguments) {
          try {
            const parsed = JSON.parse(toolCall.function.arguments);
            const events = parsed.events || [];
            
            for (const event of events) {
              allEvents.push({
                ...event,
                country: source.country,
                time: event.time || 'TBD',
                description: event.description || '',
                ticket_url: event.ticket_url || null,
                ticket_price: event.ticket_price || null,
                image_url: event.image_url || null,
              });
            }
            
            console.log(`Extracted ${events.length} events from ${source.url}`);
          } catch (parseError) {
            console.error(`Failed to parse AI response for ${source.url}:`, parseError);
          }
        }
      } catch (sourceError) {
        console.error(`Error processing ${source.url}:`, sourceError);
      }
    }

    console.log(`Total events extracted: ${allEvents.length}`);

    // If we have events and Supabase is configured, save them
    if (allEvents.length > 0 && supabaseUrl && supabaseServiceKey) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      for (const event of allEvents) {
        try {
          // Parse date to create target_date
          const parsedDate = new Date(event.date);
          if (isNaN(parsedDate.getTime())) {
            console.log(`Skipping event with invalid date: ${event.title}`);
            continue;
          }

          // Check if event already exists (by title and date)
          const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('title', event.title)
            .eq('date', event.date)
            .single();

          if (existing) {
            console.log(`Event already exists: ${event.title}`);
            continue;
          }

          // Insert new event
          const { error: insertError } = await supabase
            .from('events')
            .insert({
              title: event.title,
              date: event.date,
              time: event.time,
              address: event.venue,
              description: event.description,
              category: event.category,
              country: event.country,
              city: event.city,
              ticket_url: event.ticket_url,
              ticket_price: event.ticket_price,
              background_image_url: event.image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
              target_date: parsedDate.toISOString(),
              creator: 'Outsyde Bot',
            });

          if (insertError) {
            console.error(`Failed to insert event ${event.title}:`, insertError);
          } else {
            console.log(`Inserted event: ${event.title}`);
          }
        } catch (eventError) {
          console.error(`Error saving event ${event.title}:`, eventError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        events: allEvents,
        count: allEvents.length,
        message: `Scraped and processed ${allEvents.length} events`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Scrape events error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
