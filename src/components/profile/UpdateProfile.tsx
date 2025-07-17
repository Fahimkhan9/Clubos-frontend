"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  avatar: z.any().optional(),
  batch: z.string().optional(),
  department: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function UpdateProfile() {
  const { user } = useCurrentUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      batch: user?.batch || "",
      department: user?.department || "",
    },
  });

  const { mutate } = useSWR("/user/profile");
  console.log(user);

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("bio", user.bio || "");
      setValue("batch", user.batch || "");
      setValue("department", user.department || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio || "");
      formData.append("batch", data.batch || "");
      formData.append("department", data.department || "");
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.patch("/user/profile", formData);
      console.log(res)
      mutate();
      toast.success("Profile updated successfully!");

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");

    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Update Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar Preview and Upload */}
        <div className="flex items-center space-x-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
              No Img
            </div>
          )}
          <Input type="file" name="avatar" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Email (Read Only) */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            readOnly
            value={user?.email || ""}
            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={3} {...register("bio")} />
          {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
        </div>
        {/* Batch */}
        <div>
          <Label htmlFor="batch">Batch</Label>
          <Input id="batch" {...register("batch")} />
          {errors.batch && <p className="text-sm text-red-500 mt-1">{errors.batch.message}</p>}
        </div>
        {/* Department */}
        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" {...register("department")} />
          {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
          }
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
