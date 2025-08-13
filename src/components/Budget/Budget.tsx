import { api } from '@/lib/axios';
import React from 'react'
import useSWR from 'swr';
import AddBudget from './AddBudget';
import BudgetSummary from './BudgetSummary';
import BudgetChart from './BudgetChart';
import ExportCSV from './ExportCSV';
import { BudgetList } from './BudgetList';
import { useCurrentUser } from '@/hooks/useCurrentUser';

function Budget({clubId}: {clubId: string}) {
      const { user } = useCurrentUser();
    const { data: members, isLoading } = useSWR(
        clubId ? `/club/${clubId}/members` : null,
        (url) => api.get(url).then((res) => res.data.data)
      );
       const memberInfo = members?.find((m: any) => m.user.id === user?._id);
  const isAdminOrMod = memberInfo?.role === "admin" || memberInfo?.role === "moderator";
    if (isLoading) return <div>Loading budget...</div>;
    if (!clubId) return <div>Please select a club to view budget</div>;
    if (!isAdminOrMod) return <div className='text-red-500'>You do not have permission to view this page.Only Admin,Moderators have access</div>;
  return (
    <div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Budget Management</h2>
            <AddBudget clubId={clubId} />
          </div>

          <BudgetSummary key={clubId} clubId={clubId} />
          <BudgetChart clubId={clubId} />
          <div className="selectedClubId flex justify-end mt-4">
            <ExportCSV clubId={clubId} />
          </div>

          <BudgetList clubId={clubId} />
        </div>
    </div>
  )
}

export default Budget