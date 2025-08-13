"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { useState } from "react";
import { useSWRConfig } from "swr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const announcementSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  message: z.string().min(5, "Message is too short"),
  expiresAt: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(date) > today;
      },
      { message: "Date must be in the future" }
    ),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

type FormValues = z.infer<typeof announcementSchema>;

export default function AddAnnouncement({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      expiresAt: "",
      priority: "medium",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await api.post(`/announcements/club/${clubId}`, {
        club: clubId,
        ...values,
        expiresAt: values.expiresAt || undefined,
      });
      toast.success("Announcement created");
      mutate(`/announcements/club/${clubId}`);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Announcement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="Announcement title" />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea {...form.register("message")} placeholder="Your message here" />
          </div>
          <div>
            <Label>Priority</Label>
            <Select
              value={form.getValues("priority")}
              onValueChange={(val) =>
                form.setValue("priority", val, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date (optional)</Label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...form.register("expiresAt")}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
