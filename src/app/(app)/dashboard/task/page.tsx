"use client";


import { useState, useEffect } from "react";
import useSWR from "swr";
import { api } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import TaskBoardWrapper from "@/components/tasks/TaskBoardWrapper";


export default function TaskPage() {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const { data: clubs, error } = useSWR("/club/mys", (url) => api.get(url).then((res) => res.data.data));

  useEffect(() => {
    if (clubs?.length > 0 && !selectedClubId) {
      setSelectedClubId(clubs[0]._id);
    }
  }, [clubs]);

  if (error) return <div>Failed to load clubs</div>;
  if (!clubs) return <div>Loading clubs...</div>;
  if (clubs.length === 0) return <div className="p-4">You are not associated with any clubs.</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Select Club</h1>
        <div className="flex gap-2">
          <Select value={selectedClubId || ""} onValueChange={setSelectedClubId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a club" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((club: any) => (
                <SelectItem key={club._id} value={club._id}>
                  {club.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
       
        </div>
      </div>
      <div>
           {selectedClubId && <TaskBoardWrapper clubId={selectedClubId} />}
      </div>
    </div>
  );
}


