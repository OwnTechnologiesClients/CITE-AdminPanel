import AdultsTable from "@/components/admin/tables/AdultsTable";

export default function AdultsUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adults</h1>
        <p className="text-muted-foreground mt-2">
          Manage all adult users
        </p>
      </div>
      <AdultsTable />
    </div>
  );
}


