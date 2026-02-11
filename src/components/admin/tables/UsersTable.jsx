"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getUsers } from "@/lib/api/users";
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

const roleColors = {
  Parent: "default",
  Kid: "secondary",
  Adult: "outline",
  Admin: "destructive",
};

export default function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const usersData = await getUsers();
        // Filter out admin users (safety measure)
        const nonAdminUsers = usersData.filter(user => {
          if (user.userType === 'admin') return false;
          if (user.roles && Array.isArray(user.roles)) {
            const hasAdminRole = user.roles.some(role => {
              const roleName = typeof role === 'object' ? role.name : role;
              return roleName === 'admin';
            });
            if (hasAdminRole) return false;
          }
          return true;
        });
        setUsers(nonAdminUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Reset to page 1 when search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

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
          <CardTitle>All Users</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
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
            Loading users...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No users found matching your search" : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => {
                  const userRoles = user.roles || [];
                  const primaryRole = userRoles[0]?.name || user.userType || "N/A";
                  const userName = user.fullName || user.username || "Unknown";
                  
                  return (
                    <TableRow key={user._id || user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{userName}</div>
                            <div className="text-sm text-muted-foreground">{user.email || user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleColors[primaryRole] || "default"}>
                          {primaryRole}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.userType || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === 1 || user.status === "active" ? "default" : "outline"}
                        >
                          {user.status === 1 ? "active" : user.status === 0 ? "inactive" : user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt || user.created)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/users/${user._id || user.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-2 size-4" />
                            View Details
                          </Button>
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
        {!loading && !error && filteredUsers.length > 0 && (
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

