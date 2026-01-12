"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getHabits } from "@/lib/api/habits";
import { formatDate } from "@/lib/utils";

export default function HabitsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHabits() {
      try {
        setLoading(true);
        setError(null);
        const habitsData = await getHabits();
        setHabits(habitsData);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError(err.message || "Failed to load habits");
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  const filteredHabits = habits.filter(
    (habit) =>
      habit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (habit.userId?.fullName && habit.userId.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (habit.userId?.email && habit.userId.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Habits</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search habits..."
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
            Loading habits...
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
                  <TableHead>Habit Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Location Tracking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHabits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No habits found matching your search" : "No habits found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHabits.map((habit) => {
                    const userName = habit.userId?.fullName || habit.userId?.email || "Unknown";
                    return (
                      <TableRow key={habit._id || habit.id}>
                        <TableCell className="font-medium">{habit.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{userName}</TableCell>
                        <TableCell>
                          {habit.locationTracking ? (
                            <Badge variant="outline" className="gap-1">
                              <MapPin className="size-3" />
                              Enabled
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Disabled</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={habit.status === 1 && habit.isActive ? "default" : "outline"}>
                            {habit.status === 1 && habit.isActive ? "active" : "inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(habit.createdAt || habit.created)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/adults/habits/${habit._id || habit.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredHabits.length} of {habits.length} habits
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}


