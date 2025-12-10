"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

// Mock data - replace with actual API call
const mockFamilies = [
  {
    id: 1,
    name: "Doe Family",
    members: 4,
    parents: 2,
    kids: 2,
    tasksActive: 12,
    eventsUpcoming: 3,
    status: "active",
    createdDate: "2024-01-15",
    lastActivity: "2024-12-15",
  },
  {
    id: 2,
    name: "Smith Family",
    members: 3,
    parents: 2,
    kids: 1,
    tasksActive: 8,
    eventsUpcoming: 2,
    status: "active",
    createdDate: "2024-02-20",
    lastActivity: "2024-12-14",
  },
  {
    id: 3,
    name: "Johnson Family",
    members: 5,
    parents: 2,
    kids: 3,
    tasksActive: 15,
    eventsUpcoming: 5,
    status: "active",
    createdDate: "2024-01-10",
    lastActivity: "2024-12-15",
  },
  {
    id: 4,
    name: "Brown Family",
    members: 2,
    parents: 0,
    kids: 0,
    tasksActive: 5,
    eventsUpcoming: 1,
    status: "active",
    createdDate: "2024-03-05",
    lastActivity: "2024-12-10",
  },
  {
    id: 5,
    name: "Wilson Family",
    members: 3,
    parents: 1,
    kids: 2,
    tasksActive: 0,
    eventsUpcoming: 0,
    status: "inactive",
    createdDate: "2024-04-12",
    lastActivity: "2024-11-20",
  },
];

export default function FamiliesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [families] = useState(mockFamilies);

  const filteredFamilies = families.filter(
    (family) =>
      family.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Families</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search families..."
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
              <TableHead>Family Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Composition</TableHead>
              <TableHead>Active Tasks</TableHead>
              <TableHead>Upcoming Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFamilies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No families found
                </TableCell>
              </TableRow>
            ) : (
              filteredFamilies.map((family) => (
                <TableRow key={family.id}>
                  <TableCell className="font-medium">{family.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" />
                      <span>{family.members}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-muted-foreground">P:</span> {family.parents}{" "}
                      <span className="text-muted-foreground ml-2">K:</span> {family.kids}
                    </div>
                  </TableCell>
                  <TableCell>{family.tasksActive}</TableCell>
                  <TableCell>{family.eventsUpcoming}</TableCell>
                  <TableCell>
                    <Badge
                      variant={family.status === "active" ? "default" : "outline"}
                    >
                      {family.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(family.createdDate)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(family.lastActivity)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/families/${family.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 size-4" />
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredFamilies.length} of {families.length} families
        </div>
      </CardContent>
    </Card>
  );
}

