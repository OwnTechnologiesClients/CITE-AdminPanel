"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, CheckCircle2, Clock, XCircle } from "lucide-react";
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
const mockTasks = [
  {
    id: 1,
    title: "Complete Math Homework",
    assignedTo: "Emma Johnson",
    assignedBy: "John Doe",
    family: "Doe Family",
    type: "Kid Task",
    status: "completed",
    dueDate: "2024-12-10",
    completedDate: "2024-12-09",
    coins: 50,
  },
  {
    id: 2,
    title: "Take out the trash",
    assignedTo: "Michael Brown",
    assignedBy: "Sarah Brown",
    family: "Brown Family",
    type: "Family Task",
    status: "pending",
    dueDate: "2024-12-16",
    completedDate: null,
    coins: 25,
  },
  {
    id: 3,
    title: "Morning Exercise",
    assignedTo: "Jane Smith",
    assignedBy: "Self",
    family: "Smith Family",
    type: "Adult Habit",
    status: "in_progress",
    dueDate: "2024-12-15",
    completedDate: null,
    coins: 30,
  },
  {
    id: 4,
    title: "Read for 30 minutes",
    assignedTo: "Emma Johnson",
    assignedBy: "John Doe",
    family: "Doe Family",
    type: "Kid Task",
    status: "pending",
    dueDate: "2024-12-17",
    completedDate: null,
    coins: 40,
  },
  {
    id: 5,
    title: "Family Dinner Prep",
    assignedTo: "All Members",
    assignedBy: "Jane Smith",
    family: "Smith Family",
    type: "Family Task",
    status: "completed",
    dueDate: "2024-12-12",
    completedDate: "2024-12-12",
    coins: 75,
  },
];

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle2, variant: "default" },
  in_progress: { label: "In Progress", icon: Clock, variant: "secondary" },
  pending: { label: "Pending", icon: Clock, variant: "outline" },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "outline" },
};

export default function TasksTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks] = useState(mockTasks);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tasks..."
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
              <TableHead>Task</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Family</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Coins</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => {
                const status = statusConfig[task.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>{task.assignedBy}</TableCell>
                    <TableCell>{task.family}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="size-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{task.coins}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/tasks/${task.id}`}>
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
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </CardContent>
    </Card>
  );
}

