"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export default function AcceptInvitation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useCurrentUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // safely access token on client
    const token = searchParams?.get("token");

    if (!token) {
      toast.error("No invite token provided.");
      router.push("/dashboard");
      return;
    }

    if (userLoading) return;

    if (!user) {
      router.push(`/register?token=${encodeURIComponent(token)}`);
      return;
    }

    const acceptInvite = async () => {
      try {
        setLoading(true);
        await api.post("/club/accept", { inviteToken: token });
        toast.success("Invitation accepted! You are now a club member.");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Failed to accept invitation.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    acceptInvite();
  }, [user, userLoading, router]); // don't include searchParams here

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Processing invitation...</p>
      </div>
    );
  }

  return null;
}
