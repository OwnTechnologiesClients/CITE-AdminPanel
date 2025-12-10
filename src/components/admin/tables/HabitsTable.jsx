"use client";

import { useState } from "react";
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
import { sampleHabits } from "@/lib/sampleData/habits";

// Use sample data
const mockHabits = sampleHabits;

export default function HabitsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHabits = mockHabits.filter(
    (habit) =>
      habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (habit.slug && habit.slug.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habit Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Location Tracking</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHabits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No habits found
                </TableCell>
              </TableRow>
            ) : (
              filteredHabits.map((habit) => (
                <TableRow key={habit.id}>
                  <TableCell className="font-medium">{habit.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{habit.slug}</code>
                  </TableCell>
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
                    <Badge variant={habit.status === "active" ? "default" : "outline"}>
                      {habit.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/adults/habits/${habit.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


