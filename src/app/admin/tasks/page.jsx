import TasksTable from "@/components/admin/tables/TasksTable";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all tasks across families
        </p>
      </div>
      <TasksTable />
    </div>
  );
}

