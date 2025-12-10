import RewardsTable from "@/components/admin/tables/RewardsTable";

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-muted-foreground mt-2">
          Manage all rewards and redemption history
        </p>
      </div>
      <RewardsTable />
    </div>
  );
}

