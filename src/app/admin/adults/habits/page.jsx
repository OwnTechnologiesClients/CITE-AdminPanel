"use client";

import HabitsTable from "@/components/admin/tables/HabitsTable";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
        <p className="text-muted-foreground mt-2">
          View all habits from adult users
        </p>
      </div>
      <HabitsTable />
    </div>
  );
}


