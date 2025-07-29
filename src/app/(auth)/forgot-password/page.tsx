"use client"; // if you're using the App Router

import { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter from "next/router" if you're on Pages Router
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { api } from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/user/forgot-password", { email });
      toast.success("Reset link sent! Check your email.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen">
     <div className="max-w-md  mx-auto mt-10 p-6 border rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Enter your email and we'll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
   </div>
  );
}
