"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InviteMember from "./InviteMember";
import ManageMembers from "./ManageMembers";


const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ClubDetails() {
  const { id } = useParams(); 
  const { user } = useCurrentUser();

  const { data: club, isLoading } = useSWR(`/club/${id}`, fetcher);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (!club) return <p className="p-6 text-red-500">Club not found.</p>;
  const memberInfo = club.data.members.find((m: { user: any; }) => m.user === user?._id);
  const isAdminOrMod = memberInfo.role === 'admin' || memberInfo.role === 'moderator';

const isAdmin= memberInfo.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* 1. Club Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{club.data.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>About:</strong> {club.data.about}</p>
          <p><strong>University:</strong> {club.data.university}</p>
          <p><strong>Session:</strong> {club.data.sessionYear}</p>
          <p><strong>Total Members:</strong> {club.data.members.length}</p>
          <p><strong>Your Role:</strong> {memberInfo.role}</p>
          <p><strong>Your Designation:</strong> {memberInfo.designation}</p>

        </CardContent>
      </Card>

      {/*  Invite Members */}
      <div className="flex justify-end my-6">
        
      {isAdminOrMod && <InviteMember clubId={id as string} />}
      </div>
{!isAdminOrMod && (
  <div className="fixed bottom-6 right-6 z-50">
    <Card className="shadow-lg w-[280px] border-primary border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Limited Access</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>Only admins and moderators can:</p>
        <ul className="list-disc list-inside">
          <li>Invite members</li>
          <li>Manage members</li>
          <li>Export member data</li>
        </ul>
      </CardContent>
    </Card>
  </div>
)}


      {/*  Member Management */}
      {
        isAdmin && <ManageMembers clubId={id as string} currentUserRole={memberInfo.role} />
      }
    </div>
  );
}
