"use client";

import { useState } from "react";
import useSWR from "swr";
import {api} from "@/lib/axios";
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

export function MarkAttendanceDialog({ eventId, clubId }: { eventId: string; clubId: string }) {
  const [open, setOpen] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { data: members, isLoading } = useSWR(open ? `/club/${clubId}/members` : null, (url) =>
    api.get(url).then((res) => res.data.data)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Mark Attendance</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4 space-y-4">
            {members?.map((member: any) => (
              <div key={member.user.id} className="flex justify-between items-center gap-4">
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
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
