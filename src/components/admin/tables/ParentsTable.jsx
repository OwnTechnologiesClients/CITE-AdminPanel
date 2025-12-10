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
import { getParents, getParentStats } from "@/lib/api/parents";
import { getKids } from "@/lib/api/kids";
import { getTasks } from "@/lib/api/tasks";
import { getRewards } from "@/lib/api/rewards";

export default function ParentsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchParents() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all parents
        const parentsData = await getParents();
        
        // Fetch additional data for each parent (kids, tasks, rewards)
        const parentsWithStats = await Promise.all(
          parentsData.map(async (parent) => {
            try {
              const [kids, tasks, rewards] = await Promise.all([
                getKids({ parentId: parent._id }),
                getTasks({ parentId: parent._id }),
                getRewards({ parentId: parent._id }),
              ]);

              return {
                _id: parent._id,
                id: parent._id,
                name: parent.fullName,
                email: parent.email,
                kids: kids.map((kid) => kid.name),
                kidsCount: kids.length,
                tasksCreated: tasks.length,
                rewardsCreated: rewards.length,
                status: parent.status === 1 ? "active" : "inactive",
                joinedDate: parent.createdAt,
              };
            } catch (err) {
              console.error(`Error fetching stats for parent ${parent._id}:`, err);
              return {
                _id: parent._id,
                id: parent._id,
                name: parent.fullName,
                email: parent.email,
                kids: [],
                kidsCount: 0,
                tasksCreated: 0,
                rewardsCreated: 0,
                status: parent.status === 1 ? "active" : "inactive",
                joinedDate: parent.createdAt,
              };
            }
          })
        );

        setParents(parentsWithStats);
      } catch (err) {
        console.error("Error fetching parents:", err);
        setError(err.message || "Failed to load parents");
      } finally {
        setLoading(false);
      }
    }

    fetchParents();
  }, []);

  const filteredParents = parents.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <CardTitle>All Parents</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search parents..."
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
            Loading parents...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Kids</TableHead>
                <TableHead>Tasks Created</TableHead>
                <TableHead>Rewards Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No parents found matching your search" : "No parents found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredParents.map((parent) => (
                  <TableRow key={parent._id || parent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(parent.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{parent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>{parent.kidsCount || parent.kids?.length || 0}</TableCell>
                    <TableCell>{parent.tasksCreated}</TableCell>
                    <TableCell>{parent.rewardsCreated}</TableCell>
                    <TableCell>
                      <Badge variant={parent.status === "active" ? "default" : "outline"}>
                        {parent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(parent.joinedDate)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/parents-kids/parents/${parent._id || parent.id}`}>
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


