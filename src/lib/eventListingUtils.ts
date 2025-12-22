import { EventListing } from '@/types/eventListing';

// Map South African cities to provinces
const CITY_TO_PROVINCE: { [key: string]: string } = {
  // Gauteng
  'Johannesburg': 'Gauteng',
  'Pretoria': 'Gauteng',
  'Sandton': 'Gauteng',
  'Midrand': 'Gauteng',
  'Brakpan': 'Gauteng',
  
  // Western Cape
  'Cape Town': 'Western Cape',
  'Stellenbosch': 'Western Cape',
  'Hermanus': 'Western Cape',
  'Durbanville': 'Western Cape',
  'Groot Brak River': 'Western Cape',
  
  // KwaZulu-Natal
  'Durban': 'KwaZulu-Natal',
  'Port Edward': 'KwaZulu-Natal',
  
  // Eastern Cape
  'Gqeberha': 'Eastern Cape',
  'Port Elizabeth': 'Eastern Cape',
  
  // Limpopo
  'Polokwane': 'Limpopo',
  
  // North West
  'Sun City': 'North West',
  'Magaliesburg': 'North West',
};

/**
 * Enriches event data with country and province information
 */
export const enrichEventData = (event: EventListing): EventListing => {
  const enriched = { ...event };
  
  // All events in this dataset are from South Africa
  enriched.country = 'South Africa';
  
  // Map city to province
  enriched.province = CITY_TO_PROVINCE[event.city] || 'Other';
  
  // Handle generic "South Africa" city entries
  if (event.city === 'South Africa') {
    enriched.province = 'National';
  }
  
  return enriched;
};

/**
 * Gets unique values from an array of events for a specific field
 */
export const getUniqueValues = (events: EventListing[], field: keyof EventListing): string[] => {
  const values = events
    .map(event => event[field])
    .filter((value): value is string => typeof value === 'string' && value !== '');
  
  return Array.from(new Set(values)).sort();
};

/**
 * Normalizes category names for consistent filtering
 */
export const normalizeCategory = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Parses date string from format "Sat 24 Jan 2025" to Date object
 */
export const parseEventDate = (dateStr: string): Date | null => {
  try {
    // Remove day name and parse
    const parts = dateStr.split(' ');
    if (parts.length >= 4) {
      const day = parts[1];
      const month = parts[2];
      const year = parts[3];
      return new Date(`${month} ${day}, ${year}`);
    }
    return null;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
};
