"use client";

import { useState, useEffect } from "react";
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

// Mock data - fallback (not used if API works)
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Parent",
    family: "Doe Family",
    status: "active",
    tasksCompleted: 45,
    coins: 1250,
    joinedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Parent",
    family: "Smith Family",
    status: "active",
    tasksCompleted: 38,
    coins: 980,
    joinedDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Emma Johnson",
    email: "emma.j@example.com",
    role: "Kid",
    family: "Johnson Family",
    status: "active",
    tasksCompleted: 67,
    coins: 2100,
    joinedDate: "2024-01-10",
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "m.brown@example.com",
    role: "Adult",
    family: "Brown Family",
    status: "active",
    tasksCompleted: 52,
    coins: 1450,
    joinedDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    role: "Parent",
    family: "Wilson Family",
    status: "inactive",
    tasksCompleted: 12,
    coins: 350,
    joinedDate: "2024-04-12",
  },
];

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

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <>
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
                  filteredUsers.map((user) => {
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
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

