"use client";

import useSWR from "swr";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import EditBudgetDialog from "./EditBudgetDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BudgetList({ clubId }: { clubId: string }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);

  const query = new URLSearchParams();
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);

  const { data, isLoading, mutate } = useSWR(
    `/club/${clubId}/budget?${query.toString()}`,
    (url) => api.get(url).then((res) => res.data.data)
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      await api.delete(`/club/${clubId}/budget/${id}`);
      toast.success("Budget entry deleted");
      mutate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="start">Start Date</Label>
          <Input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end">End Date</Label>
          <Input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Budget Entries */}
      {isLoading ? (
        <p>Loading budget entries...</p>
      ) : data?.length === 0 ? (
        <p className="text-gray-500 text-sm">No budget entries found.</p>
      ) : (
        data.map((item: any) => (
          <div
            key={item._id}
            className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between gap-4 items-start">
              {/* Left Section */}
<div className="space-y-1">
  <h4 className="text-lg font-semibold text-purple-700 flex items-center gap-1">
    {item.type === "income" ? "💰" : "💸"} {item.title}
  </h4>

  <p className="text-sm text-muted-foreground">
    {item.amount.toLocaleString()}{" "}
    <Badge
      variant={item.type === "income" ? "outline" : "destructive"}
      className="ml-2 capitalize"
    >
      {item.type}
    </Badge>
  </p>

  {/* Added on section */}
  <p className="text-xs text-muted-foreground">
    Added on{" "}
    <span className="font-medium">
      {format(new Date(item.createdAt), "PPP")}
    </span>
  </p>

  {/* Added by section with avatar */}
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <img
      src={item.createdBy?.avatar || "/default-avatar.png"}
      alt={item.createdBy?.email}
      className="w-6 h-6 rounded-full object-cover border"
    />
    <span>
      Added by <span className="text-purple-600 font-medium">{item.createdBy?.email}</span>
    </span>
  </div>

  {item.category && (
    <p className="text-xs text-gray-500">📂 Category: {item.category}</p>
  )}
</div>




              {/* Right Actions */}
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setEditingItem(item)}
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(item._id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Reusable Edit Dialog */}
      {editingItem && (
        <EditBudgetDialog
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          clubId={clubId}
          onUpdated={mutate}
        />
      )}
    </div>
  );
}
