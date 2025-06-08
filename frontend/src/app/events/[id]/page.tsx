'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_EVENT_BY_ID, DELETE_EVENT, GET_UPCOMING_EVENTS } from '@/app/lib/graphql';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useState } from 'react';
import EventForm from '@/app/components/EventFrom';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error } = useQuery(GET_EVENT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [deleteEvent, { loading: deleteLoading }] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      router.push('/events');
    },
    refetchQueries: [{ query: GET_UPCOMING_EVENTS }],
    onError: (err) => {
        alert(`Error deleting event: ${err.message}`);
    }
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent({ variables: { id } });
    }
  };

  if (loading) return <p className="text-center">Loading event details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!data || !data.event) return <p className="text-center">Event not found.</p>;

  const { event } = data;

  if (isEditing) {
    return <EventForm initialData={event} onCompleted={() => setIsEditing(false)} />;
  }
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <p className="text-lg text-gray-600 mb-6">{event.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div className="info-item">
          <strong className="block text-gray-800">Start Time:</strong>
          <span>{format(new Date(event.startTime), 'PPpp')}</span>
        </div>
        <div className="info-item">
          <strong className="block text-gray-800">End Time:</strong>
          <span>{format(new Date(event.endTime), 'PPpp')}</span>
        </div>
        <div className="info-item">
          <strong className="block text-gray-800">Location:</strong>
          <span>{event.location}</span>
        </div>
        <div className="info-item">
          <strong className="block text-gray-800">Recurring:</strong>
          <span>{event.isRecurring ? 'Yes' : 'No'}</span>
        </div>
        {event.isRecurring && event.recurrenceRule && (
          <div className="info-item md:col-span-2">
            <strong className="block text-gray-800">Recurrence Rule:</strong>
            <span>{event.recurrenceRule}</span>
          </div>
        )}
      </div>
    </div>
  );
}