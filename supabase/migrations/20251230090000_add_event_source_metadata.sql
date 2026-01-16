-- Add metadata columns for scraped events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_domain text,
  ADD COLUMN IF NOT EXISTS source_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scraped_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_events_scraped_at ON public.events(scraped_at);

-- Create event sources table to manage reliable scraping targets
CREATE TABLE IF NOT EXISTS public.event_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  domain text NOT NULL,
  country text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  reliability_tier text NOT NULL DEFAULT 'verified',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_scraped_at timestamp with time zone
);

ALTER TABLE public.event_sources
  ADD CONSTRAINT event_sources_url_unique UNIQUE (url);

-- Seed reliable sources
INSERT INTO public.event_sources (name, url, domain, country, category, reliability_tier)
VALUES
  ('Quicket', 'https://www.quicket.co.za/events/', 'quicket.co.za', 'South Africa', 'general', 'verified'),
  ('Webtickets', 'https://www.webtickets.co.za/v2/Events.aspx', 'webtickets.co.za', 'South Africa', 'general', 'verified'),
  ('TicketPro', 'https://www.ticketpro.co.za/portal/web/index.php/event', 'ticketpro.co.za', 'South Africa', 'general', 'verified'),
  ('Kenyabuzz', 'https://www.kenyabuzz.com/events', 'kenyabuzz.com', 'Kenya', 'general', 'verified'),
  ('Eventbrite Nigeria', 'https://www.eventbrite.com/d/nigeria--lagos/events/', 'eventbrite.com', 'Nigeria', 'general', 'verified'),
  ('Eventbrite Ghana', 'https://www.eventbrite.com/d/ghana--accra/events/', 'eventbrite.com', 'Ghana', 'general', 'verified')
ON CONFLICT (url) DO NOTHING;
