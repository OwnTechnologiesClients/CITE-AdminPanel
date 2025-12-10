import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Calendar, Heart } from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";

export default function AdultsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adult Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage adult users, habits, routines, and reflections
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Adults"
          value="567"
          change="10.2%"
          changeType="positive"
          icon={Users}
          description="Active adult users"
        />
        <StatCard
          title="Active Habits"
          value="1,234"
          change="8.5%"
          changeType="positive"
          icon={Target}
          description="Habits being tracked"
        />
        <StatCard
          title="Daily Routines"
          value="890"
          change="12.1%"
          changeType="positive"
          icon={Calendar}
          description="Routines created"
        />
        <StatCard
          title="Reflections"
          value="2,345"
          change="15.3%"
          changeType="positive"
          icon={Heart}
          description="Mood/feeling entries"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">New habit created</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <div>
                <p className="font-medium">Routine completed</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
              <div>
                <p className="font-medium">Reflection logged</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Habits Completed Today</span>
                <span className="text-sm font-semibold">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Routines Active</span>
                <span className="text-sm font-semibold">567</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reflections Today</span>
                <span className="text-sm font-semibold">89</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


