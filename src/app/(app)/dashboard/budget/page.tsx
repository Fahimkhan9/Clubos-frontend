"use client";

import { useState, useEffect } from "react";
import AddEvent from "@/components/event/AddEvent";
import EventList from "@/components/event/EventList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import useSWR from "swr";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import AddBudget from "@/components/Budget/AddBudget";
import BudgetSummary from "@/components/Budget/BudgetSummary";
import BudgetChart from "@/components/Budget/BudgetChart";
import ExportCSV from "@/components/Budget/ExportCSV";
import { BudgetList } from "@/components/Budget/BudgetList";

export default function EventsPage() {
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  // Fetch clubs user belongs to
  const { data: clubs, error } = useSWR("/club/mys", (url) =>
    api.get(url).then((res) => res.data.data)
  );
 

  useEffect(() => {
    if (clubs && clubs.length > 0 && !selectedClubId) {
      setSelectedClubId(clubs[0]._id); // Default select first club
    } else if (clubs?.length === 0) {
      setSelectedClubId(null); // no clubs available
    }
  }, [clubs]);

  if (error) return <div>Failed to load clubs</div>;
  if (!clubs) return <div>Loading clubs...</div>;

  // Show message if no clubs are associated
  if (clubs?.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        You are not associated with any clubs yet.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>

        {/* Club selector dropdown */}
        <Select
          value={selectedClubId || ""}
          onValueChange={(val) => setSelectedClubId(val)}
        >
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
 {/* Only show AddEvent if a club is selected */}
        {selectedClubId && (
          <div className="p-6 space-y-6">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-semibold">Budget Management</h2>
                 <AddBudget clubId={selectedClubId} />
               </div>
         
               <BudgetSummary key={selectedClubId} clubId={selectedClubId} />
               <BudgetChart  clubId={selectedClubId} />
               <div className="selectedClubId flex justify-end mt-4">
           <ExportCSV clubId={selectedClubId} />
         </div>
         
                <BudgetList clubId={selectedClubId} />
             </div>
        )}
    </div>
  );
}
