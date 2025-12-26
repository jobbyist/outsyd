import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import arrowDown from '@/assets/arrow-down.png';
import { SEOHead } from '@/components/SEOHead';
import { EventsCarousel } from '@/components/EventsCarousel';
import { RotatingBadge } from '@/components/RotatingBadge';
import { CategoryFilter } from '@/components/CategoryFilter';
import { LocationFilter } from '@/components/LocationFilter';
import { EventSearch } from '@/components/EventSearch';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { PremiumSection } from '@/components/PremiumSection';
import { CurrencyLanguageSelector } from '@/components/CurrencyLanguageSelector';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { EVENT_CATEGORIES, EventCategory } from '@/constants/eventCategories';

const EVENTS_PER_PAGE = 12;

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  background_image_url: string;
  target_date: string;
  address: string;
  category: string;
  country: string | null;
  city: string | null;
  ticket_url: string | null;
  ticket_price: number | null;
  description?: string;
}

const EventCard = ({
  event
}: {
  event: Event;
}) => {
  const navigate = useNavigate();
  
  const now = new Date().getTime();
  const target = new Date(event.target_date).getTime();
  const oneHour = 1000 * 60 * 60;
  const isLive = now >= target && now <= target + oneHour;
  const isPast = target < now - oneHour;
  const categoryInfo = EVENT_CATEGORIES.find(c => c.value === event.category);
  
  return (
    <div 
      className={cn("relative cursor-pointer group", isPast && "opacity-70")}
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="overflow-hidden mb-3">
        <div 
          className={cn(
            "aspect-square bg-muted bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110",
            isPast && "grayscale-[30%]"
          )}
          style={{ backgroundImage: `url(${event.background_image_url})` }}
        ></div>
      </div>
      <div className="absolute top-4 left-4 flex flex-col gap-0">
        <div className="bg-background border border-foreground px-3 h-[23px] flex items-center">
          <div className="text-[11px] font-medium uppercase leading-none">{event.date}</div>
        </div>
        <div className="bg-background border border-t-0 border-foreground px-3 h-[23px] flex items-center">
          <div className="text-[11px] font-medium leading-none">{event.time}</div>
        </div>
        {categoryInfo && (
          <div className="bg-background border border-t-0 border-foreground px-3 h-[23px] flex items-center gap-1">
            <span className="text-[11px]">{categoryInfo.emoji}</span>
            <div className="text-[11px] font-medium uppercase leading-none">{categoryInfo.label}</div>
          </div>
        )}
        {isLive && (
          <div className="gradient-brand border border-t-0 border-foreground px-3 h-[23px] flex items-center">
            <div className="text-[11px] font-medium uppercase leading-none">LIVE NOW</div>
          </div>
        )}
        {isPast && (
          <div className="bg-muted border border-t-0 border-foreground px-3 h-[23px] flex items-center">
            <div className="text-[11px] font-medium uppercase leading-none text-muted-foreground">PAST EVENT</div>
          </div>
        )}
      </div>
      {event.ticket_url && !isPast && (
        <div className="absolute top-4 right-4">
          <div className="gradient-brand border border-foreground px-2 h-[23px] flex items-center">
            <div className="text-[11px] font-medium uppercase leading-none">
              {event.ticket_price ? `$${event.ticket_price}` : 'Tickets'}
            </div>
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium">{event.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{event.address}</p>
    </div>
  );
};

const Discover = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState<string>('Africa');
  const [initialDateSet, setInitialDateSet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEvents();
    detectUserCountry();
  }, []);

  useEffect(() => {
    if (!initialDateSet && events.length > 0) {
      const today = new Date();
      const now = today.getTime();
      const oneHour = 1000 * 60 * 60;
      
      const hasEventsToday = events.some((event) => {
        const eventDate = new Date(event.target_date);
        const target = eventDate.getTime();
        const hasEnded = target < now - oneHour;
        
        if (hasEnded) return false;
        
        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate()
        );
      });
      
      if (hasEventsToday) {
        setDate(today);
      }
      setInitialDateSet(true);
    }
  }, [events, initialDateSet]);

  const detectUserCountry = async () => {
    try {
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      const data = await response.text();
      const locMatch = data.match(/loc=([A-Z]{2})/);
      
      if (locMatch && locMatch[1]) {
        const countryCode = locMatch[1];
        const countryNames: { [key: string]: string } = {
          'ZA': 'South Africa', 'NG': 'Nigeria', 'GH': 'Ghana', 'KE': 'Kenya',
          'BW': 'Botswana', 'TZ': 'Tanzania', 'UG': 'Uganda', 'RW': 'Rwanda',
          'ET': 'Ethiopia', 'SN': 'Senegal', 'CI': 'Côte d\'Ivoire', 'MA': 'Morocco',
          'EG': 'Egypt', 'MU': 'Mauritius', 'ZM': 'Zambia', 'ZW': 'Zimbabwe',
          'NA': 'Namibia', 'MZ': 'Mozambique', 'AO': 'Angola', 'CM': 'Cameroon'
        };
        setUserCountry(countryNames[countryCode] || 'Africa');
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error detecting country:', error);
      setUserCountry('Africa');
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, background_image_url, target_date, address, category, country, city, ticket_url, ticket_price, description')
        .order('target_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesDescription = event.description?.toLowerCase().includes(query);
      const matchesAddress = event.address.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesAddress) return false;
    }
    
    // Category filter
    if (selectedCategory && event.category !== selectedCategory) return false;
    
    // Country filter
    if (selectedCountry && event.country !== selectedCountry) return false;
    
    // City filter
    if (selectedCity && event.city !== selectedCity) return false;
    
    // Date filter
    if (date) {
      const eventDate = new Date(event.target_date);
      const selectedDate = new Date(date);
      
      if (
        eventDate.getFullYear() !== selectedDate.getFullYear() ||
        eventDate.getMonth() !== selectedDate.getMonth() ||
        eventDate.getDate() !== selectedDate.getDate()
      ) {
        return false;
      }
    }
    
    return true;
  });

  // Featured events - show first 6 events sorted by date (prioritize upcoming)
  const featuredEvents = useMemo(() => {
    const now = new Date().getTime();
    return [...events]
      .sort((a, b) => {
        const aDate = new Date(a.target_date).getTime();
        const bDate = new Date(b.target_date).getTime();
        const aIsFuture = aDate >= now;
        const bIsFuture = bDate >= now;
        // Prioritize future events
        if (aIsFuture && !bIsFuture) return -1;
        if (!aIsFuture && bIsFuture) return 1;
        // For same category (both future or both past), sort by date
        return aDate - bDate;
      })
      .slice(0, 6);
  }, [events]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCountry, selectedCity, date, searchQuery]);

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events-section');
    eventsSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCountry(null);
    setSelectedCity(null);
    setDate(undefined);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedCountry || selectedCity || date || searchQuery;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Discover Events"
        description="Explore popular events across Africa. Find music festivals, tech conferences, sports events, and more in South Africa, Nigeria, Ghana, Kenya, and beyond."
        keywords="events, discover events, African events, music festivals, tech conferences, sports events, nightlife, OUTSYD"
      />
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>
      
      <RotatingBadge 
        text="BROWSE" 
        onClick={scrollToEvents}
        showIcon={true}
        icon={<img src={arrowDown} alt="Arrow down" className="w-6 h-6 md:w-7 md:h-7 lg:w-12 lg:h-12" />}
      />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-6 md:pb-16 lg:pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 md:mb-10 inline-flex flex-col items-center" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="flex items-center">
              <span className="border border-foreground px-3 md:px-6 py-2 md:py-4 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Discover</span>
              <span className="gradient-brand border border-foreground px-3 md:px-6 py-2 md:py-4 rounded-[20px] md:rounded-[40px] -ml-px animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>events</span>
            </div>
            <div className="flex items-center -mt-px">
              <span className="border border-foreground px-3 md:px-6 py-2 md:py-4 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>across</span>
              <span className="border border-l-0 border-foreground px-3 md:px-6 py-2 md:py-4 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>Africa</span>
            </div>
          </h1>
          <p className="text-sm md:text-base lg:text-[18px] text-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            Explore music festivals, tech conferences, sports events, and more across the continent. Get tickets and never miss out.
          </p>
        </div>
      </section>

      <EventsCarousel />

      {/* Events Section */}
      <section id="events-section" className="px-4 md:px-8 pb-16 pt-6 md:pt-16">
        <div>
          {/* Search Bar */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.75s', animationFillMode: 'both' }}>
            <EventSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Filters Header */}
          <div className="mb-6 md:mb-8 animate-fade-in space-y-4" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <h2 className="text-base md:text-lg lg:text-xl font-normal">Browsing events in</h2>
              <span className="text-base md:text-lg lg:text-xl font-normal border border-foreground px-2 py-1">{selectedCountry || userCountry}</span>
              
              {/* Calendar button for mobile/tablet */}
              <div className="lg:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "text-base md:text-lg lg:text-xl font-normal border border-l-0 border-foreground px-2 py-1 flex items-center bg-background hover:bg-muted transition-colors",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "MMM do, yyyy") : <span>Pick a date</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={date} 
                      onSelect={setDate} 
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Category Filter */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            {/* Location Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <LocationFilter
                selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                onCountryChange={setSelectedCountry}
                onCityChange={setSelectedCity}
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-[11px] font-medium uppercase border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Featured Events Section - Show when no filters active */}
          {!hasActiveFilters && featuredEvents.length > 0 && (
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.85s', animationFillMode: 'both' }}>
              <h3 className="text-xl md:text-2xl font-medium mb-6">Featured Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${0.9 + (index * 0.1)}s`, animationFillMode: 'both' }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsored Ad Placeholder */}
          <div className="my-8">
            <AdPlaceholder size="leaderboard" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 mt-8 md:mt-16">
            {/* Calendar - Desktop only */}
            <div className="hidden lg:block animate-fade-in lg:sticky lg:top-24 self-start space-y-6" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
              <Calendar mode="single" selected={date} onSelect={setDate} className="mx-auto" />
              {/* Sidebar Ad */}
              <AdPlaceholder size="square" className="mx-auto" />
            </div>

            {/* Event Grid */}
            <div className="lg:col-start-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Loading events...</span>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  {hasActiveFilters ? (
                    <div>
                      <p className="mb-4">No events found matching your filters</p>
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm font-medium uppercase border border-foreground hover:bg-foreground hover:text-background transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    'No events found'
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedEvents.map((event, index) => (
                      <div 
                        key={event.id} 
                        className="animate-fade-in" 
                        style={{ animationDelay: `${0.1 + (index * 0.05)}s`, animationFillMode: 'both' }}
                      >
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="icon"
                              onClick={() => {
                                setCurrentPage(pageNum);
                                scrollToEvents();
                              }}
                              className={currentPage === pageNum ? "gradient-brand text-foreground" : ""}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-sm text-muted-foreground ml-4">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom Ad Placeholder */}
          <div className="mt-12">
            <AdPlaceholder size="banner" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Discover;
