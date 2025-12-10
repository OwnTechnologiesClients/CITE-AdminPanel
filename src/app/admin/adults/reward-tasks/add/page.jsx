import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RewardTaskForm from "@/components/admin/forms/RewardTaskForm";

export default function AddRewardTaskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/reward-tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Reward Task</h1>
          <p className="text-muted-foreground mt-2">
            Create a new reward task template
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Task Information</CardTitle>
          <CardDescription>
            Enter the details for the new reward task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RewardTaskForm />
        </CardContent>
      </Card>
    </div>
  );
}

