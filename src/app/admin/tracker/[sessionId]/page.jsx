"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  TrendingUp,
  Activity,
  Gauge,
  Flame,
  Footprints,
  Calendar,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getActivitySessionById, deleteActivitySession } from "@/lib/api/tracker";
import { formatDate } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const RouteMap = dynamic(() => import("@/components/admin/tracker/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function ActivitySessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        setLoading(true);
        setError(null);
        const sessionData = await getActivitySessionById(sessionId);
        setSession(sessionData);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(err.message || "Failed to load session data");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this activity session?")) {
      return;
    }

    try {
      setDeleting(true);
      await deleteActivitySession(sessionId);
      router.push("/admin/tracker");
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Failed to delete session");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      <Badge className={badgeClasses[status] || "bg-gray-100 text-gray-800"}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const getActivityTypeBadge = (type) => {
    const colors = {
      running: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      walking: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cycling: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return (
      <Badge className={colors[type] || colors.other}>
        {type?.charAt(0).toUpperCase() + type?.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDistance = (km) => {
    if (!km) return "N/A";
    return `${km.toFixed(2)} km`;
  };

  const formatSpeed = (kmh) => {
    if (!kmh) return "N/A";
    return `${kmh.toFixed(2)} km/h`;
  };

  const formatPace = (minPerKm) => {
    if (!minPerKm) return "N/A";
    const minutes = Math.floor(minPerKm);
    const seconds = Math.round((minPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <p className="text-muted-foreground mt-2 text-destructive">
            {error || "Session not found"}
          </p>
          <Link href="/admin/tracker">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tracker
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/tracker">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Session</h1>
            <p className="text-muted-foreground mt-2">
              Session ID: {session.sessionId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(session.status)}
          {getActivityTypeBadge(session.activityType)}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Route Map */}
      {session.polyline && session.polyline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
            <CardDescription>Visualization of the activity route</CardDescription>
          </CardHeader>
          <CardContent>
            <RouteMap
              polyline={session.polyline}
              startLat={session.startLat}
              startLong={session.startLong}
              endLat={session.endLat}
              endLong={session.endLong}
              gpsPoints={session.gpsPoints}
            />
          </CardContent>
        </Card>
      )}

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDistance(session.distance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(session.duration)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session.calories || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
            <Footprints className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session.steps || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Average Speed</span>
              </div>
              <span className="font-semibold">{formatSpeed(session.averageSpeed)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Average Pace</span>
              </div>
              <span className="font-semibold">{formatPace(session.averagePace)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total GPS Points</span>
              </div>
              <span className="font-semibold">{session.totalPoints || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intensity Zones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Low Intensity</span>
              </div>
              <span className="font-semibold">
                {formatDuration(session.intensityTimes?.low || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Moderate Intensity</span>
              </div>
              <span className="font-semibold">
                {formatDuration(session.intensityTimes?.moderate || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">High Intensity</span>
              </div>
              <span className="font-semibold">
                {formatDuration(session.intensityTimes?.high || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Start Time</div>
              <div className="font-medium">
                {session.startTime ? formatDate(session.startTime) : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">End Time</div>
              <div className="font-medium">
                {session.endTime ? formatDate(session.endTime) : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Start Location</div>
              <div className="font-medium">
                {session.startLat && session.startLong
                  ? `${session.startLat.toFixed(6)}, ${session.startLong.toFixed(6)}`
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">End Location</div>
              <div className="font-medium">
                {session.endLat && session.endLong
                  ? `${session.endLat.toFixed(6)}, ${session.endLong.toFixed(6)}`
                  : "N/A"}
              </div>
            </div>
          </div>
          {session.imagePath && (
            <>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground mb-2">Route Screenshot</div>
                <img
                  src={session.imagePath}
                  alt="Route screenshot"
                  className="rounded-lg border max-w-full h-auto"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

