import HabitsTable from "@/components/admin/tables/HabitsTable";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
        <p className="text-muted-foreground mt-2">
          Manage predefined and custom habits
        </p>
      </div>
      <HabitsTable />
    </div>
  );
}


