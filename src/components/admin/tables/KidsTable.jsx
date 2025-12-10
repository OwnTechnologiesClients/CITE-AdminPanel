"use client";

import { useState, useEffect } from "react";
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
              const [stats, tasks, parent] = await Promise.all([
                getKidStats(kid._id).catch(() => ({ completedTasks: 0, totalCoins: 0 })),
                getTasks({ kidId: kid._id }).catch(() => []),
                kid.parentId?._id ? getParentById(kid.parentId._id).catch(() => null) : Promise.resolve(kid.parentId),
              ]);

              const completedTasks = tasks.filter((task) => task.isCompleted).length;
              const age = kid.dateOfBirth ? calculateAge(kid.dateOfBirth) : null;

              return {
                _id: kid._id,
                id: kid._id,
                name: kid.name,
                age: age,
                parent: parent?.fullName || kid.parentId?.fullName || "Unknown",
                parentId: kid.parentId?._id || kid.parentId,
                tasksCompleted: stats?.completedTasks || completedTasks,
                coins: kid.totalCoins || stats?.totalCoins || 0,
                status: kid.status === 1 ? "active" : "inactive",
                joinedDate: kid.createdAt,
              };
            } catch (err) {
              console.error(`Error fetching stats for kid ${kid._id}:`, err);
              const age = kid.dateOfBirth ? calculateAge(kid.dateOfBirth) : null;
              return {
                _id: kid._id,
                id: kid._id,
                name: kid.name,
                age: age,
                parent: kid.parentId?.fullName || "Unknown",
                parentId: kid.parentId?._id || kid.parentId,
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

  const filteredKids = kids.filter(
    (kid) =>
      kid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kid.parent.toLowerCase().includes(searchQuery.toLowerCase())
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
                filteredKids.map((kid) => (
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
      </CardContent>
    </Card>
  );
}


