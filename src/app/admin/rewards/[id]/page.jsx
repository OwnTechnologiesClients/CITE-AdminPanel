import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Gift, Coins, Users, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data - replace with actual API call
async function getReward(id) {
  return {
    id: id,
    name: "Extra Screen Time",
    family: "Doe Family",
    createdBy: "John Doe",
    cost: 100,
    redeemed: 5,
    available: true,
    createdDate: "2024-01-15",
    description: "30 minutes of extra screen time",
  };
}

export default async function ViewRewardPage({ params }) {
  const { id } = await params;
  const reward = await getReward(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/rewards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reward Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage reward information
            </p>
          </div>
        </div>
        <Link href={`/admin/rewards/${id}/edit`}>
          <Button>
            <Edit className="mr-2 size-4" />
            Edit Reward
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="size-5" />
              {reward.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant={reward.available ? "default" : "outline"}>
                {reward.available ? "Available" : "Unavailable"}
              </Badge>
            </div>

            <Separator />

            {reward.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{reward.description}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Family</p>
                  <p className="font-medium">{reward.family}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{reward.createdBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">{new Date(reward.createdDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reward Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Coins className="size-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="text-2xl font-bold">{reward.cost.toLocaleString()} coins</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Times Redeemed</p>
                  <p className="text-2xl font-bold">{reward.redeemed}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

