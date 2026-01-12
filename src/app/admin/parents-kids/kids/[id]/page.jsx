"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, CheckCircle2, Calendar, UserCheck, ClipboardList, Coins, Camera, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { getKidById, getKidStats } from "@/lib/api/kids";
import { getParentById } from "@/lib/api/parents";
import { getTasksByKidId } from "@/lib/api/tasks";
import { getRewardsByKidId } from "@/lib/api/rewards";

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function ViewKidPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [kid, setKid] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [tasksPage, setTasksPage] = useState(1);
  const [rewardsPage, setRewardsPage] = useState(1);
  const [tasksItemsPerPage, setTasksItemsPerPage] = useState(10);
  const [rewardsItemsPerPage, setRewardsItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchKidData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch kid data
        const kidData = await getKidById(id);
        const stats = await getKidStats(id);
        
        // Fetch parent data
        let parentData = null;
        if (kidData.parentId?._id) {
          try {
            parentData = await getParentById(kidData.parentId._id);
          } catch (err) {
            console.error("Error fetching parent:", err);
            parentData = kidData.parentId;
          }
        }

        // Fetch tasks and rewards
        const [tasksData, rewardsData] = await Promise.all([
          getTasksByKidId(id),
          getRewardsByKidId(id),
        ]);

        // Transform tasks
        const transformedTasks = tasksData.map((task) => ({
          _id: task._id,
          id: task._id,
          title: task.name,
          assignedBy: task.parentId?.fullName || "Unknown",
          coins: task.starsPerCompletion || 0,
          status: task.isCompletedForPeriod ? "completed" : "pending",
          dueDate: task.startDate,
          completedDate: task.completedAtForPeriod || task.completedAt,
          photoProof: task.requiresPhotoProof || false,
          photoProofStatus: task.photoProofPath ? "approved" : null,
        }));

        // Transform rewards
        const transformedRewards = rewardsData.map((reward) => ({
          _id: reward._id,
          id: reward._id,
          name: reward.name,
          cost: reward.costInCoins || 0,
          available: reward.isActive && reward.status === 1,
          redeemed: reward.redeemed || false,
          redeemedAt: reward.redeemedAt || null,
        }));

        const age = kidData.dateOfBirth ? calculateAge(kidData.dateOfBirth) : null;

        setKid({
          _id: kidData._id,
          id: kidData._id,
          name: kidData.name,
          age: age,
          email: kidData.userId?.email || "No account (uses invite code login)",
          hasUserAccount: !!kidData.userId, // Track if kid has user account
          parent: {
            _id: parentData?._id || kidData.parentId?._id,
            id: parentData?._id || kidData.parentId?._id,
            name: parentData?.fullName || kidData.parentId?.fullName || "Unknown",
            email: parentData?.email || kidData.parentId?.email || "N/A",
          },
          status: kidData.status === 1 ? "active" : "inactive",
          joinedDate: kidData.createdAt,
          lastActive: kidData.updatedAt,
          tasksCompleted: stats?.completedTasks || 0,
          totalTasks: stats?.totalTasks || 0,
          coins: kidData.totalCoins || stats?.totalCoins || 0,
        });
        setTasks(transformedTasks);
        setRewards(transformedRewards);
      } catch (err) {
        console.error("Error fetching kid data:", err);
        setError(err.message || "Failed to load kid data");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchKidData();
    }
  }, [id]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-green-600" />;
      case "in_progress":
        return <Clock className="size-4 text-yellow-600" />;
      default:
        return <Clock className="size-4 text-gray-400" />;
    }
  };

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setTasksPage(1);
  }, [tasksItemsPerPage]);

  useEffect(() => {
    setRewardsPage(1);
  }, [rewardsItemsPerPage]);

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const start = (tasksPage - 1) * tasksItemsPerPage;
    const end = start + tasksItemsPerPage;
    return tasks.slice(start, end);
  }, [tasks, tasksPage, tasksItemsPerPage]);

  const totalTasksPages = Math.max(1, Math.ceil((tasks?.length || 0) / tasksItemsPerPage));

  // Paginated rewards
  const paginatedRewards = useMemo(() => {
    if (!rewards || rewards.length === 0) return [];
    const start = (rewardsPage - 1) * rewardsItemsPerPage;
    const end = start + rewardsItemsPerPage;
    return rewards.slice(start, end);
  }, [rewards, rewardsPage, rewardsItemsPerPage]);

  const totalRewardsPages = Math.max(1, Math.ceil((rewards?.length || 0) / rewardsItemsPerPage));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          Loading kid data...
        </div>
      </div>
    );
  }

  if (error || !kid) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">
          {error || "Kid not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/parents-kids/kids">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kid Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage kid information and tasks
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Kid Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Kid Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">{getInitials(kid.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{kid.name}</h2>
                <p className="text-muted-foreground">{kid.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Age</Label>
                <p className="mt-1 font-medium">{kid.age !== null ? `${kid.age} years old` : "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={kid.status === "active" ? "default" : "outline"}>
                    {kid.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Parent</Label>
                <div className="mt-1">
                    <Link href={`/admin/parents-kids/parents/${kid.parent._id || kid.parent.id}`} className="flex items-center gap-2 text-primary hover:underline">
                      <UserCheck className="size-4" />
                      <span className="font-medium">{kid.parent.name}</span>
                    </Link>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Parent Email</Label>
                <p className="mt-1 font-medium">{kid.parent.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Joined Date</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(kid.joinedDate)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Active</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(kid.lastActive)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">{kid.tasksCompleted} / {kid.totalTasks || tasks.length}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Coins className="size-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Coins</p>
                  <p className="text-2xl font-bold">{kid.coins.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <ClipboardList className="size-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold">
                    {tasks.filter(t => t.status !== "completed").length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Rewards Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-5" />
              Tasks & Rewards
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              <p>Parent: <span className="font-medium">{kid.parent.name}</span></p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
                <TabsTrigger value="rewards">Rewards ({rewards.length})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tasks" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Each parent creates tasks and assigns them to their specific kids
                </p>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks assigned to this kid yet</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Photo Proof</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>
                            <Link href={`/admin/parents-kids/parents/${kid.parent._id || kid.parent.id}`} className="text-primary hover:underline">
                              {task.assignedBy}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="size-4 text-yellow-600" />
                              {task.coins}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                              <Badge variant={
                                task.status === "completed" ? "default" : 
                                task.status === "in_progress" ? "secondary" : 
                                "outline"
                              }>
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDate(task.dueDate)}</span>
                              {task.completedDate && (
                                <span className="text-xs text-muted-foreground">
                                  Completed: {formatDate(task.completedDate)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {task.photoProof ? (
                              <div className="flex items-center gap-2">
                                <Camera className="size-4 text-muted-foreground" />
                                {task.photoProofStatus ? (
                                  <Badge variant={task.photoProofStatus === "approved" ? "default" : "destructive"}>
                                    {task.photoProofStatus}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Pending</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not Required</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/admin/tasks/${task._id || task.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="size-3.5 mr-1.5" />
                                View Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Tasks Pagination */}
                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show</span>
                        <Select value={tasksItemsPerPage.toString()} onValueChange={(value) => setTasksItemsPerPage(Number(value))}>
                          <SelectTrigger className="w-20 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">entries</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Showing {(tasksPage - 1) * tasksItemsPerPage + 1} to {Math.min(tasksPage * tasksItemsPerPage, tasks.length)} of {tasks.length} tasks
                      </div>
                    </div>
                    {totalTasksPages > 1 && (
                      <div className="flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setTasksPage(prev => Math.max(1, prev - 1))}
                                className={tasksPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalTasksPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setTasksPage(page)}
                                  isActive={tasksPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setTasksPage(prev => Math.min(totalTasksPages, prev + 1))}
                                className={tasksPage === totalTasksPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Rewards available for this kid
                </p>
              </div>

              {rewards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No rewards available for this kid yet</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reward Name</TableHead>
                        <TableHead>Cost (Coins)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Redeemed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRewards.map((reward) => (
                        <TableRow key={reward._id || reward.id}>
                          <TableCell className="font-medium">{reward.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="size-4 text-yellow-600" />
                              {reward.cost}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={reward.available ? "default" : "outline"}>
                              {reward.available ? "Available" : "Unavailable"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {reward.redeemed ? (
                              <div className="flex flex-col gap-1">
                                <Badge variant="default">Redeemed</Badge>
                                {reward.redeemedAt && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reward.redeemedAt)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <Badge variant="secondary">Not Redeemed</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Rewards Pagination */}
                  <div className="mt-6 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show</span>
                        <Select value={rewardsItemsPerPage.toString()} onValueChange={(value) => setRewardsItemsPerPage(Number(value))}>
                          <SelectTrigger className="w-20 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">entries</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Showing {(rewardsPage - 1) * rewardsItemsPerPage + 1} to {Math.min(rewardsPage * rewardsItemsPerPage, rewards.length)} of {rewards.length} rewards
                      </div>
                    </div>
                    {totalRewardsPages > 1 && (
                      <div className="flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setRewardsPage(prev => Math.max(1, prev - 1))}
                                className={rewardsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalRewardsPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setRewardsPage(page)}
                                  isActive={rewardsPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setRewardsPage(prev => Math.min(totalRewardsPages, prev + 1))}
                                className={rewardsPage === totalRewardsPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}
