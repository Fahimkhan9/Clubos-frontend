"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";

export default function InviteMember({ clubId }: { clubId: string }) {
  const { register, handleSubmit, reset } = useForm<{ email: string }>();

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await api.post(`/club/${clubId}/invite`, { email });
      toast.success("Invitation sent!");
      reset();
    } catch (err) {
      toast.error("Failed to send invite.");
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Invite Member</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Button type="submit">Invite</Button>
      </form>
    </div>
  );
}
