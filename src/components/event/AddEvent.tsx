"use client";

import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string(),
  type: z.enum(["seminar", "workshop", "competition", "other"]),
});

export default function AddEvent({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { mutate } = useSWRConfig();

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      type: "seminar",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("date", values.date);
      formData.append("type", values.type);
      attachments.forEach(file => formData.append("attachments", file));

      await api.post(`/club/${clubId}/event`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event created");
      mutate(`/club/${clubId}/events`);
      setOpen(false);
    } catch (err: any) {
      toast.error("Failed to create event");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Add Event</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <Input placeholder="Title" {...form.register("title")} />
          <Textarea placeholder="Description" {...form.register("description")} />
          <Input type="date" {...form.register("date")} />
          <select className="w-full border rounded px-3 py-2" {...form.register("type")}>
            <option value="seminar">Seminar</option>
            <option value="workshop">Workshop</option>
            <option value="competition">Competition</option>
            <option value="other">Other</option>
          </select>

          <div>
            <label className="font-medium">Attachments (PDF, Image)</label>
            <Input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments(Array.from(e.target.files));
                }
              }}
            />
            {attachments.length > 0 && (
              <ul className="text-sm mt-2 list-disc list-inside">
                {attachments.map(file => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" className="w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
