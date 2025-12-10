import ParentsTable from "@/components/admin/tables/ParentsTable";

export default function ParentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parents</h1>
        <p className="text-muted-foreground mt-2">
          Manage all parents in the Parents & Kids module
        </p>
      </div>
      <ParentsTable />
    </div>
  );
}


