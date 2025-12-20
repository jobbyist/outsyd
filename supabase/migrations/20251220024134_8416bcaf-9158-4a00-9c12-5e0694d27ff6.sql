-- Add category, ticket_url, and ticket_price columns to events table
ALTER TABLE public.events 
ADD COLUMN category TEXT NOT NULL DEFAULT 'other',
ADD COLUMN ticket_url TEXT,
ADD COLUMN ticket_price DECIMAL(10,2),
ADD COLUMN country TEXT,
ADD COLUMN city TEXT;

-- Create index for category filtering
CREATE INDEX idx_events_category ON public.events(category);

-- Create index for country/city filtering  
CREATE INDEX idx_events_country ON public.events(country);
CREATE INDEX idx_events_city ON public.events(city);