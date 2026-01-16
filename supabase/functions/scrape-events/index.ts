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
  source_url: string;
  source_domain: string;
}

interface EventSource {
  name: string;
  url: string;
  country: string;
  category: string;
  domain?: string;
}

const DEFAULT_EVENT_SOURCES: EventSource[] = [
  {
    name: 'Quicket',
    url: 'https://www.quicket.co.za/events/',
    country: 'South Africa',
    category: 'general',
  },
  {
    name: 'Webtickets',
    url: 'https://www.webtickets.co.za/v2/Events.aspx',
    country: 'South Africa',
    category: 'general',
  },
  {
    name: 'TicketPro',
    url: 'https://www.ticketpro.co.za/portal/web/index.php/event',
    country: 'South Africa',
    category: 'general',
  },
  {
    name: 'Kenyabuzz',
    url: 'https://www.kenyabuzz.com/events',
    country: 'Kenya',
    category: 'general',
  },
  {
    name: 'Eventbrite Nigeria',
    url: 'https://www.eventbrite.com/d/nigeria--lagos/events/',
    country: 'Nigeria',
    category: 'general',
  },
  {
    name: 'Eventbrite Ghana',
    url: 'https://www.eventbrite.com/d/ghana--accra/events/',
    country: 'Ghana',
    category: 'general',
  },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800';
const ALLOWED_CATEGORIES = new Set([
  'music',
  'sports',
  'tech',
  'arts',
  'food',
  'business',
  'community',
  'wellness',
  'education',
  'other',
]);

const normalizeDomain = (urlString: string): string => {
  try {
    const parsedUrl = new URL(urlString);
    return parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

const normalizeText = (value?: string | null): string => {
  if (!value) return '';
  return value.trim();
};

const parseFutureDate = (dateString: string): Date | null => {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return null;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (parsedDate < startOfToday) return null;
  return parsedDate;
};

const isAllowedTicketUrl = (urlString: string, allowedDomains: Set<string>): boolean => {
  const domain = normalizeDomain(urlString);
  return domain.length > 0 && allowedDomains.has(domain);
};

const getEventSources = async (supabase: ReturnType<typeof createClient>): Promise<EventSource[]> => {
  try {
    const { data, error } = await supabase
      .from('event_sources')
      .select('name, url, country, category, domain, enabled')
      .eq('enabled', true);

    if (error || !data || data.length === 0) {
      return DEFAULT_EVENT_SOURCES;
    }

    return data.map((source) => ({
      name: source.name,
      url: source.url,
      country: source.country,
      category: source.category || 'general',
      domain: source.domain || undefined,
    }));
  } catch (error) {
    console.error('Failed to load event sources, falling back to defaults:', error);
    return DEFAULT_EVENT_SOURCES;
  }
};

const isValidScrapedEvent = (event: ScrapedEvent): boolean => {
  const title = normalizeText(event.title);
  const venue = normalizeText(event.venue);
  const city = normalizeText(event.city);
  const description = normalizeText(event.description);

  if (title.length < 4 || venue.length < 3 || city.length < 2) return false;
  if (!parseFutureDate(event.date)) return false;
  if (description.length > 0 && description.length < 20) return false;
  return true;
};

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
    const cronSecret = Deno.env.get('SCRAPE_CRON_SECRET');
    const cronHeader = req.headers.get('x-cron-secret');
    const isCronRequest = Boolean(cronSecret && cronHeader && cronHeader === cronSecret);

    if (!isCronRequest) {
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
    } else {
      console.log('Cron authenticated');
    }

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

    const sources = await getEventSources(supabase);
    const allowedDomains = new Set(
      sources
        .map((source) => source.domain || normalizeDomain(source.url))
        .filter((domain): domain is string => Boolean(domain))
    );

    // Parse and validate input
    const { url, country } = await req.json().catch(() => ({}));

    if (url) {
      if (typeof url !== 'string' || url.length > 500) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid URL format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!isAllowedTicketUrl(url, allowedDomains)) {
        console.log('URL not in allowed domains:', url);
        return new Response(
          JSON.stringify({ success: false, error: 'URL domain not allowed. Only approved event websites can be scraped.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (country && (typeof country !== 'string' || country.length > 100)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid country format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sourcesToScrape: EventSource[] = url
      ? [{ name: 'Manual', url, country: country || 'Unknown', category: 'general' }]
      : sources;

    const allEvents: ScrapedEvent[] = [];
    let validEventsCount = 0;
    const scrapeTimestamp = new Date().toISOString();

    for (const source of sourcesToScrape) {
      console.log(`Scraping: ${source.url}`);

      const sourceDomain = source.domain || normalizeDomain(source.url);

      try {
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
                content: `You are an event data extractor. Extract event information from the provided content and return a JSON array of events. Each event should have: title, date (in "Month DD, YYYY" format), time (in "HH:MM - HH:MM" format or "TBD"), venue, description (max 200 chars), category (one of: music, sports, tech, arts, food, business, community, wellness, education, other), city, ticket_url (if available), ticket_price (number or null), image_url (if available). Only include real upcoming events with confirmed dates and venues from the official listing source. Return ONLY valid JSON array, no other text.`,
              },
              {
                role: 'user',
                content: `Extract events from this content from ${source.country} (${source.name}):\n\n${markdown.slice(0, 15000)}`,
              },
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
                            category: {
                              type: 'string',
                              enum: ['music', 'sports', 'tech', 'arts', 'food', 'business', 'community', 'wellness', 'education', 'other'],
                            },
                            city: { type: 'string' },
                            ticket_url: { type: 'string' },
                            ticket_price: { type: 'number' },
                            image_url: { type: 'string' },
                          },
                          required: ['title', 'date', 'venue', 'category', 'city'],
                        },
                      },
                    },
                    required: ['events'],
                  },
                },
              },
            ],
            tool_choice: { type: 'function', function: { name: 'extract_events' } },
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
              const normalizedCategory = ALLOWED_CATEGORIES.has(event.category)
                ? event.category
                : 'other';
              const normalizedTicketUrl =
                event.ticket_url && isAllowedTicketUrl(event.ticket_url, allowedDomains)
                  ? event.ticket_url
                  : null;

              const sanitizedEvent: ScrapedEvent = {
                ...event,
                title: normalizeText(event.title),
                venue: normalizeText(event.venue),
                description: normalizeText(event.description || ''),
                category: normalizedCategory,
                country: source.country,
                time: normalizeText(event.time) || 'TBD',
                city: normalizeText(event.city),
                ticket_url: normalizedTicketUrl,
                ticket_price: event.ticket_price || null,
                image_url: event.image_url || null,
                source_url: source.url,
                source_domain: sourceDomain,
              };

              if (!isValidScrapedEvent(sanitizedEvent)) {
                continue;
              }

              allEvents.push(sanitizedEvent);
              validEventsCount += 1;
            }

            console.log(`Extracted ${events.length} events from ${source.url}`);
          } catch (parseError) {
            console.error(`Failed to parse AI response for ${source.url}:`, parseError);
          }
        }

        if (source.name !== 'Manual') {
          const { error: sourceUpdateError } = await supabase
            .from('event_sources')
            .update({ last_scraped_at: scrapeTimestamp })
            .eq('url', source.url);

          if (sourceUpdateError) {
            console.error(`Failed to update scrape timestamp for ${source.name}:`, sourceUpdateError);
          }
        }
      } catch (sourceError) {
        console.error(`Error processing ${source.url}:`, sourceError);
      }
    }

    console.log(`Total events extracted: ${allEvents.length}`);

    if (allEvents.length > 0) {
      for (const event of allEvents) {
        try {
          const parsedDate = parseFutureDate(event.date);
          if (!parsedDate) {
            console.log(`Skipping event with invalid date: ${event.title}`);
            continue;
          }

          const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('title', event.title)
            .eq('date', event.date)
            .eq('city', event.city)
            .eq('address', event.venue)
            .maybeSingle();

          if (existing) {
            console.log(`Event already exists: ${event.title}`);
            continue;
          }

          const { error: insertError } = await supabase
            .from('events')
            .insert({
              title: event.title,
              date: event.date,
              time: event.time,
              address: event.venue,
              description: event.description || event.title,
              category: event.category,
              country: event.country,
              city: event.city,
              ticket_url: event.ticket_url,
              ticket_price: event.ticket_price,
              background_image_url: event.image_url || FALLBACK_IMAGE,
              target_date: parsedDate.toISOString(),
              creator: 'OUTSYD Bot',
              source_url: event.source_url,
              source_domain: event.source_domain || null,
              source_verified: true,
              scraped_at: scrapeTimestamp,
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
        valid_count: validEventsCount,
        message: `Scraped and processed ${allEvents.length} events`,
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
