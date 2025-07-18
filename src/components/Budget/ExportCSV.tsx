"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import useSWR from "swr";
import {api} from "@/lib/axios";

export default function ExportCSV({ clubId }: { clubId: string }) {
  const { data, isLoading, error } = useSWR(`/club/${clubId}/budget`, url =>
    api.get(url).then(res => res.data.data)
  );

  const handleExport = () => {
    if (!data) return;

    const csv = Papa.unparse(
      data.map((b: any) => ({
        Title: b.title,
        Type: b.type,
        Amount: b.amount,
        Category: b.category || "",
        Event: b.event?.name || "N/A",
        CreatedAt: new Date(b.createdAt).toLocaleDateString(),
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `club-${clubId}-budget.csv`);
  };

  return (
    <Button onClick={handleExport} disabled={isLoading || error}>
      <Download className="w-4 h-4 mr-2" /> Export CSV
    </Button>
  );
}
