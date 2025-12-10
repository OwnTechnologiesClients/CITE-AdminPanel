import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RewardForm from "@/components/admin/forms/RewardForm";

export default function AddRewardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/rewards">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Reward</h1>
          <p className="text-muted-foreground mt-2">
            Create a new reward
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Information</CardTitle>
          <CardDescription>
            Enter the details for the new reward
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RewardForm />
        </CardContent>
      </Card>
    </div>
  );
}


