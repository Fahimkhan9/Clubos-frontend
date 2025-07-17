"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useSWRMutation from 'swr/mutation';
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser"; 
import { api } from '@/lib/axios';

const createClubSchema = z.object({
  name: z.string().min(2),
  about: z.string().min(10),
  university: z.string().min(2),
  sessionYear: z.string().min(4),
  designation: z.string().min(2),
  logo: z.any().optional(),
});

type CreateClubForm = z.infer<typeof createClubSchema>;

async function createClubRequest(url: string, { arg }: { arg: FormData }) {
  const res = await api.post(url, arg);
  return res.data;
}

export default function CreateClub() {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useCurrentUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateClubForm>({
    resolver: zodResolver(createClubSchema),
  });

  const { trigger, isMutating } = useSWRMutation('/club', createClubRequest);

  // Watch for logo file and generate preview
  const logoFile = watch("logo");

  useEffect(() => {
    const file = logoFile?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [logoFile]);

  const onSubmit = async (data: CreateClubForm) => {
    try {
        console.log(data);
        
      const formData = new FormData();
      formData.append("name", data.name);
        formData.append("about", data.about);
        formData.append("university", data.university);
        formData.append("sessionYear", data.sessionYear);
        formData.append("designation", data.designation);
        if (data.logo && data.logo.length > 0) {
            formData.append("logo", data.logo[0]);
        }
     
      for (const [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
      

      await trigger(formData);
      toast.success("Club created successfully!");
      reset();
      setPreview(null);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create club");
    }
  };

  return (
    <div className="mb-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Club</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create a New Club</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <Card>
              <CardHeader>
                <CardTitle>Club Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Name</Label>
                  <Input {...register("name",{
                    required: "Club name is required",
                    minLength: {
                      value: 2,
                      message: "Club name must be at least 2 characters long"
                    },
                    maxLength: {
                      value: 100,
                      message: "Club name cannot exceed 100 characters"
                    }
                  })} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                  <Label>About</Label>
                  <Input {...register("about",{
                    required: "About section is required",
                    minLength: {
                      value: 10,
                      message: "About section must be at least 10 characters long"
                    },
                    maxLength: {
                      value: 500,
                      message: "About section cannot exceed 500 characters"
                    }
                  })} />
                  {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}
                </div>

                <div>
                  <Label>University</Label>
                  <Input {...register("university",{
                    required: "University is required",
                    minLength: {
                      value: 2,
                      message: "University name must be at least 2 characters long"
                    },
                    maxLength: {
                      value: 100,
                      message: "University name cannot exceed 100 characters"
                    }
                  })} />
                  {errors.university && <p className="text-red-500 text-sm">{errors.university.message}</p>}
                </div>

                <div>
                  <Label>Session Year</Label>
                  <Input {...register("sessionYear",{
                    required: "Session year is required",
                    minLength: {
                      value: 4,
                      message: "Session year must be at least 4 characters long"
                    },
                    maxLength: {
                      value: 10,
                      message: "Session year cannot exceed 10 characters"
                    },
                    
                  })} />
                  {errors.sessionYear && <p className="text-red-500 text-sm">{errors.sessionYear.message}</p>}
                </div>

                <div>
                  <Label>Designation (e.g., Founder, President)</Label>
                  <Input {...register("designation",{
                    required: "Designation is required",
                    minLength: {
                      value: 2,
                      message: "Designation must be at least 2 characters long"
                    },
                    maxLength: {
                      value: 50,
                      message: "Designation cannot exceed 50 characters"
                    }
                  })} />
                  {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
                </div>

                <div>
                  <Label>Logo</Label>
                  <Input type="file" accept="image/*" {...register("logo")} />
                  {preview && (
                    <img
                      src={preview}
                      alt="Logo Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-md border"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isMutating}>
                  {isMutating ? "Creating..." : "Create"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
