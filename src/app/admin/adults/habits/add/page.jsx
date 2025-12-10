import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import HabitForm from "@/components/admin/forms/HabitForm";

export default function AddHabitPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/habits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Habit</h1>
          <p className="text-muted-foreground mt-2">
            Create a new habit for adult users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Habit Information</CardTitle>
          <CardDescription>
            Enter the details for the new habit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HabitForm />
        </CardContent>
      </Card>
    </div>
  );
}

