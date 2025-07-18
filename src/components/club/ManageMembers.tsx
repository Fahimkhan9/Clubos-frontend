"use client";

import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ManageMembers({ clubId, currentUserRole }: {
  clubId: string;
  currentUserRole: string;
}) {
  const { data: members, mutate } = useSWR(`/club/${clubId}/members`, fetcher);
  const [search, setSearch] = useState("");
  if (!members) return <p className="p-6">Loading members...</p>;
  if (members.error) return <p className="p-6 text-red-500">Failed to load members.</p>;
  if (members.data.length === 0) return <p className="p-6">No members found.</p>;
  if (members.data.length === 1 && members.data[0].user === currentUserRole) {
    return <p className="p-6">You are the only member in this club.</p>;
  }
  console.log(members.data);
  
  const filtered = members?.data.filter((m: any) =>
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

  const removeMember = async (userId: string) => {
    try {
      await api.delete(`/club/${clubId}/member/${userId}`);
      toast.success("Removed");
      mutate();
    } catch {
      toast.error("Remove failed");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Manage Members</h2>
      <Input
        placeholder="Search by name/email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-2">
        {filtered?.map((member: any) => (
          <div key={member._id} className="flex justify-between items-center p-3 border rounded">
            <div>
              <p className="font-semibold">{member.user.name}</p>
              <p className="text-sm text-gray-600">{member.user.email}</p>
              <p className="text-xs">Role: {member.role}</p>
            </div>
            {currentUserRole !== "member" && (
              <div className="flex gap-2">
                <select
                  value={member.role}
                  onChange={e => updateRole(member._id, e.target.value)}
                  className="border rounded px-2"
                >
                  <option value="member">Member</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
                <Button variant="destructive" onClick={() => removeMember(member._id)}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
