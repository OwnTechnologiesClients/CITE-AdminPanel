import EventsTable from "@/components/admin/tables/EventsTable";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all family events
        </p>
      </div>
      <EventsTable />
    </div>
  );
}

