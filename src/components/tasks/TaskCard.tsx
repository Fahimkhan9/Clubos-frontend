"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  dueDate?: string;
  status: "pending" | "in_progress" | "done";
  assignedTo?: {
    _id: string;
    name: string;
    email?: string;
  };
  event?: {
    _id: string;
    name: string;
  };
}

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate?: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${task._id}`, { title, dueDate });
      toast.success("Task updated");
      onUpdate?.();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Task deleted");
      onDelete?.();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white shadow-md p-3 rounded border space-y-2 relative"
    >
      {/* Drag handle only */}
      <div
        {...listeners}
        className="absolute top-2 right-2 cursor-grab text-gray-400 hover:text-gray-600"
        title="Drag"
      >
        <GripVertical size={16} />
      </div>

      <div className="font-semibold">{task.title}</div>
      {task.assignedTo && (
        <div className="text-sm text-gray-500">
          Assigned to: {task.assignedTo.name}
        </div>
      )}
      {task.dueDate && (
        <div className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full mt-2">
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <label className="block font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label className="block font-medium">Due Date</label>
            <Input
              type="date"
              value={dueDate ? dueDate.slice(0, 10) : ""}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <p>
              <span className="font-medium">Status:</span>{" "}
              {task.status.replace("_", " ")}
            </p>
            {task.assignedTo && (
              <p>
                <span className="font-medium">Assigned To:</span>{" "}
                {task.assignedTo.name} ({task.assignedTo.email})
              </p>
            )}
            {task.event && (
              <p>
                <span className="font-medium">Event:</span>{" "}
                {task.event.name || "None"}
              </p>
            )}
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <Button
              variant="destructive"
              type="button"
              onClick={handleDelete}
              className="w-1/2"
            >
              Delete
            </Button>
            <Button type="button" onClick={handleUpdate} className="w-1/2">
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
