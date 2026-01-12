"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Calendar, Heart } from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";
import { getAdultDashboardStats } from "@/lib/api/adults";

export default function AdultsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdultDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Failed to load dashboard stats");
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
          <h1 className="text-3xl font-bold tracking-tight">Adult Module</h1>
          <p className="text-muted-foreground mt-2">
            Manage adult users, habits, routines, and reflections
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
            Manage adult users, habits, routines, and reflections
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
          Manage adult users, habits, routines, and reflections
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Active Sessions"
          value={stats?.activeSessions?.toString() || "0"}
          change=""
          changeType="neutral"
          icon={Calendar}
          description="Currently active habit sessions"
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
                <span className="text-sm text-muted-foreground">Active Sessions</span>
                <span className="text-sm font-semibold">{stats?.activeSessions || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reflections</span>
                <span className="text-sm font-semibold">{stats?.totalReflections || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


