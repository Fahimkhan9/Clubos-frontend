"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login"); // or "/auth/signin" depending on your app
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
