'use client';
import EventForm from "@/app/components/EventFrom";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
    const router = useRouter();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Add a New Event</h1>
            <EventForm onCompleted={(id) => router.push(`/events/${id}`)} />
        </div>
    );
}