"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye, Users, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getFamilies, getFamilyMembers } from "@/lib/api/families";
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

export default function FamiliesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        setLoading(true);
        setError(null);
        const familiesData = await getFamilies();
        
        // Fetch member counts for each family
        const familiesWithStats = await Promise.all(
          familiesData.map(async (family) => {
            try {
              const members = await getFamilyMembers(family._id);
              const activeMembers = members.filter(m => m.status === 'active');
              const parents = activeMembers.filter(m => ['parent', 'guardian'].includes(m.role));
              const kids = activeMembers.filter(m => m.role === 'child');
              
              return {
                ...family,
                totalMembers: activeMembers.length,
                parentsCount: parents.length,
                kidsCount: kids.length,
              };
            } catch (err) {
              console.error(`Error fetching members for family ${family._id}:`, err);
              return {
                ...family,
                totalMembers: 0,
                parentsCount: 0,
                kidsCount: 0,
              };
            }
          })
        );
        
        setFamilies(familiesWithStats);
      } catch (err) {
        console.error("Error fetching families:", err);
        setError(err.message || "Failed to load families");
      } finally {
        setLoading(false);
      }
    }

    fetchFamilies();
  }, []);

  // Reset to page 1 when search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const filteredFamilies = useMemo(() => {
    return families.filter(
      (family) =>
        family.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [families, searchQuery]);

  // Paginated families
  const paginatedFamilies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredFamilies.slice(start, end);
  }, [filteredFamilies, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredFamilies.length / itemsPerPage));

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Loading families...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Families</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search families..."
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
            Loading families...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Composition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFamilies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No families found matching your search" : "No families found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFamilies.map((family) => (
                  <TableRow key={family._id}>
                    <TableCell className="font-medium">{family.name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <span>{family.totalMembers || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-muted-foreground">P:</span> {family.parentsCount || 0}{" "}
                        <span className="text-muted-foreground ml-2">K:</span> {family.kidsCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={family.status === 1 ? "default" : "outline"}
                      >
                        {family.status === 1 ? "active" : "inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(family.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/families/${family._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 size-4" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && !error && filteredFamilies.length > 0 && (
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredFamilies.length)} of {filteredFamilies.length} families
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

