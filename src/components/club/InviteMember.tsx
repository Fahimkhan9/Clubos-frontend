"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mutate } from "swr";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "moderator", "member"]),
  designation: z.string().min(2, "Designation is required"),
});

type InviteSchema = z.infer<typeof inviteSchema>;

export default function InviteMember({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

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
      const res = await api.post(`/club/${clubId}/invite`, data);
      if (res.data.inviteLink) {
        toast.success(`Invite Email Sent to ${data.email} successfully!`);
      } else {
        toast.success(`${data.email} has been added to club successfully!`);
      }
      setOpen(false);
      setInviteLink(res.data.inviteLink);
      reset();
      mutate(`/club/${clubId}/members`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to generate invite.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite Member</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Invite a New Member</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            If the email belongs to a registered user, they will be{" "}
            <span className="font-medium">directly added</span> to the club. If
            not, they will receive an{" "}
            <span className="font-medium">invitation email</span> to join.
          </p>
          <p className='text-sm text-gray-600 mt-1"'>
            We suggest that user registers first on our platform before inviting to avoid invite email going to spam.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Alert / Warning */}
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-md p-2">
            ⚠️ Please carefully type the email address. Incorrect emails will
            not receive the invite.
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Designation</Label>
            <Input
              placeholder="e.g. General Secretary"
              {...register("designation")}
            />
            {errors.designation && (
              <p className="text-sm text-red-500">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div>
            <Label>Role</Label>
            <Select
              onValueChange={(value) =>
                setValue("role", value as InviteSchema["role"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Send Invite / Add Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
