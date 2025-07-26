import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

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

export default function TaskColumn({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: Task[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-muted rounded-md p-3 min-h-[200px] space-y-3 border"
    >
      <h3 className="font-bold text-muted-foreground">{title}</h3>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
