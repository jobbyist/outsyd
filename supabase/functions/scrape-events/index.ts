import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

// Allowed domains for scraping - whitelist approach
const ALLOWED_DOMAINS = [
  'quicket.co.za',
  'webtickets.co.za',
  'arifriky.com',
  'nairaland.com',
  'momondo.com',
  'kenyabuzz.com',
];

// African event websites to scrape
const EVENT_SOURCES = [
  { url: 'https://www.quicket.co.za/events/', country: 'South Africa', category: 'general' },
  { url: 'https://www.webtickets.co.za/v2/Events.aspx', country: 'South Africa', category: 'general' },
  { url: 'https://arifriky.com/events/', country: 'Nigeria', category: 'general' },
  { url: 'https://www.nairaland.com/events', country: 'Nigeria', category: 'general' },
  { url: 'https://ghana.momondo.com/events', country: 'Ghana', category: 'general' },
  { url: 'https://www.kenyabuzz.com/events/', country: 'Kenya', category: 'general' },
];

// Validate URL against allowed domains
function isAllowedUrl(urlString: string): boolean {
  try {
    const parsedUrl = new URL(urlString);
    return ALLOWED_DOMAINS.some(domain => parsedUrl.hostname.includes(domain));
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authentication check - require valid JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No authorization header provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('Invalid token:', authError?.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Authorization check - require admin role
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (roleError || !roles || roles.length === 0) {
      console.log('User is not admin:', user.id);
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin authenticated:', user.id);

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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

    // Parse and validate input
    const { url, country } = await req.json().catch(() => ({}));
    
    // If specific URL provided, validate it against allowed domains
    if (url) {
      if (typeof url !== 'string' || url.length > 500) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!isAllowedUrl(url)) {
        console.log('URL not in allowed domains:', url);
        return new Response(
          JSON.stringify({ success: false, error: 'URL domain not allowed. Only approved event websites can be scraped.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate country if provided
    if (country && (typeof country !== 'string' || country.length > 100)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid country format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Save events to database
    if (allEvents.length > 0) {
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
              creator: 'OUTSYD Bot',
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
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
