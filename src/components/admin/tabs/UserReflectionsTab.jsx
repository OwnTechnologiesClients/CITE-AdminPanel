"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
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

export default function UserReflectionsTab({ reflections }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reflections.length / ITEMS_PER_PAGE));
  const paginatedReflections = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return reflections.slice(start, start + ITEMS_PER_PAGE);
  }, [reflections, currentPage]);

  return (
    <div className="space-y-4">
      {reflections.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No reflections found for this user
          </CardContent>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Mood</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReflections.map((reflection) => {
                const reflectionDate = reflection.date || reflection.createdAt;
                const reflectionTime = reflection.time || (reflectionDate ? new Date(reflectionDate).toLocaleTimeString() : "");

                return (
                  <TableRow key={reflection._id || reflection.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span>{formatDate(reflectionDate)}</span>
                        </div>
                        {reflectionTime && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-3" />
                            <span>{reflectionTime}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={reflection.mood === "positive" || reflection.mood === "great" || reflection.mood === "good" ? "default" : "secondary"}>
                        {reflection.mood || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{reflection.notes || "—"}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {reflections.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, reflections.length)} of {reflections.length}
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


