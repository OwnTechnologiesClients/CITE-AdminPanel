"use client";

import { useState } from "react";
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

// Mock data
const mockRoutines = [
  {
    id: 1,
    name: "Morning Routine",
    user: "Sarah Smith",
    tasks: 5,
    status: "active",
  },
];

export default function RoutinesTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoutines = mockRoutines.filter(
    (routine) =>
      routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routine.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Routines</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search routines..."
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
              <TableHead>Routine Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No routines found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoutines.map((routine) => (
                <TableRow key={routine.id}>
                  <TableCell className="font-medium">{routine.name}</TableCell>
                  <TableCell>{routine.user}</TableCell>
                  <TableCell>{routine.tasks}</TableCell>
                  <TableCell>
                    <Badge variant={routine.status === "active" ? "default" : "outline"}>
                      {routine.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/adults/routines/${routine.id}`}>
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


