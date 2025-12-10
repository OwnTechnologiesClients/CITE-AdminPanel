import KidsTable from "@/components/admin/tables/KidsTable";

export default function KidsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kids</h1>
        <p className="text-muted-foreground mt-2">
          Manage all kids in the Parents & Kids module
        </p>
      </div>
      <KidsTable />
    </div>
  );
}


