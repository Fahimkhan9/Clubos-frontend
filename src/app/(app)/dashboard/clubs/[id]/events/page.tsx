"use client";

import AddEvent from "@/components/event/AddEvent";
import EventList from "@/components/event/EventList";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";

export default function EventsPage() {
  const { id: clubId } = useParams();

  if (!clubId) return <div>Club ID not found</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <AddEvent clubId={clubId as string}>
          <Button><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
        </AddEvent>
      </div>

      <EventList clubId={clubId as string} />
    </div>
  );
}
