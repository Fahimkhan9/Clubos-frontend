"use client";

import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

export default function ManageMembers({
  clubId,
  currentUserRole,
}: {
  clubId: string;
  currentUserRole: string;
}) {
  const { data: members, mutate } = useSWR(`/club/${clubId}/members`, fetcher);
  const [search, setSearch] = useState("");
  const [designationEdit, setDesignationEdit] = useState<{ [key: string]: string }>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  if (!members) return <p className="p-6">Loading members...</p>;
  if (members.error) return <p className="p-6 text-red-500">Failed to load members.</p>;
  if (members.length === 0) return <p className="p-6">No members found.</p>;
  if (members.length === 1 && members[0].user === currentUserRole) {
    return <p className="p-6">You are the only member in this club.</p>;
  }

  const filtered = members.filter((m: any) =>
    m.user.name.toLowerCase().includes(search.toLowerCase()) ||
    m.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/club/${clubId}/members/${userId}`, { role });
      toast.success("Role updated");
      mutate();
    } catch {
      toast.error("Update failed");
    }
  };

  const updateDesignation = async (userId: string) => {
    try {
      const newDesignation = designationEdit[userId];
      await api.patch(`/club/${clubId}/members/${userId}`, { designation: newDesignation });
      toast.success("Designation updated");
      mutate();
    } catch {
      toast.error("Failed to update designation");
    }
  };

  const removeMember = async () => {
    if (!selectedMember) return;
    try {
      await api.delete(`/club/${clubId}/members/${selectedMember.user.id}`);
      toast.success("Removed");
      mutate();
    } catch {
      toast.error("Remove failed");
    } finally {
      setConfirmOpen(false);
      setSelectedMember(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Role", "Designation"];
    const rows = filtered.map((member: any) => [
      member.user.name,
      member.user.email,
      member.role,
      member.designation || "",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `members_${clubId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
console.log(members);
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Manage Members</h2>

      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <Input
          placeholder="Search by name/email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button onClick={handleExportCSV} variant="secondary">
          Export CSV
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((member: any) => (
          <div
            key={member._id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded"
          >
            <div className="space-y-1">
              <p className="font-semibold">{member.user.name}</p>
              <p className="text-sm text-gray-600">{member.user.email}</p>
              <p className="text-xs">Role: {member.role}</p>
              <p className="text-xs">Designation: {member.designation || "Not set"}</p>
            </div>

            {currentUserRole !== "member" && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <select
                  value={member.role}
                  onChange={(e) => updateRole(member.user.id, e.target.value)}
                  className="border rounded px-2"
                >
                  <option value="member">Member</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>

                <Input
                  type="text"
                  placeholder="Edit designation"
                  value={designationEdit[member.user.id] ?? member.designation ?? ""}
                  onChange={(e) =>
                    setDesignationEdit((prev) => ({
                      ...prev,
                      [member.user.id]: e.target.value,
                    }))
                  }
                  className="w-40"
                />
                <Button onClick={() => updateDesignation(member.user.id)} variant="outline">
                  Update
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedMember(member);
                    setConfirmOpen(true);
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to remove{" "}
            <span className="font-medium">{selectedMember?.user.name}</span> (
            {selectedMember?.user.email}) from the club? This action cannot be undone.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={removeMember}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
