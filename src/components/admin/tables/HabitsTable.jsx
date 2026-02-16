"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getHabits } from "@/lib/api/habits";
import { formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function HabitsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchHabits() {
      try {
        setLoading(true);
        setError(null);
        const habitsData = await getHabits();
        setHabits(habitsData);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError(err.message || "Failed to load habits");
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredHabits = useMemo(
    () =>
      habits.filter(
        (habit) =>
          habit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (habit.userId?.fullName && habit.userId.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (habit.userId?.email && habit.userId.email.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [habits, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredHabits.length / ITEMS_PER_PAGE));
  const paginatedHabits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHabits.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHabits, currentPage]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Habits</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading habits...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habit Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHabits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No habits found matching your search" : "No habits found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedHabits.map((habit) => {
                    const userName = habit.userId?.fullName || habit.userId?.email || "Unknown";
                    return (
                      <TableRow key={habit._id || habit.id}>
                        <TableCell className="font-medium">{habit.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{userName}</TableCell>
                        <TableCell>
                          <Badge variant={habit.status === 1 && habit.isActive ? "default" : "outline"}>
                            {habit.status === 1 && habit.isActive ? "active" : "inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(habit.createdAt || habit.created)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/adults/users/${habit.userId?._id || habit.userId?.id || habit.userId}`}>
                            <Button variant="ghost" size="sm">View user</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            {filteredHabits.length > 0 && (
              <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredHabits.length)} of {filteredHabits.length}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}


