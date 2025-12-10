import UsersTable from "@/components/admin/tables/UsersTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users across all families
        </p>
      </div>
      <UsersTable />
    </div>
  );
}

