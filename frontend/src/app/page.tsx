// src/app/events/page.tsx
'use client'; 

import { useState } from 'react';
import EventList from '@/app/components/EventList';
import Modal from '@/app/components/Modal';
import EventForm from '@/app/components/EventFrom'; 

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormCompletion = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center my-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Event Log
            </h1>
            <p className="mt-2 text-lg text-neutral-400">
              Tracking all major operations and system events.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Event
          </button>
        </header>
        
        {/* THIS IS THE KEY PART - it renders your event list */}
        <EventList />

      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create a New Event"
      >
        <EventForm onCompleted={handleFormCompletion} />
      </Modal>
    </>
  );
}