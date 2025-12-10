import FamiliesTable from "@/components/admin/tables/FamiliesTable";

export default function FamilyListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Family List</h1>
        <p className="text-muted-foreground mt-2">
          Manage all families
        </p>
      </div>
      <FamiliesTable />
    </div>
  );
}

