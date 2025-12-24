"use client";

import HabitsTable from "@/components/admin/tables/HabitsTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground mt-2">
            Manage predefined and custom habits
          </p>
        </div>
        <Link href="/admin/adults/habits/sessions">
          <Button variant="outline">
            <Activity className="size-4 mr-2" />
            View Sessions
          </Button>
        </Link>
      </div>
      <HabitsTable />
    </div>
  );
}


