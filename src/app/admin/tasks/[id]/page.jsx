"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Coins, CheckCircle2, Clock, Camera, Repeat, Maximize2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
import {
  Pagination,
  PaginationContent,
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
import { formatDate, getImageUrl } from "@/lib/utils";
import { getTaskById, getTaskCompletions } from "@/lib/api/tasks";

export default function ViewTaskPage() {
  const params = useParams();
  const id = params.id;
  const [task, setTask] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchTaskData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch task data
        const taskData = await getTaskById(id);
        
        // Check if task is recurring (daily, weekly, monthly)
        const isRecurring = taskData.repeat && ['daily', 'weekly', 'monthly'].includes(taskData.repeat);

        // If recurring, fetch completions
        let completionsData = [];
        if (isRecurring) {
          try {
            completionsData = await getTaskCompletions(id);
          } catch (err) {
            console.error("Error fetching completions:", err);
            completionsData = [];
          }
        }

        setTask(taskData);
        setCompletions(completionsData);
      } catch (err) {
        console.error("Error fetching task data:", err);
        setError(err.message || "Failed to load task data");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTaskData();
    }
  }, [id]);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Paginated completions
  const paginatedCompletions = useMemo(() => {
    if (!completions || completions.length === 0) return [];
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return completions.slice(start, end);
  }, [completions, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil((completions?.length || 0) / itemsPerPage));
  const isRecurring = task?.repeat && ['daily', 'weekly', 'monthly'].includes(task.repeat);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          Loading task data...
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">
          {error || "Task not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/parents-kids/kids/${task.kidId?._id || task.kidId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
          <p className="text-muted-foreground mt-2">
            View task information and completion history
          </p>
        </div>
      </div>

      {/* Task Information */}
      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">{task.name}</h2>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Assigned To</Label>
              <p className="mt-1 font-medium">{task.kidId?.name || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Assigned By</Label>
              <p className="mt-1 font-medium">{task.parentId?.fullName || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Repeat Pattern</Label>
              <div className="mt-1">
                {task.repeat ? (
                  <Badge variant="outline" className="gap-1">
                    <Repeat className="size-3" />
                    {task.repeat}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">One-time</span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge variant={task.isCompleted ? "default" : "outline"} className="gap-1">
                  {task.isCompleted ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Clock className="size-3" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Start Date</Label>
              <p className="mt-1 font-medium flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                {formatDate(task.startDate)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Stars per Completion</Label>
              <p className="mt-1 font-medium flex items-center gap-2">
                <Coins className="size-4 text-yellow-600" />
                {task.starsPerCompletion || 0}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Photo Proof Required</Label>
              <div className="mt-1">
                {task.requiresPhotoProof ? (
                  <Badge variant="default" className="gap-1">
                    <Camera className="size-3" />
                    Required
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Not Required</span>
                )}
              </div>
            </div>
            {task.completedAt && (
              <div>
                <Label className="text-muted-foreground">Completed At</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(task.completedAt)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion History (only for recurring tasks) */}
      {isRecurring && (
        <Card>
          <CardHeader>
            <CardTitle>Completion History</CardTitle>
          </CardHeader>
          <CardContent>
            {completions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="size-12 mx-auto mb-4 opacity-50" />
                <p>No completions recorded yet</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Completed At</TableHead>
                      <TableHead>Kid</TableHead>
                      <TableHead>Photo Proof</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCompletions.map((completion) => (
                      <TableRow key={completion._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            {formatDate(completion.completedAt)}
                          </div>
                        </TableCell>
                        <TableCell>{completion.kidId?.name || "N/A"}</TableCell>
                        <TableCell>
                          {completion.photoProofPath ? (
                            <div className="relative group">
                              <div className="relative w-20 h-20 rounded-lg border overflow-hidden bg-muted cursor-pointer"
                                   onClick={() => window.open(getImageUrl(completion.photoProofPath), '_blank')}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getImageUrl(completion.photoProofPath)}
                                  alt="Completion photo proof"
                                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const errorDiv = e.target.nextElementSibling;
                                    if (errorDiv) errorDiv.style.display = 'flex';
                                  }}
                                />
                                <div className="hidden absolute inset-0 items-center justify-center bg-muted">
                                  <Camera className="size-6 text-muted-foreground opacity-50" />
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <Maximize2 className="size-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No photo</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Show</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
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
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, completions.length)} of {completions.length} completions
                    </div>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

