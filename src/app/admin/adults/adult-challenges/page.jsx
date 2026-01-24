import AdultChallengesTable from "@/components/admin/tables/AdultChallengesTable";

export default function AdultChallengesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adult Challenges</h1>
        <p className="text-muted-foreground mt-2">
          Manage challenges for adult users
        </p>
      </div>
      <AdultChallengesTable />
    </div>
  );
}

