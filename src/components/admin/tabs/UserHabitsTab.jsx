"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Target } from "lucide-react";
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

const ITEMS_PER_PAGE = 10;

export default function UserHabitsTab({ userId, habits }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewHabit = (habit) => {
    const habitId = habit._id || habit.id;
    router.push(`/admin/adults/users/${userId}/habits/${habitId}`);
  };

  const totalPages = Math.max(1, Math.ceil(habits.length / ITEMS_PER_PAGE));
  const paginatedHabits = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return habits.slice(start, start + ITEMS_PER_PAGE);
  }, [habits, currentPage]);

  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No habits found for this user
          </CardContent>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Habit Name</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHabits.map((habit) => (
                <TableRow key={habit._id || habit.id}>
                  <TableCell className="font-medium">{habit.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="size-4 text-muted-foreground" />
                      {habit.streak || 0} days
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={habit.status === 1 && habit.isActive ? "default" : "outline"}>
                      {habit.status === 1 && habit.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewHabit(habit)}
                    >
                      <Eye className="size-4 mr-2" />
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {habits.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, habits.length)} of {habits.length}
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
    </div>
  );
}
