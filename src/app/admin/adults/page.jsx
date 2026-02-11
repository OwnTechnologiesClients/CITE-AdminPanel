"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Calendar, Heart } from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";
import {
  getAdultDashboardStats,
  getHabitAnalytics,
  getReflectionAnalytics,
} from "@/lib/api/adults";
import TopHabitsChart from "@/components/admin/charts/TopHabitsChart";
import MoodDistributionChart from "@/components/admin/charts/MoodDistributionChart";
import TopInfluencesChart from "@/components/admin/charts/TopInfluencesChart";

export default function AdultsDashboard() {
  const [stats, setStats] = useState(null);
  const [habitAnalytics, setHabitAnalytics] = useState(null);
  const [reflectionAnalytics, setReflectionAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);
        const [statsData, habitsData, reflectionsData] = await Promise.all([
          getAdultDashboardStats(),
          getHabitAnalytics().catch(() => null),
          getReflectionAnalytics().catch(() => null),
        ]);
        setStats(statsData);
        setHabitAnalytics(habitsData);
        setReflectionAnalytics(reflectionsData);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adult Module</h1>
          <p className="text-muted-foreground mt-2">
            Manage adult users, habits, and reflections
          </p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adult Module</h1>
          <p className="text-muted-foreground mt-2">
            Manage adult users, habits, and reflections
          </p>
        </div>
        <div className="text-center py-8 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Adult Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage adult users, habits, and reflections
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <StatCard
          title="Total Adults"
          value={stats?.totalAdults?.toString() || "0"}
          change=""
          changeType="neutral"
          icon={Users}
          description="Active adult users"
        />
        <StatCard
          title="Active Habits"
          value={stats?.activeHabits?.toString() || "0"}
          change=""
          changeType="neutral"
          icon={Target}
          description="Habits being tracked"
        />
        <StatCard
          title="Reflections"
          value={stats?.totalReflections?.toString() || "0"}
          change=""
          changeType="neutral"
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
                <p className="font-medium">Habit Completions (Last 7 days)</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.recentActivity?.completions || 0} completions
                </p>
              </div>
              <div>
                <p className="font-medium">Reflections (Last 7 days)</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.recentActivity?.reflections || 0} reflections
                </p>
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
                <span className="text-sm font-semibold">{stats?.habitsCompletedToday || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reflections</span>
                <span className="text-sm font-semibold">{stats?.totalReflections || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Habits by Completions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most completed habits (last 30 days)
            </p>
          </CardHeader>
          <CardContent>
            <TopHabitsChart data={habitAnalytics?.popularHabits} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              How users are logging their mood
            </p>
          </CardHeader>
          <CardContent>
            <MoodDistributionChart data={reflectionAnalytics?.moodDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Influences on Mood</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most selected influences in reflections
            </p>
          </CardHeader>
          <CardContent>
            <TopInfluencesChart data={reflectionAnalytics?.topInfluences} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}


