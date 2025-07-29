"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Users, ClipboardList } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function DashboardPage() {
  const router = useRouter();

  const { data: clubsData, isLoading: loadingClubs } = useSWR("/club/mys", fetcher);
  const { data: tasksData, isLoading: loadingTasks } = useSWR("/tasks/my", fetcher);


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome back 👋</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <DashboardCard
          icon={<Users className="text-blue-600 w-6 h-6" />}
          label="Clubs Joined"
          value={loadingClubs ? <Skeleton className="h-5 w-10" /> : clubsData?.length}
          onClick={() => router.push("/dashboard/clubs")}
          buttonText="View Clubs"
        />
        <DashboardCard
          icon={<ClipboardList className="text-yellow-600 w-6 h-6" />}
          label="My Tasks"
          value={loadingTasks ? <Skeleton className="h-5 w-10" /> : tasksData?.length}
          onClick={() => router.push("/dashboard/task")}
          buttonText="View Tasks"
        />
       
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  label,
  value,
  onClick,
  buttonText,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  onClick?: () => void;
  buttonText?: string;
}) {
  return (
    <Card className="flex flex-col justify-between h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
      {onClick && buttonText && (
        <CardFooter>
          <Button size="sm" className="w-full" onClick={onClick}>
            {buttonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
