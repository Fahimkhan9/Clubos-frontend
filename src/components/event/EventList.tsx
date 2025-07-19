"use client";

import useSWR from "swr";
import {api} from "@/lib/axios";
import EventCard from "./EventCard";


export default function EventList({ clubId }: { clubId: string }) {
  const { data, error, isLoading } = useSWR(`/club/${clubId}/event`, (url) =>
    api.get(url).then((res) => res.data.data)
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading events</p>;

  if (!data || data.length === 0) return <p>No events found</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data.map((event: any) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
