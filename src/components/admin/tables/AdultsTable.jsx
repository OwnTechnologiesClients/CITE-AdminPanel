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
import { getUsers } from "@/lib/api/users";
import { apiGet } from "@/lib/api/client";

export default function AdultsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adults, setAdults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchAdults() {
      try {
        setLoading(true);
        setError(null);
        // Fetch users with adults module
        const adultsData = await getUsers({ module: 'adults' });
        
        // Filter out admin users (safety measure)
        const nonAdminAdults = adultsData.filter(adult => {
          if (adult.userType === 'admin') return false;
          if (adult.roles && Array.isArray(adult.roles)) {
            const hasAdminRole = adult.roles.some(role => {
              const roleName = typeof role === 'object' ? role.name : role;
              return roleName === 'admin';
            });
            if (hasAdminRole) return false;
          }
          return true;
        });
        
        // Fetch habits and reflections counts for each adult
        const adultsWithStats = await Promise.all(
          nonAdminAdults.map(async (adult) => {
            try {
              // Fetch habits count
              const habitsResponse = await apiGet(`/habits/user/${adult._id}`);
              const habitsCount = habitsResponse?.data?.length || 0;
              
              // Fetch reflections count
              const reflectionsResponse = await apiGet(`/reflections/user/${adult._id}`);
              const reflectionsCount = reflectionsResponse?.data?.length || 0;
              
              return {
                ...adult,
                habits: habitsCount,
                routines: 0, // Routines not implemented yet
                reflections: reflectionsCount,
              };
            } catch (err) {
              console.error(`Error fetching stats for user ${adult._id}:`, err);
              return {
                ...adult,
                habits: 0,
                routines: 0,
                reflections: 0,
              };
            }
          })
        );
        
        setAdults(adultsWithStats);
      } catch (err) {
        console.error("Error fetching adults:", err);
        setError(err.message || "Failed to load adults");
      } finally {
        setLoading(false);
      }
    }

    fetchAdults();
  }, []);

  // Reset to page 1 when search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const filteredAdults = useMemo(() => {
    return adults.filter(
      (adult) =>
        (adult.fullName || adult.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (adult.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [adults, searchQuery]);

  // Paginated adults
  const paginatedAdults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAdults.slice(start, end);
  }, [filteredAdults, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAdults.length / itemsPerPage));

  const getInitials = (name) => {
    if (!name) return "??";
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
          <CardTitle>All Adults</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search adults..."
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
            Loading adults...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adult</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Habits</TableHead>
                <TableHead>Routines</TableHead>
                <TableHead>Reflections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No adults found matching your search" : "No adults found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAdults.map((adult) => {
                  const adultName = adult.fullName || adult.username || "Unknown";
                  return (
                    <TableRow key={adult._id || adult.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(adultName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{adultName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{adult.email || adult.username}</TableCell>
                      <TableCell>{adult.habits || 0}</TableCell>
                      <TableCell>{adult.routines || 0}</TableCell>
                      <TableCell>{adult.reflections || 0}</TableCell>
                      <TableCell>
                        <Badge variant={adult.status === 1 || adult.status === "active" ? "default" : "outline"}>
                          {adult.status === 1 ? "active" : adult.status === 0 ? "inactive" : adult.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(adult.createdAt || adult.created)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/adults/users/${adult._id || adult.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && !error && filteredAdults.length > 0 && (
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAdults.length)} of {filteredAdults.length} adults
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


