"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UsersRound,
  ClipboardList,
  Gift,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardStats } from "@/lib/api/stats";
import { formatDate } from "@/lib/utils";

function formatRelativeTime(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Failed to load dashboard");
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your family productivity application
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your family productivity application
          </p>
        </div>
        <div className="text-center py-12 text-destructive">{error}</div>
      </div>
    );
  }

  const activeTasksChange = stats?.parentsKidsStats?.activeTasks?.change;
  const rewardsChange = stats?.parentsKidsStats?.rewardsCreated?.change;

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
          value={stats?.totalUsers?.toLocaleString() ?? "0"}
          icon={Users}
          description="Active members across all modules"
        />
        <StatCard
          title="Total Families"
          value={stats?.totalFamilies?.toLocaleString() ?? "0"}
          changeType="positive"
          icon={UsersRound}
          description="Registered family groups"
        />
        <StatCard
          title="Active Tasks"
          value={stats?.activeTasks?.toLocaleString() ?? "0"}
          change={
            activeTasksChange != null
              ? `${Number(activeTasksChange).toFixed(1)}%`
              : undefined
          }
          changeType={
            activeTasksChange != null && Number(activeTasksChange) >= 0
              ? "positive"
              : "negative"
          }
          icon={ClipboardList}
          description="Tasks in progress or pending"
        />
        <StatCard
          title="Rewards Created"
          value={stats?.rewardsCreated?.toLocaleString() ?? "0"}
          change={
            rewardsChange != null
              ? `${Number(rewardsChange).toFixed(1)}%`
              : undefined
          }
          changeType={
            rewardsChange != null && Number(rewardsChange) >= 0
              ? "positive"
              : "negative"
          }
          icon={Gift}
          description="From last period"
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
                <span className="text-sm text-muted-foreground">
                  Tasks Completed
                </span>
                <span className="text-sm font-semibold">
                  {stats?.tasksCompleted?.toLocaleString() ?? "0"}
                </span>
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
                <span className="text-sm text-muted-foreground">
                  Total Users
                </span>
                <span className="text-sm font-semibold">
                  {stats?.totalUsers?.toLocaleString() ?? "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Families
                </span>
                <span className="text-sm font-semibold">
                  {stats?.totalFamilies?.toLocaleString() ?? "0"}
                </span>
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
              {stats?.recentActivity?.length ? (
                stats.recentActivity.map((item) => (
                  <div key={item.id}>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(item.time) ?? "Recently"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
