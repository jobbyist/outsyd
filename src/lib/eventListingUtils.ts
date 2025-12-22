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

// Valid month abbreviations for parsing
const MONTH_MAP: { [key: string]: number } = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
  'January': 0, 'February': 1, 'March': 2, 'April': 3,
  'June': 5, 'July': 6, 'August': 7, 'September': 8,
  'October': 9, 'November': 10, 'December': 11
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
      const day = parseInt(parts[1]);
      const monthStr = parts[2];
      const year = parseInt(parts[3]);
      
      // Validate month
      const month = MONTH_MAP[monthStr];
      if (month === undefined) {
        console.error('Invalid month name:', monthStr);
        return null;
      }
      
      // Create date object
      const date = new Date(year, month, day);
      
      // Validate the created date
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateStr);
        return null;
      }
      
      return date;
    }
    return null;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
};
