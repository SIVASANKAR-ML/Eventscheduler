// src/app/components/EventList.tsx
'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
// Make sure this path is correct
import { GET_UPCOMING_EVENTS } from '@/app/lib/graphql';

// This interface MUST match the fields in your GET_UPCOMING_EVENTS query
interface Event {
  _id: string;
  title: string;
  startTime: string; // The backend sends dates as ISO strings
  location: string;
}

export default function EventList() {
  // This hook does all the work of fetching the data
  const { loading, error, data } = useQuery(GET_UPCOMING_EVENTS);

  // 1. Handle the loading state
  if (loading) {
    return <p className="text-center text-neutral-400 p-8">Loading events...</p>;
  }

  // 2. Handle the error state
  if (error) {
    return <p className="text-center text-red-500 p-8">Error fetching events: {error.message}</p>;
  }
  
  // 3. Handle the case where there is no data or an empty array of events
  if (!data || !data.events || data.events.length === 0) {
    return <p className="text-center text-neutral-400 p-8">No upcoming events found. Create one!</p>;
  }

  // 4. If data exists, render the list
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.events.map((event: Event) => (
        <Link href={`/events/${event._id}`} key={event._id}>
          <div className="border border-neutral-700 bg-neutral-800/50 rounded-lg p-6 flex flex-col gap-3 h-full hover:border-neutral-500 transition-colors cursor-pointer">
            <h2 className="text-xl font-bold text-white">{event.title}</h2>
            
            <div className="text-sm text-neutral-400 flex flex-col gap-2 mt-1">
              {/* Format the date string into a more readable format */}
              <span>🗓️ {new Date(event.startTime).toLocaleString()}</span>
              <span>📍 {event.location}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}