"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Target } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserHabitsTab({ userId, habits }) {
  const router = useRouter();

  const handleViewHabit = (habit) => {
    const habitId = habit._id || habit.id;
    router.push(`/admin/adults/users/${userId}/habits/${habitId}`);
  };

  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No habits found for this user
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habit Name</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {habits.map((habit) => (
              <TableRow key={habit._id || habit.id}>
                <TableCell className="font-medium">{habit.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Target className="size-4 text-muted-foreground" />
                    {habit.streak || 0} days
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={habit.status === 1 && habit.isActive ? "default" : "outline"}>
                    {habit.status === 1 && habit.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewHabit(habit)}
                  >
                    <Eye className="size-4 mr-2" />
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
