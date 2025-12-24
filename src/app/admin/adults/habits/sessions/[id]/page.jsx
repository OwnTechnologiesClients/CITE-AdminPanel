"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, TrendingUp, Navigation, Activity, RefreshCw } from "lucide-react";
import Link from "next/link";
import RouteMap from "@/components/admin/maps/RouteMap";
import { formatDate } from "@/lib/utils";
import { getHabitSessionById } from "@/lib/api/habitSessions";

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHabitSessionById(sessionId);
      setSession(data);
    } catch (err) {
      console.error("Error fetching session:", err);
      setError(err.message || "Failed to fetch session");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0m";
    const minutes = Math.floor(seconds / 60);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/adults/habits/sessions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading Session...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/adults/habits/sessions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {error ? "Error Loading Session" : "Session Not Found"}
            </h1>
            {error && (
              <p className="text-muted-foreground mt-2">{error}</p>
            )}
          </div>
        </div>
        {error && (
          <Button onClick={fetchSession} variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  const runningSession = session.runningSessionId;
  const isActive = session.status === "active";
  
  // Parse polyline if it exists (it's stored as JSON string)
  let route = [];
  if (runningSession?.polyline) {
    try {
      const parsed = typeof runningSession.polyline === 'string' 
        ? JSON.parse(runningSession.polyline) 
        : runningSession.polyline;
      route = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing polyline:', e);
      route = [];
    }
  }
  
  // Convert route to format expected by RouteMap: [{lat, lng}, ...]
  const formattedRoute = route.map((point) => {
    if (Array.isArray(point) && point.length >= 2) {
      return { lat: point[0], lng: point[1] };
    }
    return point;
  });
  
  const startLocation = formattedRoute.length > 0 ? formattedRoute[0] : 
    (runningSession?.startLat && runningSession?.startLong 
      ? { lat: runningSession.startLat, lng: runningSession.startLong }
      : null);
  const endLocation = formattedRoute.length > 0 ? formattedRoute[formattedRoute.length - 1] :
    (runningSession?.endLat && runningSession?.endLong
      ? { lat: runningSession.endLat, lng: runningSession.endLong }
      : null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/habits/sessions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {session.habitId?.name || "Unknown Habit"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isActive ? "Live tracking session" : "Completed session"} - {session.userId?.fullName || session.userId?.email || "Unknown User"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSession} disabled={loading}>
          <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Status Badge */}
      <div>
        <Badge variant={isActive ? "default" : "secondary"} className="text-sm px-3 py-1">
          {isActive ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Active
            </>
          ) : (
            "Completed"
          )}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map View */}
        <div className="lg:col-span-2">
          {formattedRoute.length > 0 || startLocation ? (
            <RouteMap
              route={formattedRoute}
              startLocation={startLocation}
              endLocation={endLocation}
              isLive={isActive}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <MapPin className="size-12 mx-auto mb-4 opacity-50" />
                <p>No route data available for this session</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">User</p>
                <p className="font-medium">
                  {session.userId?.fullName || session.userId?.email || "Unknown User"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Started At</p>
                <p className="font-medium">
                  {session.createdAt ? formatDate(session.createdAt) : "-"}
                </p>
              </div>
              {runningSession?.endTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="font-medium">{formatDate(runningSession.endTime)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {runningSession?.distance !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <span className="text-sm">Distance</span>
                  </div>
                  <span className="font-semibold">{runningSession.distance.toFixed(2)} km</span>
                </div>
              )}
              {runningSession?.duration !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="font-semibold">{formatDuration(runningSession.duration)}</span>
                </div>
              )}
              {runningSession?.averageSpeed !== undefined && runningSession.averageSpeed > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="size-4 text-muted-foreground" />
                    <span className="text-sm">Avg Speed</span>
                  </div>
                  <span className="font-semibold">{runningSession.averageSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {runningSession?.currentSpeed !== undefined && runningSession.currentSpeed > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="text-sm">Current Speed</span>
                  </div>
                  <span className="font-semibold">{runningSession.currentSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {runningSession?.maxSpeed !== undefined && runningSession.maxSpeed > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="text-sm">Max Speed</span>
                  </div>
                  <span className="font-semibold">{runningSession.maxSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {runningSession?.elevationGain !== undefined && runningSession.elevationGain > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-sm">Elevation Gain</span>
                  </div>
                  <span className="font-semibold">{runningSession.elevationGain} m</span>
                </div>
              )}
              {!runningSession && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No running session data available
                </p>
              )}
            </CardContent>
          </Card>

          {runningSession?.currentLat && runningSession?.currentLong && (
            <Card>
              <CardHeader>
                <CardTitle>Current Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">GPS Coordinates</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {runningSession.currentLat.toFixed(4)}, {runningSession.currentLong.toFixed(4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Route Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {formattedRoute.length > 0 
                  ? `${formattedRoute.length} GPS points recorded` 
                  : runningSession?.totalPoints 
                    ? `${runningSession.totalPoints} points recorded`
                    : "No route data available"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

