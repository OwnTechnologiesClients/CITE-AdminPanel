"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, TrendingUp, Navigation, Activity } from "lucide-react";
import Link from "next/link";
import RouteMap from "@/components/admin/maps/RouteMap";
import { activeSessions, completedSessions } from "@/lib/sampleData/habits";
import { formatDate } from "@/lib/utils";

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = parseInt(params.id);

  // Find session in active or completed
  const session = [...activeSessions, ...completedSessions].find(s => s.id === sessionId);
  const isActive = activeSessions.some(s => s.id === sessionId);

  if (!session) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/adults/habits">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Session Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/habits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{session.habitName}</h1>
          <p className="text-muted-foreground mt-2">
            {isActive ? "Live tracking session" : "Completed session"} - {session.userName}
          </p>
        </div>
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
          <RouteMap
            route={session.route}
            startLocation={session.route[0]}
            endLocation={session.route[session.route.length - 1]}
            isLive={isActive}
          />
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
                <p className="font-medium">{session.userName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Started At</p>
                <p className="font-medium">{formatDate(session.startedAt)}</p>
              </div>
              {session.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="font-medium">{formatDate(session.completedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  <span className="text-sm">Distance</span>
                </div>
                <span className="font-semibold">{session.distance.toFixed(2)} km</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-semibold">{formatDuration(session.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="size-4 text-muted-foreground" />
                  <span className="text-sm">Avg Speed</span>
                </div>
                <span className="font-semibold">{session.averageSpeed.toFixed(1)} km/h</span>
              </div>
              {session.currentSpeed && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="text-sm">Current Speed</span>
                  </div>
                  <span className="font-semibold">{session.currentSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {session.maxSpeed && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="text-sm">Max Speed</span>
                  </div>
                  <span className="font-semibold">{session.maxSpeed.toFixed(1)} km/h</span>
                </div>
              )}
              {session.elevationGain && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-sm">Elevation Gain</span>
                  </div>
                  <span className="font-semibold">{session.elevationGain} m</span>
                </div>
              )}
            </CardContent>
          </Card>

          {session.currentLocation && (
            <Card>
              <CardHeader>
                <CardTitle>Current Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{session.currentLocation.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.currentLocation.lat.toFixed(4)}, {session.currentLocation.lng.toFixed(4)}
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
                {session.route.length} GPS points recorded
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

