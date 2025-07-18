import AddBudget from "@/components/Budget/AddBudget";
import BudgetChart from "@/components/Budget/BudgetChart";
import { BudgetList } from "@/components/Budget/BudgetList";
import BudgetSummary from "@/components/Budget/BudgetSummary";
import ExportCSV from "@/components/Budget/ExportCSV";


export default function ClubBudgetPage({ params }: { params: { id: string } }) {
  const clubId = params.id;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Budget Management</h2>
        <AddBudget clubId={clubId} />
      </div>

      <BudgetSummary clubId={clubId} />
      <BudgetChart  clubId={clubId} />
      <div className="flex justify-end mt-4">
  <ExportCSV clubId={clubId} />
</div>

       <BudgetList clubId={clubId} />
    </div>
  );
}
