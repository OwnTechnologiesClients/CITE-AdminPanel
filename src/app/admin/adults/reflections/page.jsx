import ReflectionsTable from "@/components/admin/tables/ReflectionsTable";

export default function ReflectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reflections</h1>
        <p className="text-muted-foreground mt-2">
          View mood and feeling reflections from adult users
        </p>
      </div>
      <ReflectionsTable />
    </div>
  );
}


