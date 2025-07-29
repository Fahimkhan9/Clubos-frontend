"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteToken?: string;
};

const fetcher = async (url: string, { arg }: { arg: FormData }) => {
  const response = await api.post(url, arg);
  return response.data;
};

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const [serverError, setServerError] = useState("");
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const { trigger, isMutating } = useSWRMutation("/user/register", fetcher, {
    onError: (err: any) => {
      setServerError(err.response?.data?.message || "Registration failed");
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setInviteToken(token);
      setValue("inviteToken", token); // set form value
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    setServerError("");

    if (data.password !== data.confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }

    try {
      const sendData = {
        name: data.name,
        email: data.email,
        password: data.password,
        inviteToken: data.inviteToken || undefined,
      };
      await trigger(sendData);
      toast.success("Registration successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-teal-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold text-purple-600">Create Account</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    message:
                      "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { required: "Please confirm your password" })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Hidden invite token input */}
            {inviteToken && (
              <input type="hidden" value={inviteToken} {...register("inviteToken")} />
            )}

            {serverError && (
              <p className="text-sm text-red-600 font-medium">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isMutating}
            >
              {isMutating ? "Registering..." : "Register"}
            </Button>

            <div className="text-center mt-4 text-sm text-purple-600">
              <Link href="/login" className="hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
