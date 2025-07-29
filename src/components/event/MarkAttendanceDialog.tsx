"use client";

import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function MarkAttendanceDialog({
  eventId,
  clubId,
}: {
  eventId: string;
  clubId: string;
}) {
  const [open, setOpen] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentUser();

  const { data: members, isLoading } = useSWR(
    open ? `/club/${clubId}/members` : null,
    (url) => api.get(url).then((res) => res.data.data)
  );

  const handleSelect = (memberId: string, value: string) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const records = Object.entries(attendance).map(([memberId, status]) => ({
        memberId,
        status,
      }));
      await api.post(`/attendance/${eventId}`, { records });
      setOpen(false);
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!members) return;

    const headers = ["Name", "Email", "Status"];
    const rows = members.map((member: any) => {
      const status = attendance[member.user.id] || "present";
      return [member.user.name, member.user.email, status];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendance_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const memberInfo = members?.find((m: any) => m.user.id === user?._id);
  const isAdminOrMod = memberInfo?.role === "admin" || memberInfo?.role === "moderator";

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Mark Attendance</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>

          {isAdminOrMod ? (
            isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                <ScrollArea className="h-[400px] pr-4 space-y-4">
                  {members?.map((member: any) => (
                    <div
                      key={member.user.id}
                      className="flex justify-between items-center gap-4"
                    >
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                      </div>
                      <Select
                        value={attendance[member.user.id] || "present"}
                        onValueChange={(value) => handleSelect(member.user.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </ScrollArea>

                <div className="flex justify-between mt-4">
                  <Button
                    variant="secondary"
                    onClick={handleExportCSV}
                    disabled={members?.length === 0}
                  >
                    Export CSV
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Submit
                  </Button>
                </div>
              </>
            )
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              You do not have permission to mark attendance.
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
