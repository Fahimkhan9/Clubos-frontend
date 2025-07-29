"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import {api} from "@/lib/axios";
import { format } from "date-fns";
import { MarkAttendanceDialog } from "@/components/event/MarkAttendanceDialog";
import { Loader2, FileIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EventDetails() {
  const { eventId } = useParams();

  const { data, isLoading } = useSWR(`/club/event/${eventId}`, (url) =>
    api.get(url).then((res) => res.data.data)
  );

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  const event = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{event.title}</CardTitle>
          <div className="text-muted-foreground text-sm">
            {format(new Date(event.date), "PPP")} •{" "}
            <Badge variant="outline" className="capitalize">
              {event.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          {event.attachments?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Attachments</h4>
              <ul className="list-disc list-inside space-y-1">
                {event.attachments.map((file: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          <div className="flex justify-end">
            <MarkAttendanceDialog eventId={event._id} clubId={event.club} />
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
