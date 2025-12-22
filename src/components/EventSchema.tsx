import React from 'react';
import { EventListing } from '@/types/eventListing';
import { Helmet } from 'react-helmet-async';

interface EventSchemaProps {
  events: EventListing[];
}

/**
 * Generates Google Events Schema (JSON-LD) for SEO
 * https://developers.google.com/search/docs/appearance/structured-data/event
 */
export const EventSchema: React.FC<EventSchemaProps> = ({ events }) => {
  const eventSchemas = events.map((event) => {
    // Create ISO date-time string
    let startDate = event.date;
    if (event.time && event.time !== 'TBC' && event.time.includes(':')) {
      try {
        const [hours, minutes] = event.time.split(':');
        const dateObj = new Date(event.date);
        dateObj.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);
        startDate = dateObj.toISOString();
      } catch (e) {
        // Use date as-is if time parsing fails
        console.error('Error parsing date/time:', event.date, event.time, e);
      }
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.description || event.name,
      startDate: startDate,
      location: {
        '@type': 'Place',
        name: event.venue,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.city,
          addressCountry: event.country || 'South Africa',
        },
      },
      organizer: {
        '@type': 'Organization',
        name: 'Event Organizer',
        url: event.city_citation,
      },
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
    };
  });

  return (
    <Helmet>
      {eventSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

interface SingleEventSchemaProps {
  event: EventListing;
}

/**
 * Generates a single event schema for individual event display
 */
export const SingleEventSchema: React.FC<SingleEventSchemaProps> = ({ event }) => {
  return <EventSchema events={[event]} />;
};
