"use client";

import useSWR from "swr";
import {api} from "@/lib/axios";

export default function BudgetSummary({ clubId }: { clubId: string }) {
  const { data, isLoading } = useSWR(`/club/${clubId}/budget/summary`, (url) =>
    api.get(url).then((res) => res.data.data)
  );

  if (isLoading) return <div>Loading summary...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-green-100 p-4 rounded-md">
        <h4 className="font-semibold text-green-800">Total Income</h4>
        <p className="text-2xl font-bold text-green-900">৳{data.income}</p>
      </div>
      <div className="bg-red-100 p-4 rounded-md">
        <h4 className="font-semibold text-red-800">Total Expense</h4>
        <p className="text-2xl font-bold text-red-900">৳{data.expense}</p>
      </div>
    </div>
  );
}
