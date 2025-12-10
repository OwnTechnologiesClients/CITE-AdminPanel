import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RewardForm from "@/components/admin/forms/RewardForm";

// Mock data - replace with actual API call
async function getReward(id) {
  return {
    id: id,
    name: "Extra Screen Time",
    family: "Doe Family",
    createdBy: "John Doe",
    cost: 100,
    available: true,
    description: "30 minutes of extra screen time",
  };
}

export default async function EditRewardPage({ params }) {
  const { id } = await params;
  const reward = await getReward(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/rewards/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Reward</h1>
          <p className="text-muted-foreground mt-2">
            Update reward information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Information</CardTitle>
          <CardDescription>
            Update the details for this reward
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RewardForm initialData={reward} />
        </CardContent>
      </Card>
    </div>
  );
}

