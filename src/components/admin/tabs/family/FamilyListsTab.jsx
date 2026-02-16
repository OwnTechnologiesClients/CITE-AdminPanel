"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, User, ChevronDown, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function FamilyListsTab({ lists }) {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalPages = Math.max(1, Math.ceil(lists.length / ITEMS_PER_PAGE));
  const paginatedLists = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return lists.slice(start, start + ITEMS_PER_PAGE);
  }, [lists, currentPage]);

  return (
    <div className="space-y-4">
      {lists.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No lists found
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {paginatedLists.map((list) => {
              const listId = list._id || list.id;
              const isExpanded = expandedIds.has(listId);
              const itemCount = list.items?.length ?? 0;

              return (
                <Card key={listId}>
                  <div className="pt-4 pb-4 px-6">
                    <div className="flex items-center justify-between gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 p-0 h-auto hover:bg-transparent font-semibold text-left"
                        onClick={() => toggleExpanded(listId)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="size-4 shrink-0" />
                        ) : (
                          <ChevronRight className="size-4 shrink-0" />
                        )}
                        <span className="text-lg">{list.name || "N/A"}</span>
                        {list.category && (
                          <Badge variant="outline" className="capitalize ml-1">
                            {list.category}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground font-normal">
                          ({itemCount} item{itemCount !== 1 ? "s" : ""})
                        </span>
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                        <User className="size-4" />
                        {list.createdBy ? (
                          <>Created by {list.createdBy.fullName || list.createdBy.username || "N/A"}</>
                        ) : (
                          <>Created {formatDate(list.createdAt)}</>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pl-6 border-l-2 border-muted space-y-3">
                        {list.description && (
                          <p className="text-sm text-muted-foreground">{list.description}</p>
                        )}
                        {list.items && list.items.length > 0 ? (
                          <div className="space-y-2">
                            {list.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center gap-2 p-2 rounded-lg border"
                              >
                                {item.isCompleted ? (
                                  <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                                ) : (
                                  <Circle className="size-5 text-muted-foreground shrink-0" />
                                )}
                                <span
                                  className={item.isCompleted ? "line-through text-muted-foreground" : ""}
                                >
                                  {item.text || "N/A"}
                                </span>
                                {item.priority && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    Priority: {item.priority}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">No items in this list</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {lists.length > 0 && (
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, lists.length)} of {lists.length}
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

