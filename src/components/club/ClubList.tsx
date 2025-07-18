'use client';

import useSWR from 'swr';
import { api } from '@/lib/axios'; // Axios instance with JWT header
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

type Club = {
  _id: string;
  name: string;
  about: string;
  logo: string;
  university: string;
  sessionYear: string;
  createdBy: string;
  members: {
    user: string;
    role: string;
    designation: string;
    joinedAt: string;
  }[];
};

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function ClubList() {
  const { data, error, isLoading } = useSWR<Club[]>('/club/my', fetcher);
const {user} = useCurrentUser();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-500">Failed to load clubs.</div>;

  if (!data || data.length === 0) return <div>No clubs found.</div>;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        data.map((club)=>{
              const memberInfo = club.members.find(m => m.user === user?._id);
            return (
                <Card key={club._id} className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img
                src={club.logo || '/default-logo.png'}
                alt={club.name}
                width={48}
                height={48}
                className="rounded-full border"
              />
              <CardTitle className="text-xl">{club.name}</CardTitle>
            </div>
            <p className="text-muted-foreground text-sm">{club.university} • {club.sessionYear}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{club.about}</p>
             <p className="text-xs text-gray-500">
                Role: {memberInfo?.role || 'N/A'}<br />
                Designation: {memberInfo?.designation || 'N/A'}
              </p>
              <Link href={`/dashboard/clubs/${club._id}`}>
      <Button className="w-full">Visit</Button>
    </Link>
          </CardContent>
        </Card>
            )
        })
      }
    </div>
  );
}
