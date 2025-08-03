'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSWRConfig } from 'swr';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import useSWR from 'swr';

const taskSchema = z.object({
  title: z.string().min(3),
  dueDate: z.string().optional(),
  event: z.string(),
  assignedTo: z.string(),
});

export default function AddTaskModal({ clubId, currentUserId }: { clubId: string; currentUserId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const { data: events } = useSWR(`/club/${clubId}/event`, (url) =>
    api.get(url).then((res) => res.data.data)
  );
  const { data: members } = useSWR(`/club/${clubId}/members`, (url) =>
    api.get(url).then((res) => res.data.data)
  );

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      dueDate: '',
      event: '',
      assignedTo: '',
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        assignedBy: currentUserId,
      };

      await api.post('/tasks', payload);
      toast.success('Task created');
      mutate(`/tasks/club/${clubId}`);
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error('Failed to create task');
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">+ Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...form.register('title')} placeholder="Task title" />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" {...form.register('dueDate')} />
          </div>
          <div>
            <Label>Assign To</Label>
            <Select onValueChange={(val) => form.setValue('assignedTo', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((m: any) => (
                  <SelectItem key={m.user.id} value={m.user.id}>
                    {m.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Event</Label>
            <Select onValueChange={(val) => form.setValue('event', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events?.map((e: any) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
