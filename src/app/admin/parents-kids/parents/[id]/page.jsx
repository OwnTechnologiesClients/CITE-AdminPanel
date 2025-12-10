"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Calendar, Users, ClipboardList, Gift, Coins } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { getParentById, getParentStats } from "@/lib/api/parents";
import { getKids } from "@/lib/api/kids";
import { getTasks } from "@/lib/api/tasks";
import { getRewards } from "@/lib/api/rewards";
import { getKidStats } from "@/lib/api/kids";

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

export default function ViewParentPage() {
  const params = useParams();
  const id = params.id;
  const [parent, setParent] = useState(null);
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchParentData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch parent data
        const parentData = await getParentById(id);
        
        // Fetch kids, tasks, and rewards for this parent
        const [kidsData, tasksData, rewardsData] = await Promise.all([
          getKids({ parentId: id }),
          getTasks({ parentId: id }),
          getRewards({ parentId: id }),
        ]);

        // Fetch stats for each kid
        const kidsWithStats = await Promise.all(
          kidsData.map(async (kid) => {
            try {
              const stats = await getKidStats(kid._id);
              const age = kid.dateOfBirth ? calculateAge(kid.dateOfBirth) : null;
              return {
                _id: kid._id,
                id: kid._id,
                name: kid.name,
                age: age,
                tasksCompleted: stats?.completedTasks || 0,
                coins: kid.totalCoins || stats?.totalCoins || 0,
                status: kid.status === 1 ? "active" : "inactive",
              };
            } catch (err) {
              console.error(`Error fetching stats for kid ${kid._id}:`, err);
              const age = kid.dateOfBirth ? calculateAge(kid.dateOfBirth) : null;
              return {
                _id: kid._id,
                id: kid._id,
                name: kid.name,
                age: age,
                tasksCompleted: 0,
                coins: kid.totalCoins || 0,
                status: kid.status === 1 ? "active" : "inactive",
              };
            }
          })
        );

        setParent({
          _id: parentData._id,
          id: parentData._id,
          name: parentData.fullName,
          email: parentData.email,
          phone: parentData.phoneNumber || "N/A",
          status: parentData.status === 1 ? "active" : "inactive",
          joinedDate: parentData.createdAt,
          lastActive: parentData.updatedAt,
          tasksCreated: tasksData.length,
          rewardsCreated: rewardsData.length,
        });
        setKids(kidsWithStats);
      } catch (err) {
        console.error("Error fetching parent data:", err);
        setError(err.message || "Failed to load parent data");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchParentData();
    }
  }, [id]);

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          Loading parent data...
        </div>
      </div>
    );
  }

  if (error || !parent) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">
          {error || "Parent not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/parents-kids/parents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parent Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage parent information
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Parent Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Parent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">{getInitials(parent.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{parent.name}</h2>
                <p className="text-muted-foreground">{parent.email}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={parent.status === "active" ? "default" : "outline"}>
                    {parent.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="mt-1 font-medium">{parent.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Joined Date</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(parent.joinedDate)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Active</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(parent.lastActive)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <ClipboardList className="size-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Created</p>
                  <p className="text-2xl font-bold">{parent.tasksCreated}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Gift className="size-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rewards Created</p>
                  <p className="text-2xl font-bold">{parent.rewardsCreated}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Kids</p>
                  <p className="text-2xl font-bold">{kids.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kids List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Their Kids ({kids.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {kids.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="size-12 mx-auto mb-4 opacity-50" />
              <p>No kids assigned to this parent yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kid Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Tasks Completed</TableHead>
                  <TableHead>Coins</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kids.map((kid) => (
                  <TableRow key={kid._id || kid.id}>
                    <TableCell className="font-medium">{kid.name}</TableCell>
                    <TableCell>{kid.age !== null ? `${kid.age} years` : "N/A"}</TableCell>
                    <TableCell>{kid.tasksCompleted}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coins className="size-4 text-yellow-600" />
                        {kid.coins.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={kid.status === "active" ? "default" : "outline"}>
                        {kid.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/parents-kids/kids/${kid._id || kid.id}`}>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


