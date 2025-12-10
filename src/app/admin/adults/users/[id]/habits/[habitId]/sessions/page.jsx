"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, TrendingUp, Navigation, Activity, Eye } from "lucide-react";
import Link from "next/link";
import RouteMap from "@/components/admin/maps/RouteMap";
import { getUserHabitSessions } from "@/lib/sampleData/adultUsers";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserHabitSessionsPage() {
  const params = useParams();
  const userId = parseInt(params.id);
  const habitId = parseInt(params.habitId);
  
  const sessions = getUserHabitSessions(userId, habitId);
  const habitName = sessions[0]?.habitName || "Habit";

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/adults/users/${userId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{habitName} - Sessions</h1>
          <p className="text-muted-foreground mt-2">
            View all location-tracked sessions for this habit
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((sum, s) => sum + s.distance, 0).toFixed(1)} km
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined distance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(sessions.reduce((sum, s) => sum + s.distance, 0) / sessions.length || 0).toFixed(1)} km
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per session
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Average Speed</TableHead>
                <TableHead>Max Speed</TableHead>
                <TableHead>Elevation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(session.startedAt)}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.startedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-4 text-muted-foreground" />
                        <span className="font-medium">{session.distance.toFixed(2)} km</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4 text-muted-foreground" />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Navigation className="size-4 text-muted-foreground" />
                        <span>{session.averageSpeed.toFixed(1)} km/h</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{session.maxSpeed.toFixed(1)} km/h</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span>{session.elevationGain} m</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/adults/habits/sessions/${session.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

