import RewardTasksTable from "@/components/admin/tables/RewardTasksTable";

export default function RewardTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reward Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Manage reward tasks for adult users
        </p>
      </div>
      <RewardTasksTable />
    </div>
  );
}

