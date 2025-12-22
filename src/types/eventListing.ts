export interface EventListing {
  city: string;
  city_citation: string;
  category: string;
  category_citation: string;
  name: string;
  name_citation: string;
  date: string;
  date_citation: string;
  time: string;
  time_citation: string;
  venue: string;
  venue_citation: string;
  description: string;
  description_citation: string;
  country?: string; // Inferred from data source
  province?: string; // Inferred from city
}

export interface EventListingData {
  events: EventListing[];
}
