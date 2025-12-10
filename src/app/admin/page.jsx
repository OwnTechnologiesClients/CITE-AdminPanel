import { 
  Users, 
  UsersRound, 
  ClipboardList, 
  Gift, 
  Calendar,
  TrendingUp,
  Activity
} from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your family productivity application
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,234"
          change="12.5%"
          changeType="positive"
          icon={Users}
          description="Active members across all families"
        />
        <StatCard
          title="Total Families"
          value="456"
          change="8.2%"
          changeType="positive"
          icon={UsersRound}
          description="Registered family groups"
        />
        <StatCard
          title="Active Tasks"
          value="2,890"
          change="5.1%"
          changeType="positive"
          icon={ClipboardList}
          description="Tasks in progress or pending"
        />
        <StatCard
          title="Rewards Redeemed"
          value="567"
          change="15.3%"
          changeType="positive"
          icon={Gift}
          description="This month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
                <span className="text-sm font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Events Created</span>
                <span className="text-sm font-semibold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Media Uploaded</span>
                <span className="text-sm font-semibold">3,456</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New Users (30d)</span>
                <span className="text-sm font-semibold text-green-600">+156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New Families (30d)</span>
                <span className="text-sm font-semibold text-green-600">+42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                <span className="text-sm font-semibold">78.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">New family registered</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div>
                <p className="font-medium">Task completion milestone</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <div>
                <p className="font-medium">Reward redemption</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

