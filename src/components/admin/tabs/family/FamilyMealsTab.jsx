"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
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
import { formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function FamilyMealsTab({ meals }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(meals.length / ITEMS_PER_PAGE));
  const paginatedMeals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return meals.slice(start, start + ITEMS_PER_PAGE);
  }, [meals, currentPage]);

  return (
    <div className="space-y-4">
      {meals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No meals found
          </CardContent>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMeals.map((meal) => (
              <TableRow key={meal._id}>
                <TableCell className="font-medium">{meal.title || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {meal.type || "other"}
                  </Badge>
                  {meal.isCompleted && (
                    <Badge variant="default" className="ml-2">Completed</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>{formatDate(meal.date)}</span>
                    </div>
                    {meal.time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{meal.time}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{meal.description || "N/A"}</span>
                  {meal.servings && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({meal.servings} servings)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {meal.createdBy ? (
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {meal.createdBy.fullName || meal.createdBy.username || "N/A"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          {meals.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, meals.length)} of {meals.length}
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

