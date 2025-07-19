"use client";

import { Card, CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function EventCard({ event }: { event: any }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {format(new Date(event.date), "MMMM dd, yyyy")} · {event.type}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-gray-700">{event.description}</p>

        {event.attachments?.length > 0 && (
          <div>
            <p className="font-medium text-sm mb-1">Attachments:</p>
            <div className="flex flex-wrap gap-4">
              {event.attachments.map((file, idx) => (
                <div key={idx} className="flex flex-col items-center max-w-[120px] text-center">
                  {file.fileType.startsWith("image/") ? (
                    <img src={file.url} alt={file.name} className="w-24 h-24 object-cover rounded border" />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded border">
                      <DownloadIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs mt-1 truncate text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
