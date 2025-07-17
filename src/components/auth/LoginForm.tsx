"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

const fetcher = async (url: string, { arg }: { arg: FormData }) => {
  const response = await api.post(url, arg);
  return response.data;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [serverError, setServerError] = useState("");
  const router=useRouter()
  const { trigger, isMutating } = useSWRMutation("/user/login", fetcher, {
    onError: (err: any) => {
      setServerError(err.response?.data?.message || "Login failed");
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    await trigger(data);
    toast.success("Login successful!");
    router.push("/"); // Redirect to home after successful login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-teal-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold text-purple-600">Login</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-600 font-medium">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isMutating}
            >
              {isMutating ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
