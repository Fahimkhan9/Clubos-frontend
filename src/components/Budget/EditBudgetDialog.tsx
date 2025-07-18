"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {api} from "@/lib/axios";
import { toast } from "react-hot-toast";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Must be a positive number"),
  type: z.enum(["income", "expense"]),
  category: z.string().optional(),
  event: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditBudgetDialog({
  initialData,
  onClose,
  clubId,
  onUpdated,
}: {
  initialData: any;
  onClose: () => void;
  clubId: string;
  onUpdated: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData.title,
      amount: initialData.amount,
      type: initialData.type,
      category: initialData.category || "",
      event: initialData.event || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.patch(`/club/${clubId}/budget/${initialData._id}`, data);
      toast.success("Budget updated");
      reset();
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Amount</Label>
            <Input type="number" {...register("amount")} />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label>Type</Label>
            <select
              {...register("type")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Label>Category (optional)</Label>
            <Input {...register("category")} />
          </div>

          <div>
            <Label>Event ID (optional)</Label>
            <Input {...register("event")} />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
