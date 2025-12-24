"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { formatDate } from "@/lib/utils";
import { getKids, getKidStats } from "@/lib/api/kids";
import { getParentById } from "@/lib/api/parents";
import { getTasks } from "@/lib/api/tasks";

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

export default function KidsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchKids() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all kids
        const kidsData = await getKids();
        
        // Fetch additional data for each kid
        const kidsWithStats = await Promise.all(
          kidsData.map(async (kid) => {
            try {
              const [stats] = await Promise.all([
                getKidStats(kid._id).catch(() => ({ completedTasks: 0, totalCoins: 0 })),
              ]);

              const age = kid.dateOfBirth ? calculateAge(kid.dateOfBirth) : null;

              // parentId is now populated by backend with fullName and email
              const parentName = kid.parentId?.fullName || (typeof kid.parentId === 'object' && kid.parentId.fullName) || "Unknown";
              const parentId = kid.parentId?._id || (typeof kid.parentId === 'object' ? kid.parentId._id : kid.parentId);

              return {
                _id: kid._id,
                id: kid._id,
                name: kid.name,
                age: age,
                parent: parentName,
                parentId: parentId,
                tasksCompleted: stats?.completedTasks || 0, // Now counts all TaskCompletion records
                coins: kid.totalCoins || stats?.totalCoins || 0,
                status: kid.status === 1 ? "active" : "inactive",
                joinedDate: kid.createdAt,
              };
            } catch (err) {
              console.error(`Error fetching stats for kid ${kid._id}:`, err);
              const age = kid.dateOfBirth ? calculateAge(kid.dateOfBirth) : null;
              
              // parentId is now populated by backend
              const parentName = kid.parentId?.fullName || (typeof kid.parentId === 'object' && kid.parentId.fullName) || "Unknown";
              const parentId = kid.parentId?._id || (typeof kid.parentId === 'object' ? kid.parentId._id : kid.parentId);
              
              return {
                _id: kid._id,
                id: kid._id,
                name: kid.name,
                age: age,
                parent: parentName,
                parentId: parentId,
                tasksCompleted: 0,
                coins: kid.totalCoins || 0,
                status: kid.status === 1 ? "active" : "inactive",
                joinedDate: kid.createdAt,
              };
            }
          })
        );

        setKids(kidsWithStats);
      } catch (err) {
        console.error("Error fetching kids:", err);
        setError(err.message || "Failed to load kids");
      } finally {
        setLoading(false);
      }
    }

    fetchKids();
  }, []);

  // Reset to page 1 when search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const filteredKids = useMemo(() => {
    return kids.filter(
      (kid) =>
        kid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kid.parent.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [kids, searchQuery]);

  // Paginated kids
  const paginatedKids = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredKids.slice(start, end);
  }, [filteredKids, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredKids.length / itemsPerPage));

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Kids</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search kids..."
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
            Loading kids...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kid</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Tasks Completed</TableHead>
                <TableHead>Coins</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKids.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No kids found matching your search" : "No kids found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedKids.map((kid) => (
                  <TableRow key={kid._id || kid.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(kid.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{kid.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{kid.age !== null ? `${kid.age} years` : "N/A"}</TableCell>
                    <TableCell>{kid.parent}</TableCell>
                    <TableCell>{kid.tasksCompleted}</TableCell>
                    <TableCell>{kid.coins.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={kid.status === "active" ? "default" : "outline"}>
                        {kid.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(kid.joinedDate)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/parents-kids/kids/${kid._id || kid.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                  </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && !error && filteredKids.length > 0 && (
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredKids.length)} of {filteredKids.length} kids
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
        )}
      </CardContent>
    </Card>
  );
}


