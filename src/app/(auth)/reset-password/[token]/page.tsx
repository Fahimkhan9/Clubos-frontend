"use client"; // if using App Router

import { useState } from "react";
import { useRouter } from "next/navigation"; // or next/router if using Pages Router
import { useParams } from "next/navigation"; // or useRouter.query.token in Pages Router
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams(); // For App Router; use `useRouter().query.token` in Pages Router

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/user/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen">
     <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Enter new password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
   </div>
  );
}
