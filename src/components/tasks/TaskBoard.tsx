import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import TaskColumn from "./TaskColumn";

import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";

const statuses = ["pending", "in_progress", "done"];
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
export default function TaskBoard({
  tasks,
  mutate,
  currentUserId,
}: {
  tasks: Task[];
  mutate: () => void;
  currentUserId?: string;
}) {
  const [filterMyTasks, setFilterMyTasks] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const filteredTasks = filterMyTasks
    ? tasks.filter((t) => t.assignedTo?._id === currentUserId)
    : tasks;

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success("Task updated");
      mutate();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Task Board</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterMyTasks}
            onChange={() => setFilterMyTasks((prev) => !prev)}
          />
          My Tasks
        </label>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <TaskColumn
              key={status}
              id={status}
              title={status.replace("_", " ").toUpperCase()}
              tasks={filteredTasks.filter((t) => t.status === status)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
