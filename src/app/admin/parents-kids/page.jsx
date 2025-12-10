"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Gift, Coins, Camera, TrendingUp } from "lucide-react";
import StatCard from "@/components/admin/cards/StatCard";
import { getParentsKidsDashboardStats } from "@/lib/api/stats";

export default function ParentsKidsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const statsData = await getParentsKidsDashboardStats();
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
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
          <h1 className="text-3xl font-bold tracking-tight">Parents & Kids Module</h1>
          <p className="text-muted-foreground mt-2">
            Manage parent-kid relationships, tasks, rewards, and activities
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          Loading dashboard statistics...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parents & Kids Module</h1>
          <p className="text-muted-foreground mt-2">
            Manage parent-kid relationships, tasks, rewards, and activities
          </p>
        </div>
        <div className="text-center py-12 text-destructive">
          {error || "Failed to load statistics"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parents & Kids Module</h1>
        <p className="text-muted-foreground mt-2">
          Manage parent-kid relationships, tasks, rewards, and activities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Kids"
          value={stats.totalKids?.value?.toString() || "0"}
          change={`${stats.totalKids?.change >= 0 ? '+' : ''}${stats.totalKids?.change || 0}%`}
          changeType={stats.totalKids?.changeType || "neutral"}
          icon={Users}
          description="Active kids in the system"
        />
        <StatCard
          title="Total Parents"
          value={stats.totalParents?.value?.toString() || "0"}
          change={`${stats.totalParents?.change >= 0 ? '+' : ''}${stats.totalParents?.change || 0}%`}
          changeType={stats.totalParents?.changeType || "neutral"}
          icon={Users}
          description="Active parents"
        />
        <StatCard
          title="Active Tasks"
          value={stats.activeTasks?.value?.toString() || "0"}
          change={`${stats.activeTasks?.change >= 0 ? '+' : ''}${stats.activeTasks?.change || 0}%`}
          changeType={stats.activeTasks?.changeType || "neutral"}
          icon={ClipboardList}
          description="Tasks assigned to kids"
        />
        <StatCard
          title="Rewards Created"
          value={stats.rewardsCreated?.value?.toString() || "0"}
          change={`${stats.rewardsCreated?.change >= 0 ? '+' : ''}${stats.rewardsCreated?.change || 0}%`}
          changeType={stats.rewardsCreated?.changeType || "neutral"}
          icon={Gift}
          description="Rewards available"
        />
        <StatCard
          title="Coins Earned"
          value={(stats.totalCoinsEarned?.value || 0).toLocaleString()}
          change={`${stats.totalCoinsEarned?.change >= 0 ? '+' : ''}${stats.totalCoinsEarned?.change || 0}%`}
          changeType={stats.totalCoinsEarned?.changeType || "neutral"}
          icon={Coins}
          description="Total coins earned by kids"
        />
        <StatCard
          title="Photo Proofs"
          value={stats.photoProofs?.value?.toString() || "0"}
          change={`${stats.photoProofs?.change >= 0 ? '+' : ''}${stats.photoProofs?.change || 0}%`}
          changeType={stats.photoProofs?.changeType || "neutral"}
          icon={Camera}
          description="Task completion proofs"
        />
      </div>
    </div>
  );
}


