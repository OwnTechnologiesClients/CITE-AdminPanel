"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, MapPin, Clock } from "lucide-react";
import { getActivityStatistics } from "@/lib/api/tracker";

export default function TrackerAnalyticsPage() {
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const activityResponse = await getActivityStatistics().catch(() => null);

        setActivityStats(activityResponse);
      } catch (err) {
        console.error("Error fetching tracker analytics:", err);
        setError(err.message || "Failed to load analytics");
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
          <h1 className="text-3xl font-bold tracking-tight">Tracker Analytics</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tracker Analytics</h1>
          <p className="text-muted-foreground mt-2 text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tracker Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Overview of activity tracker statistics and trends
        </p>
      </div>

      {/* Activity Sessions Statistics */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Activity Sessions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityStats?.totalSessions?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityStats?.totalDistance
                  ? `${activityStats.totalDistance.toFixed(2)} km`
                  : "0 km"}
              </div>
              <p className="text-xs text-muted-foreground">Total covered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityStats?.totalDuration
                  ? `${Math.round(activityStats.totalDuration / 60)} min`
                  : "0 min"}
              </div>
              <p className="text-xs text-muted-foreground">Total time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityStats?.averageSpeed
                  ? `${activityStats.averageSpeed.toFixed(2)} km/h`
                  : "0 km/h"}
              </div>
              <p className="text-xs text-muted-foreground">Per session</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Types Breakdown */}
      {activityStats?.activityTypes && Object.keys(activityStats.activityTypes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Types</CardTitle>
            <CardDescription>Breakdown by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(activityStats.activityTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type.replace(/_/g, " ")}</span>
                  <Badge variant="secondary">{count} sessions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!activityStats && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No analytics data available yet
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

