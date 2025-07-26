"use client";
import useSWR from "swr";
import { api } from "@/lib/axios";
import TaskBoard from "./TaskBoard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AddTaskModal from "./AddTaskModal";

export default function TaskBoardWrapper({ clubId }: { clubId: string }) {
  const { data: tasksData, mutate } = useSWR(`/tasks/club/${clubId}`, (url) =>
    api.get(url).then((res) => res.data.data)
  );

  const { user } = useCurrentUser();
  const userId = user?._id;

  if (!tasksData) return <div>Loading tasks...</div>;
  
  return (
   <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <AddTaskModal clubId={clubId} currentUserId={userId} />
      </div>
<TaskBoard tasks={tasksData} mutate={mutate} currentUserId={userId} />
      
    </div>
  );
}
