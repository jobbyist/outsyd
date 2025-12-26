import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { SEOHead } from '@/components/SEOHead';
import { EventSchema } from '@/components/EventSchema';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { EventListing, EventListingData } from '@/types/eventListing';
import { enrichEventData, getUniqueValues, parseEventDate } from '@/lib/eventListingUtils';
import eventData from '@/../data/extract-data-2025-12-22.json';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, Tag, X } from 'lucide-react';

const Events = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load and enrich event data
  const enrichedEvents = useMemo(() => {
    const data = eventData as EventListingData;
    return data.events.map(enrichEventData);
  }, []);

  // Get unique filter values
  const countries = useMemo(() => getUniqueValues(enrichedEvents, 'country'), [enrichedEvents]);
  const provinces = useMemo(() => {
    const filtered = selectedCountry === 'all' 
      ? enrichedEvents 
      : enrichedEvents.filter(e => e.country === selectedCountry);
    return getUniqueValues(filtered, 'province');
  }, [enrichedEvents, selectedCountry]);
  const categories = useMemo(() => getUniqueValues(enrichedEvents, 'category'), [enrichedEvents]);

  // Reset province when country changes
  useEffect(() => {
    if (selectedCountry === 'all') {
      setSelectedProvince('all');
    } else {
      // Reset province if the selected province is not in the new country's provinces
      const validProvinces = provinces;
      if (selectedProvince !== 'all' && !validProvinces.includes(selectedProvince)) {
        setSelectedProvince('all');
      }
    }
  }, [selectedCountry, provinces, selectedProvince]);

  // Filter events based on selections
  const filteredEvents = useMemo(() => {
    return enrichedEvents.filter((event) => {
      if (selectedCountry !== 'all' && event.country !== selectedCountry) return false;
      if (selectedProvince !== 'all' && event.province !== selectedProvince) return false;
      if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
      return true;
    });
  }, [enrichedEvents, selectedCountry, selectedProvince, selectedCategory]);

  // Sort by date
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredEvents]);

  const clearFilters = () => {
    setSelectedCountry('all');
    setSelectedProvince('all');
    setSelectedCategory('all');
  };

  const hasActiveFilters = selectedCountry !== 'all' || selectedProvince !== 'all' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Event Listings - Find Events Near You"
        description="Browse comprehensive event listings across South Africa, Nigeria, Kenya, and Ghana. Filter by location and category to discover concerts, festivals, conferences, sports events, and entertainment near you. Updated daily with the latest African events."
        keywords="event listings, events South Africa, concerts Nigeria, festivals Kenya, entertainment Ghana, events near me, African event calendar, Johannesburg events, Lagos entertainment, Nairobi concerts, Accra festivals, event directory Africa, upcoming events"
      />
      
      {/* Inject JSON-LD schema for SEO */}
      <EventSchema events={sortedEvents} />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-8 md:pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-4 md:mb-6">
            <span className="border border-foreground px-3 md:px-6 py-2 md:py-4">Event</span>
            <span className="bg-[#ff6bff] border border-foreground px-3 md:px-6 py-2 md:py-4 rounded-[20px] md:rounded-[40px] -ml-px">Listings</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Discover {enrichedEvents.length} events across South Africa. Filter by location and category to find what interests you.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-muted/30 border border-border rounded-lg p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Filters
              </h2>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Country Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country
                </label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Province/Region Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Province/Region
                </label>
                <Select 
                  value={selectedProvince} 
                  onValueChange={setSelectedProvince}
                  disabled={provinces.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {sortedEvents.length} of {enrichedEvents.length} events
            </div>
          </div>
        </div>
      </section>

      {/* Sponsored Ad */}
      <section className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <AdPlaceholder size="leaderboard" />
        </div>
      </section>

      {/* Events List Section */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No events found matching your filters.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters}>Clear Filters</Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedEvents.map((event, index) => (
                <EventCard key={`${event.name}-${event.date}-${event.venue}-${index}`} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Sponsored Ad */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <AdPlaceholder size="banner" />
        </div>
      </section>
    </div>
  );
};

interface EventCardProps {
  event: EventListing;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card">
      <div className="p-4 md:p-5 space-y-3">
        {/* Category Badge */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {event.category}
          </span>
          {event.province && (
            <span className="text-xs text-muted-foreground">
              {event.province}
            </span>
          )}
        </div>

        {/* Event Name */}
        <h3 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">
          {event.name}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-foreground">{event.venue}</div>
              <div className="text-xs">{event.city}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && event.description !== event.name && (
          <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
            {event.description}
          </p>
        )}

        {/* Source Link */}
        <div className="pt-2">
          <a
            href={event.city_citation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Events;
