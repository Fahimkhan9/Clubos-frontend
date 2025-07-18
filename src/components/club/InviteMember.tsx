"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "moderator", "member"]),
  designation: z.string().min(2, "Designation is required"),
});

type InviteSchema = z.infer<typeof inviteSchema>;

export default function InviteMember({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InviteSchema>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteSchema) => {
    try {
      await api.post(`/club/${clubId}/invite`, data);
      toast.success("Invitation sent!");
      reset();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send invite.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a New Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Designation</Label>
            <Input placeholder="e.g. General Secretary" {...register("designation")} />
            {errors.designation && <p className="text-sm text-red-500">{errors.designation.message}</p>}
          </div>

          <div>
            <Label>Role</Label>
            <Select onValueChange={(value) => setValue("role", value as InviteSchema["role"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            Send Invite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
