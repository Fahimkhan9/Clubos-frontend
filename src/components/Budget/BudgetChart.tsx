"use client";

import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid } from "recharts";
import useSWR from "swr";
import {api} from "@/lib/axios";

export default function BudgetChart({ clubId }: { clubId: string }) {
  const { data, isLoading, error } = useSWR(`/club/${clubId}/budget/monthly`, url =>
    api.get(url).then(res => res.data.data)
  );

  if (isLoading) return <p className="p-4">Loading chart...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load chart.</p>;

  return (
    <div className="bg-base-200 p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4">Monthly Income & Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#16a34a" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#dc2626" name="Expense" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
