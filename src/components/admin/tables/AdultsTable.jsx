"use client";

import { useState } from "react";
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

// Mock data
const mockAdults = [
  {
    id: 1,
    name: "Sarah Smith",
    email: "sarah@example.com",
    habits: 5,
    routines: 3,
    reflections: 12,
    status: "active",
    joinedDate: "2024-01-15",
  },
];

export default function AdultsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdults = mockAdults.filter(
    (adult) =>
      adult.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adult.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <CardTitle>All Adults</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search adults..."
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
              <TableHead>Adult</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Habits</TableHead>
              <TableHead>Routines</TableHead>
              <TableHead>Reflections</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No adults found
                </TableCell>
              </TableRow>
            ) : (
              filteredAdults.map((adult) => (
                <TableRow key={adult.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(adult.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{adult.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{adult.email}</TableCell>
                  <TableCell>{adult.habits}</TableCell>
                  <TableCell>{adult.routines}</TableCell>
                  <TableCell>{adult.reflections}</TableCell>
                  <TableCell>
                    <Badge variant={adult.status === "active" ? "default" : "outline"}>
                      {adult.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(adult.joinedDate)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/adults/users/${adult.id}`}>
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


