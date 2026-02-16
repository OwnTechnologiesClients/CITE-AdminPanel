"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, MapPin, Clock, TrendingUp, Search, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActivitySessions, getActivityStatistics } from "@/lib/api/tracker";
import { formatDate } from "@/lib/utils";

export default function TrackerPage() {
  const [sessions, setSessions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(activityTypeFilter !== "all" && { activityType: activityTypeFilter }),
          ...(sourceFilter !== "all" && { source: sourceFilter }),
        };

        const [sessionsData, statsData] = await Promise.all([
          getActivitySessions(params),
          getActivityStatistics(),
        ]);

        setSessions(sessionsData.data);
        setPagination(sessionsData.pagination);
        setStatistics(statsData);
      } catch (err) {
        console.error("Error fetching tracker data:", err);
        setError(err.message || "Failed to load tracker data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, statusFilter, activityTypeFilter, sourceFilter]);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.sessionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.activityType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDistance = (km) => {
    if (!km) return "N/A";
    return `${km.toFixed(2)} km`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Tracker</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Tracker</h1>
          <p className="text-muted-foreground mt-2 text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Tracker</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all activity sessions (running, walking, cycling, etc.)
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalSessions || 0}</div>
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
                {statistics.totalDistance ? `${statistics.totalDistance.toFixed(2)} km` : "0 km"}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalCalories || 0}</div>
              <p className="text-xs text-muted-foreground">Burned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Distance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.averageDistance
                  ? `${statistics.averageDistance.toFixed(2)} km`
                  : "0 km"}
              </div>
              <p className="text-xs text-muted-foreground">Per session</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by session ID or activity type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="challenge">Challenge</SelectItem>
                <SelectItem value="standalone">Standalone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Sessions</CardTitle>
          <CardDescription>
            {pagination.total || 0} total sessions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity sessions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session._id || session.sessionId}>
                    <TableCell className="font-mono text-xs">
                      {session.sessionId?.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{getActivityTypeBadge(session.activityType)}</TableCell>
                    <TableCell>
                      {session.source === 'challenge' ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-xs">
                            Challenge
                          </Badge>
                          {session.dayNumber && (
                            <span className="text-xs text-muted-foreground">
                              Day {session.dayNumber}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">Standalone</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>
                      {session.startTime ? formatDate(session.startTime) : "N/A"}
                    </TableCell>
                    <TableCell>{formatDuration(session.duration)}</TableCell>
                    <TableCell>{formatDistance(session.distance)}</TableCell>
                    <TableCell>{session.calories || 0}</TableCell>
                    <TableCell>
                      <Link href={`/admin/tracker/${session.sessionId}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination - always visible when there is at least one session */}
          {filteredSessions.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, pagination.total ?? filteredSessions.length)} of {pagination.total ?? filteredSessions.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {pagination.page ?? currentPage} of {Math.max(1, pagination.pages ?? 1)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.pages ?? 1, p + 1))
                  }
                  disabled={currentPage >= (pagination.pages ?? 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

