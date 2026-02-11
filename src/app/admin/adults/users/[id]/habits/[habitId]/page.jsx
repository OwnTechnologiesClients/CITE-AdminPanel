"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Calendar } from "lucide-react";
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
import { formatDate } from "@/lib/utils";
import { getHabitById, getHabitCompletions } from "@/lib/api/habits";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function UserHabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  const habitId = params.habitId;
  const [habit, setHabit] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    if (!habitId) return;
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const [habitData, completionsData] = await Promise.all([
          getHabitById(habitId),
          getHabitCompletions(habitId, { limit: 500 }),
        ]);
        setHabit(habitData);
        setCompletions(Array.isArray(completionsData) ? completionsData : []);
      } catch (err) {
        console.error("Error fetching habit detail:", err);
        setError(err.message || "Failed to load habit");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [habitId]);

  const totalPages = Math.max(1, Math.ceil(completions.length / itemsPerPage));
  const paginatedCompletions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return completions.slice(start, start + itemsPerPage);
  }, [completions, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/adults/users/${userId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <p className="text-muted-foreground">Loading habit…</p>
        </div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/adults/users/${userId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <p className="text-destructive">{error || "Habit not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/adults/users/${userId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{habit.name}</h1>
          <p className="text-muted-foreground mt-1">Habit details and completion history</p>
        </div>
      </div>

      {/* Upper area: habit details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={habit.status === 1 && habit.isActive ? "default" : "outline"} className="mt-1">
                {habit.status === 1 && habit.isActive ? "active" : "inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="mt-1 font-medium flex items-center gap-1">
                <Target className="size-4 text-muted-foreground" />
                {habit.streak ?? 0} days
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Times completed</p>
              <p className="mt-1 font-medium">{completions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="mt-1 font-medium flex items-center gap-1">
                <Calendar className="size-4 text-muted-foreground" />
                {formatDate(habit.createdAt || habit.created)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lower area: completions list with pagination on top */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Completions & history</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Per page</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {completions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No completions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompletions.map((c) => (
                  <TableRow key={c._id || c.id}>
                    <TableCell>{formatDate(c.completedDate)}</TableCell>
                    <TableCell>
                      {c.completedAt
                        ? new Date(c.completedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {c.doneLate ? (
                        <Badge variant="secondary">Late</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {c.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {completions.length > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, completions.length)} of {completions.length} completions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
