import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGooglePlacesAutocomplete } from '@/hooks/useGooglePlacesAutocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { AuthSheet } from '@/components/AuthSheet';
import { SEOHead } from '@/components/SEOHead';
import { z } from 'zod';
import { EVENT_CATEGORIES, EventCategory } from '@/constants/eventCategories';
import { AFRICAN_COUNTRIES, getCitiesByCountry } from '@/constants/africanLocations';
import { ChevronDown } from 'lucide-react';

const eventSchema = z.object({
  eventName: z.string().trim().min(1, 'Event name is required').max(200, 'Event name must be less than 200 characters'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (e.g., 15:00)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (e.g., 16:00)'),
  location: z.string().trim().min(1, 'Location is required').max(300, 'Location must be less than 300 characters'),
  description: z.string().trim().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
});

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [category, setCategory] = useState<EventCategory>('other');
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { onPlaceSelected } = useGooglePlacesAutocomplete(locationInputRef);

  const cities = country ? getCitiesByCountry(country) : [];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setShowAuthModal(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setShowAuthModal(false);
      } else {
        setShowAuthModal(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    onPlaceSelected((place) => {
      const address = place.formatted_address || place.name || '';
      setLocation(address);
    });
  }, [onPlaceSelected]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, GIF, or WebP image');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }
    if (!endDate) {
      toast.error('Please select an end date');
      return;
    }
    if (!imageFile) {
      toast.error('Please add an event image');
      return;
    }

    const validationResult = eventSchema.safeParse({
      eventName,
      startTime,
      endTime,
      location,
      description,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    if (endDateTime <= startDateTime) {
      toast.error('End date/time must be after start date/time');
      return;
    }

    setIsSubmitting(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      const targetDate = new Date(startDate);
      const [hours, minutes] = startTime.split(':');
      targetDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);

      const dateStr = format(startDate, 'MMMM dd, yyyy');
      const timeStr = `${startTime} - ${endTime}`;

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      const creatorName = profile?.display_name || user.email?.split('@')[0] || 'Anonymous';

      const { error: insertError } = await supabase
        .from('events')
        .insert({
          title: eventName,
          description: description,
          date: dateStr,
          time: timeStr,
          address: location,
          background_image_url: publicUrl,
          target_date: targetDate.toISOString(),
          creator: creatorName,
          category: category,
          country: country || null,
          city: city || null,
          ticket_url: ticketUrl || null,
          ticket_price: ticketPrice ? parseFloat(ticketPrice) : null,
        });

      if (insertError) throw insertError;

      toast.success('Event created successfully!');
      navigate('/my-events');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Create Event | Outsyde"
        description="Create and publish a new event for your community to discover and join on Outsyde"
      />
      <AuthSheet isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {user ? (
          <div className="max-w-7xl mx-auto pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
              {/* Left: Image Upload */}
              <div className="flex flex-col gap-3 md:gap-4">
                <label className="w-full aspect-[4/3] border border-foreground bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-foreground text-[11px] font-medium uppercase tracking-wider">
                      ADD IMAGE
                    </span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                
                {imagePreview && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 text-[13px] font-medium uppercase tracking-wider border border-foreground bg-background hover:bg-foreground hover:text-background transition-colors"
                  >
                    Change image
                  </button>
                )}
              </div>

              {/* Right: Form Fields */}
              <div className="space-y-4 md:space-y-6">
                <input
                  type="text"
                  placeholder="Event name"
                  className="w-full text-foreground text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-none mb-4 md:mb-8 focus:outline-none bg-transparent border-none p-0 placeholder:text-muted-foreground"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />

                {/* Category Select */}
                <div className="grid grid-cols-2 gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {EVENT_CATEGORIES.find(c => c.value === category)?.emoji}
                          {EVENT_CATEGORIES.find(c => c.value === category)?.label || 'Category'}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0 max-h-64 overflow-y-auto" align="start">
                      {EVENT_CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2",
                            category === cat.value && "bg-muted font-medium"
                          )}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>

                  {/* Country Select */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none flex items-center justify-between">
                        <span>{country || 'Country'}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0 max-h-64 overflow-y-auto" align="start">
                      {AFRICAN_COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCountry(c.name);
                            setCity('');
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                            country === c.name && "bg-muted font-medium"
                          )}
                        >
                          {c.name}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* City Select */}
                {country && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none flex items-center justify-between">
                        <span>{city || 'Select City'}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0 max-h-64 overflow-y-auto" align="start">
                      {cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCity(c)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                            city === c && "bg-muted font-medium"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}

                {/* Start/End Date/Time */}
                <div className="relative">
                  <div className="grid grid-cols-[80px_1fr_80px] md:grid-cols-[100px_1fr_100px] gap-0 border border-foreground mb-4 md:mb-6">
                    <div className="flex items-center justify-start gap-1.5 md:gap-2 border-r border-foreground px-2 md:px-3 py-2 md:py-3">
                      <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-foreground rounded-full"></div>
                      <span className="text-[14px] md:text-[17px] font-medium">Start</span>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-left border-r border-foreground focus:outline-none bg-background",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          {startDate ? format(startDate, "EEE, dd MMM") : "Thu, 28 Oct"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <input
                      type="text"
                      placeholder="15:00"
                      className="px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground text-center focus:outline-none placeholder:text-muted-foreground bg-transparent"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-[80px_1fr_80px] md:grid-cols-[100px_1fr_100px] gap-0 border border-foreground">
                    <div className="flex items-center justify-start gap-1.5 md:gap-2 border-r border-foreground px-2 md:px-3 py-2 md:py-3">
                      <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-foreground rounded-full"></div>
                      <span className="text-[14px] md:text-[17px] font-medium">End</span>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-left border-r border-foreground focus:outline-none bg-background",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          {endDate ? format(endDate, "EEE, dd MMM") : "Thu, 28 Oct"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <input
                      type="text"
                      placeholder="16:00"
                      className="px-2 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground text-center focus:outline-none placeholder:text-muted-foreground bg-transparent"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Add event location"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none placeholder:text-muted-foreground bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ticket URL (optional)"
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none placeholder:text-muted-foreground bg-transparent"
                    value={ticketUrl}
                    onChange={(e) => setTicketUrl(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Price (optional)"
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none placeholder:text-muted-foreground bg-transparent"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                  />
                </div>

                {/* Description */}
                <textarea
                  placeholder="Add description"
                  rows={6}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-[14px] md:text-[17px] text-foreground border border-foreground focus:outline-none resize-none placeholder:text-muted-foreground bg-transparent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Submit Button */}
                <div className="group flex items-center self-stretch relative overflow-hidden mt-4 md:mt-8">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex h-[50px] justify-center items-center gap-2.5 border relative px-2.5 py-3.5 border-solid transition-all duration-300 ease-in-out w-[calc(100%-50px)] z-10 bg-foreground border-foreground group-hover:w-full group-hover:bg-[#FA76FF] group-hover:border-[#FA76FF] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Create event"
                  >
                    <span className="text-background text-[13px] font-normal uppercase relative transition-colors duration-300 group-hover:text-foreground">
                      {isSubmitting ? 'CREATING...' : 'CREATE EVENT'}
                    </span>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-[18px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <path d="M0.857178 6H10.3929" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6.39282 10L10.3928 6L6.39282 2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <div className="flex w-[50px] h-[50px] justify-center items-center border absolute right-0 bg-background rounded-[99px] border-solid border-foreground transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-50 pointer-events-none z-0">
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="arrow-icon"
                      aria-hidden="true"
                    >
                      <path d="M0.857178 6H10.3929" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M6.39282 10L10.3928 6L6.39282 2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CreateEvent;
