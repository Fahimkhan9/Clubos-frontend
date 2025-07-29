// components/Navbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";

function LoadingDots() {
  return (
    <span className="inline-block w-16 text-center text-primary font-semibold">
      Loading
      <span className="animate-pulse">...</span>
    </span>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, mutate, isLoading } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await api.post("/user/logout"); // your backend logout route
      mutate(null); // reset user
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="flex justify-between items-center py-4 px-6 border-b">
      <Link href="/" className="text-xl font-semibold text-primary">
        Club<span className="text-pink-500">OS</span>
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/dashboard">Dashboard</Link>

        {isLoading ? <LoadingDots/> : isAuthenticated ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
