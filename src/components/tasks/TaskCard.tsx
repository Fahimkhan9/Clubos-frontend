import { useDraggable } from "@dnd-kit/core";
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

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white shadow-md p-3 rounded border"
    >
      <div className="font-semibold">{task.title}</div>
      {task.assignedTo && (
        <div className="text-sm text-gray-500">Assigned to: {task.assignedTo.name}</div>
      )}
      {task.dueDate && (
        <div className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
