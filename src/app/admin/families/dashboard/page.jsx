"use client";

import { 
  UsersRound, 
  ClipboardList, 
  Calendar,
  Utensils,
  List as ListIcon,
  TrendingUp,
  Activity
} from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleFamily } from "@/lib/sampleData/families";

// Mock data - in real app, fetch from API
const mockFamilies = [
  sampleFamily,
  {
    id: 2,
    name: "Smith Family",
    members: 3,
    parents: 2,
    kids: 1,
    status: "active",
    createdDate: "2024-02-20",
    lastActivity: "2024-12-14",
    events: [],
    meals: [],
    lists: [],
  },
  {
    id: 3,
    name: "Johnson Family",
    members: 5,
    parents: 2,
    kids: 3,
    status: "active",
    createdDate: "2024-01-10",
    lastActivity: "2024-12-15",
    events: [],
    meals: [],
    lists: [],
  },
];

export default function FamiliesDashboard() {
  // Calculate stats from mock data
  const totalFamilies = mockFamilies.length;
  const totalMembers = mockFamilies.reduce((sum, f) => sum + f.members, 0);
  const totalEvents = mockFamilies.reduce((sum, f) => sum + (f.events?.length || 0), 0);
  const totalMeals = mockFamilies.reduce((sum, f) => sum + (f.meals?.length || 0), 0);
  const totalLists = mockFamilies.reduce((sum, f) => sum + (f.lists?.length || 0), 0);
  const activeFamilies = mockFamilies.filter(f => f.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Families Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of all family activities and statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Families"
          value={totalFamilies.toString()}
          change={`${activeFamilies} active`}
          changeType="positive"
          icon={UsersRound}
          description="Registered family groups"
        />
        <StatCard
          title="Total Members"
          value={totalMembers.toString()}
          change="Across all families"
          changeType="positive"
          icon={UsersRound}
          description="Family members"
        />
        <StatCard
          title="Total Events"
          value={totalEvents.toString()}
          change="Scheduled"
          changeType="positive"
          icon={Calendar}
          description="Family events"
        />
        <StatCard
          title="Total Meals"
          value={totalMeals.toString()}
          change="Recorded"
          changeType="positive"
          icon={Utensils}
          description="Meal entries"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Family Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Families</span>
                <span className="text-sm font-semibold">{activeFamilies}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Shopping Lists</span>
                <span className="text-sm font-semibold">{totalLists}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Inactive Families</span>
                <span className="text-sm font-semibold">{totalFamilies - activeFamilies}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
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
                <p className="font-medium">Event scheduled</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <div>
                <p className="font-medium">Meal recorded</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListIcon className="size-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Members per Family</span>
                <span className="text-sm font-semibold">
                  {totalFamilies > 0 ? Math.round(totalMembers / totalFamilies) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Events per Family</span>
                <span className="text-sm font-semibold">
                  {totalFamilies > 0 ? Math.round(totalEvents / totalFamilies) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Meals per Family</span>
                <span className="text-sm font-semibold">
                  {totalFamilies > 0 ? Math.round(totalMeals / totalFamilies) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

