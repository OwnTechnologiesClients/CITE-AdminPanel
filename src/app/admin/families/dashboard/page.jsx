"use client";

import { useState, useEffect } from "react";
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
import { getFamiliesDashboardStats } from "@/lib/api/stats";
import { getFamilies } from "@/lib/api/families";
import { getFamilyEvents, getFamilyMeals, getFamilyLists } from "@/lib/api/families";

export default function FamiliesDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [totalLists, setTotalLists] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats and families
        const [statsData, families] = await Promise.all([
          getFamiliesDashboardStats().catch(() => ({ totalFamilies: { value: 0 }, activeFamilies: { value: 0 }, totalMembers: { value: 0 } })),
          getFamilies().catch(() => []),
        ]);

        setStats(statsData);

        // Fetch events, meals, and lists for all families
        const eventPromises = families.map(family => 
          getFamilyEvents(family._id).catch(() => [])
        );
        const mealPromises = families.map(family => 
          getFamilyMeals(family._id).catch(() => [])
        );
        const listPromises = families.map(family => 
          getFamilyLists(family._id).catch(() => [])
        );

        const [eventsArrays, mealsArrays, listsArrays] = await Promise.all([
          Promise.all(eventPromises),
          Promise.all(mealPromises),
          Promise.all(listPromises),
        ]);

        const totalEventsCount = eventsArrays.reduce((sum, events) => sum + events.length, 0);
        const totalMealsCount = mealsArrays.reduce((sum, meals) => sum + meals.length, 0);
        const totalListsCount = listsArrays.reduce((sum, lists) => sum + lists.length, 0);

        setTotalEvents(totalEventsCount);
        setTotalMeals(totalMealsCount);
        setTotalLists(totalListsCount);
      } catch (err) {
        console.error("Error fetching families dashboard stats:", err);
        setError(err.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Families Dashboard</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Families Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  const totalFamilies = stats?.totalFamilies?.value || 0;
  const activeFamilies = stats?.activeFamilies?.value || 0;
  const totalMembers = stats?.totalMembers?.value || 0;

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

