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
    <div className="space-y-4">
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
            className="border p-4 rounded-md flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground">
                ৳{item.amount} |{" "}
                <Badge
                  variant={item.type === "income" ? "outline" : "destructive"}
                >
                  {item.type}
                </Badge>{" "}
                |{" "}
                {item.createdAt &&
                  format(new Date(item.createdAt), "PPP")}{" "}
                by {item.createdBy.email}
              </p>
              {item.category && (
                <p className="text-xs text-muted-foreground">
                  Category: {item.category}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setEditingItem(item)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(item._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
