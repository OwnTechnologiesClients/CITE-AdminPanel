"use client";

import { useState, useEffect } from "react";
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
import { getTasks } from "@/lib/api/tasks";
import { getKidById } from "@/lib/api/kids";
import { getParentById } from "@/lib/api/parents";

export default function KidTasksTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all tasks (admin sees all)
        const tasksData = await getTasks();
        
        // Fetch kid and parent info for each task
        const tasksWithDetails = await Promise.all(
          tasksData.map(async (task) => {
            try {
              const [kid, parent] = await Promise.all([
                task.kidId?._id ? getKidById(task.kidId._id).catch(() => task.kidId) : Promise.resolve(task.kidId),
                task.parentId?._id ? getParentById(task.parentId._id).catch(() => task.parentId) : Promise.resolve(task.parentId),
              ]);

              return {
                _id: task._id,
                id: task._id,
                title: task.name,
                kid: kid?.name || task.kidId?.name || "Unknown",
                parent: parent?.fullName || task.parentId?.fullName || "Unknown",
                coins: task.starsPerCompletion || 0,
                status: task.isCompleted ? "completed" : "pending",
                dueDate: task.startDate,
                photoProof: task.requiresPhotoProof || false,
              };
            } catch (err) {
              console.error(`Error fetching details for task ${task._id}:`, err);
              return {
                _id: task._id,
                id: task._id,
                title: task.name,
                kid: task.kidId?.name || "Unknown",
                parent: task.parentId?.fullName || "Unknown",
                coins: task.starsPerCompletion || 0,
                status: task.isCompleted ? "completed" : "pending",
                dueDate: task.startDate,
                photoProof: task.requiresPhotoProof || false,
              };
            }
          })
        );

        setTasks(tasksWithDetails);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.kid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Kid Tasks</CardTitle>
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
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading tasks...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Kid</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Coins</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Photo Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No tasks found matching your search" : "No tasks found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task._id || task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.kid}</TableCell>
                    <TableCell>{task.parent}</TableCell>
                    <TableCell>{task.coins}</TableCell>
                    <TableCell>
                      <Badge variant={task.status === "completed" ? "default" : "outline"}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant={task.photoProof ? "default" : "outline"}>
                        {task.photoProof ? "Required" : "Not Required"}
                      </Badge>
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


