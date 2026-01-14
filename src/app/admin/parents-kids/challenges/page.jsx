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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { getChallenges } from "@/lib/api/challenges";
import { Eye, Trophy, Calendar, Users, Gift, Search, Baby } from "lucide-react";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function ParentsKidsChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          module: "parents_kids" // Always filter by parents_kids module
        };
        if (statusFilter !== "all") {
          params.challengeStatus = statusFilter;
        }
        
        const challengesData = await getChallenges(params);
        setChallenges(challengesData);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError(err.message || "Failed to load challenges");
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [statusFilter]);

  const filteredChallenges = useMemo(() => {
    if (!searchQuery) return challenges;
    
    const query = searchQuery.toLowerCase();
    return challenges.filter((challenge) => {
      return (
        challenge.title?.toLowerCase().includes(query) ||
        challenge.description?.toLowerCase().includes(query) ||
        challenge.createdBy?.fullName?.toLowerCase().includes(query) ||
        challenge.createdBy?.username?.toLowerCase().includes(query)
      );
    });
  }, [challenges, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const totalPages = filteredChallenges.length
    ? Math.ceil(filteredChallenges.length / ITEMS_PER_PAGE)
    : 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedChallenges = filteredChallenges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeStart = filteredChallenges.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;

  const activeEnd = filteredChallenges.length
    ? Math.min(currentPage * ITEMS_PER_PAGE, filteredChallenges.length)
    : 0;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      active: "default",
      completed: "default",
      cancelled: "destructive",
    };
    const classNames = {
      draft: "",
      active: "",
      completed: "bg-green-500 text-white",
      cancelled: "",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className={classNames[status] || ""}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Baby className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parents & Kids Challenges</h1>
          <p className="text-muted-foreground mt-1">
            View all challenges created by parents for their kids
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Search challenges by title, description, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {filteredChallenges.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="size-12 mx-auto mb-4 opacity-50" />
                <p>No challenges found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Kids</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Winner</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedChallenges.map((challenge) => (
                      <TableRow key={challenge._id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{challenge.title}</span>
                            {challenge.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {challenge.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(challenge.challengeStatus)}</TableCell>
                        <TableCell>
                          {challenge.createdBy?.fullName || challenge.createdBy?.username || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="size-4 text-muted-foreground" />
                            <span>{challenge.participants?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="size-3 text-muted-foreground" />
                            {formatDate(challenge.startDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="size-3 text-muted-foreground" />
                            {formatDate(challenge.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Gift className="size-4 text-muted-foreground" />
                            <span className="text-sm">
                              {challenge.reward?.coins || 0} coins
                              {challenge.reward?.item?.name && " + item"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {challenge.winnerId ? (
                            <Badge variant="default" className="bg-green-500 text-white">Winner Selected</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">No winner</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/parents-kids/challenges/${challenge._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="size-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex flex-col border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing {activeStart}–{activeEnd} of {filteredChallenges.length} challenges
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || filteredChallenges.length === 0}
                    >
                      Next
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
