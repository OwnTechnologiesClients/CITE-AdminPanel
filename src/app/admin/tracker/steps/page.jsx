"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Search, Activity, TrendingUp, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getStepsData, getStepsStatistics, getTodaySteps, getWeekSteps, getMonthSteps } from "@/lib/api/tracker";
import { getUsers } from "@/lib/api/users";

export default function StepsTrackingPage() {
  const [stepsData, setStepsData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [pagination, setPagination] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch users for filter dropdown (adults/adults module users)
        const usersData = await getUsers({ userType: "adult" });
        setUsers(usersData);

        // Build params
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(userFilter !== "all" && { userId: userFilter }),
        };

        // Fetch data based on active tab
        if (activeTab === "all") {
          const [stepsResponse, statsResponse] = await Promise.all([
            getStepsData(params).catch(() => ({ data: [], pagination: {} })),
            getStepsStatistics("week").catch(() => null),
          ]);
          setStepsData(stepsResponse.data || []);
          setPagination(stepsResponse.pagination || {});
          setStatistics(statsResponse);
        } else if (activeTab === "week") {
          const weekResponse = await getWeekSteps().catch(() => []);
          setWeekData(weekResponse);
        } else if (activeTab === "month") {
          const monthResponse = await getMonthSteps().catch(() => []);
          setMonthData(monthResponse);
        }
      } catch (err) {
        console.error("Error fetching steps data:", err);
        setError(err.message || "Failed to load steps data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, userFilter, activeTab]);

  const filteredSteps = useMemo(() => {
    return stepsData.filter((step) => {
      // Search would need user info which we don't have in steps data
      // For now, just return all
      return true;
    });
  }, [stepsData, searchQuery]);

  const formatSteps = (steps) => {
    return steps?.toLocaleString() || "0";
  };

  const formatDistance = (km) => {
    if (!km) return "N/A";
    return `${km.toFixed(2)} km`;
  };

  const getProgressPercentage = (steps, targetSteps) => {
    if (!targetSteps || targetSteps === 0) return 0;
    return Math.min(100, Math.round((steps / targetSteps) * 100));
  };

  if (loading && activeTab === "all") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Steps Tracking</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Steps Tracking</h1>
          <p className="text-muted-foreground mt-2 text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Steps Tracking</h1>
        <p className="text-muted-foreground mt-2">
          View and monitor steps data for all users (Adult module)
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Steps</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.averageSteps ? formatSteps(statistics.averageSteps) : "0"}
              </div>
              <p className="text-xs text-muted-foreground">Per day</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.totalSteps ? formatSteps(statistics.totalSteps) : "0"}
              </div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.totalDistance ? formatDistance(statistics.totalDistance) : "0 km"}
              </div>
              <p className="text-xs text-muted-foreground">This period</p>
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
        </div>
      )}

      {/* Filters */}
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
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={userFilter} onValueChange={(value) => { setUserFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Steps Data</CardTitle>
          <CardDescription>
            View daily, weekly, and monthly steps tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Entries</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {filteredSteps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No steps data found
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Calories</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSteps.map((step) => {
                        const progress = getProgressPercentage(step.steps, step.targetSteps);
                        return (
                          <TableRow key={step._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(step.stepDate || step.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatSteps(step.steps)}
                            </TableCell>
                            <TableCell>{formatSteps(step.targetSteps || 10000)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      progress >= 100 ? "bg-green-600" : progress >= 50 ? "bg-yellow-600" : "bg-red-600"
                                    }`}
                                    style={{ width: `${Math.min(100, progress)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">{progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatDistance(step.distance)}</TableCell>
                            <TableCell>{step.calories || 0}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                          disabled={currentPage === pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="week" className="space-y-4 mt-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading week data...</div>
              ) : weekData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No week data available</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Steps</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(day.date)}</TableCell>
                        <TableCell className="font-medium">{formatSteps(day.steps)}</TableCell>
                        <TableCell>
                          <Badge variant={day.progress >= 100 ? "default" : "secondary"}>
                            {day.progress}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="month" className="space-y-4 mt-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading month data...</div>
              ) : monthData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No month data available</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Steps</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthData.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(day.date)}</TableCell>
                        <TableCell className="font-medium">{formatSteps(day.steps)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

