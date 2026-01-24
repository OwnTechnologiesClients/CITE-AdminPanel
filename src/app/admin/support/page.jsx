import SupportTable from "@/components/admin/tables/SupportTable";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to user support requests from all modules
        </p>
      </div>
      <SupportTable />
    </div>
  );
}
