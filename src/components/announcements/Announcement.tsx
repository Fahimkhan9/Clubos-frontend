"use client";

import { api } from "@/lib/axios";
import React, { useState } from "react";
import useSWR from "swr";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AddAnnouncement from "./AddAnnouncement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AnnouncementType {
  _id: string;
  title: string;
  message: string;
  expiresAt?: string;
  createdAt: string;
  createdBy?: { name: string };
  priority?: "low" | "medium" | "high";
}

function Announcement({ clubId }: { clubId: string }) {
  const { user } = useCurrentUser();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: members, isLoading: membersLoading } = useSWR(
    clubId ? `/club/${clubId}/members` : null,
    (url) => api.get(url).then((res) => res.data.data)
  );

  const {
    data: announcements,
    isLoading: announcementsLoading,
    mutate,
  } = useSWR<AnnouncementType[]>(
    clubId ? `/announcements/club/${clubId}` : null,
    (url) => api.get(url).then((res) => res.data.data)
  );

  const memberInfo = members?.find((m: any) => m.user.id === user?._id);
  const isAdminOrMod =
    memberInfo?.role === "admin" || memberInfo?.role === "moderator";

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/announcements/${deleteId}`);
      toast.success("Announcement deleted");
      setDeleteId(null);
      mutate();
    } catch {
      toast.error("Failed to delete announcement");
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  if (membersLoading) return <div>Loading members...</div>;
  if (!clubId) return <div>Please select a club to view announcements</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Announcements</h2>
        {isAdminOrMod && <AddAnnouncement clubId={clubId} />}
      </div>

      {announcementsLoading ? (
        <div>Loading announcements...</div>
      ) : announcements?.length === 0 ? (
        <div className="text-gray-500">No announcements yet</div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a._id}>
              <CardHeader className="flex flex-row items-center justify-between space-x-4">
                <div className="flex flex-col">
                  <CardTitle>{a.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    by {a.createdBy?.name || "Unknown"} on{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                      a.priority
                    )}`}
                  >
                    {a.priority?.toUpperCase() || "MEDIUM"}
                  </span>
                  {isAdminOrMod && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(a._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p>{a.message}</p>
                {a.expiresAt && (
                  <p className="text-xs text-gray-400">
                    Expires on: {new Date(a.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this announcement? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Announcement;
