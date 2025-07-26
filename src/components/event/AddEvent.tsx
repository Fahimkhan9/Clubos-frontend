"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";
import { useSWRConfig } from "swr";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  dueDate: z.string().optional(),
  event: z.string().min(1, "Event is required"),
});

export default function AddTaskModal({
  clubId,
  events,
  onTaskCreated,
}: {
  clubId: string;
  events: any[];
  onTaskCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      event: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await api.post("/task", {
        title: values.title,
        dueDate: values.dueDate || undefined,
        event: values.event,
      });

      toast.success("Task created");
      form.reset();
      setOpen(false);
      mutate(`/task/club/${clubId}`);
      onTaskCreated();
    } catch (err: any) {
      toast.error("Failed to create task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Task</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Task Title" {...form.register("title")} />
          <Input type="date" {...form.register("dueDate")} />

          <select
            {...form.register("event")}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Event</option>
            {events.map((event: any) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
