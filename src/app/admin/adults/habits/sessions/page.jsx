"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, TrendingUp, Navigation, Activity, Eye, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { getHabitSessions, getActiveHabitSessions } from "@/lib/api/habitSessions";

export default function HabitSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, completed, cancelled

  useEffect(() => {
    fetchSessions();
  }, [filterStatus]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data = [];
      if (filterStatus === "active") {
        const response = await getActiveHabitSessions();
        data = response;
      } else {
        const response = await getHabitSessions();
        data = response;
      }
      
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err.message || "Failed to fetch sessions");
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

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = 
      session.habitId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || session.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/habits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Habit Sessions</h1>
          <p className="text-muted-foreground mt-2">
            View all location-tracked habit sessions
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchSessions}
          disabled={loading}
        >
          <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {sessions.filter(s => s.status === "cancelled").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === "cancelled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("cancelled")}
                >
                  Cancelled
                </Button>
              </div>
              <Input
                placeholder="Search by habit or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading sessions...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habit</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Avg Speed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {sessions.length === 0 
                        ? "No sessions found" 
                        : "No sessions match your filters"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => {
                    const runningSession = session.runningSessionId;
                    const distance = runningSession?.distance || 0;
                    const duration = runningSession?.duration || 0;
                    const avgSpeed = runningSession?.averageSpeed || 0;

                    return (
                      <TableRow key={session._id}>
                        <TableCell className="font-medium">
                          {session.habitId?.name || "Unknown Habit"}
                        </TableCell>
                        <TableCell>
                          {session.userId?.fullName || session.userId?.email || "Unknown User"}
                        </TableCell>
                        <TableCell>
                          {session.createdAt ? (
                            <div className="flex flex-col">
                              <span>{formatDate(session.createdAt)}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(session.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {runningSession ? (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="size-4 text-muted-foreground" />
                              <span className="font-medium">{distance.toFixed(2)} km</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {runningSession ? (
                            <div className="flex items-center gap-1">
                              <Clock className="size-4 text-muted-foreground" />
                              <span>{formatDuration(duration)}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {runningSession && avgSpeed > 0 ? (
                            <div className="flex items-center gap-1">
                              <Navigation className="size-4 text-muted-foreground" />
                              <span>{avgSpeed.toFixed(1)} km/h</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              session.status === "active"
                                ? "default"
                                : session.status === "completed"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {session.status === "active" && (
                              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                            )}
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/adults/habits/sessions/${session._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="size-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


