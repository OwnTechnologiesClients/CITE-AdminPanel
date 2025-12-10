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
import { formatDate } from "@/lib/utils";

// Mock data
const mockReflections = [
  {
    id: 1,
    user: "Sarah Smith",
    feeling: "Happy",
    mood: "positive",
    notes: "Had a great day at work",
    date: "2024-12-15",
  },
];

export default function ReflectionsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReflections = mockReflections.filter(
    (reflection) =>
      reflection.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reflection.feeling.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Reflections</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search reflections..."
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
              <TableHead>User</TableHead>
              <TableHead>Feeling</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReflections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No reflections found
                </TableCell>
              </TableRow>
            ) : (
              filteredReflections.map((reflection) => (
                <TableRow key={reflection.id}>
                  <TableCell className="font-medium">{reflection.user}</TableCell>
                  <TableCell>{reflection.feeling}</TableCell>
                  <TableCell>
                    <Badge variant={reflection.mood === "positive" ? "default" : "secondary"}>
                      {reflection.mood}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{reflection.notes}</TableCell>
                  <TableCell>{formatDate(reflection.date)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/adults/reflections/${reflection.id}`}>
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


