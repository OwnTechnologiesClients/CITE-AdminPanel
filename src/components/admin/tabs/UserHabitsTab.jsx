"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Target } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HabitDetailModal from "@/components/admin/modals/HabitDetailModal";

export default function UserHabitsTab({ userId, habits }) {
  const router = useRouter();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewHabit = (habit) => {
    const habitId = habit._id || habit.id;
    if (habit.locationTracking) {
      // For location-tracked habits, navigate to sessions page
      router.push(`/admin/adults/users/${userId}/habits/${habitId}/sessions`);
    } else {
      // For non-location habits, show modal
      setSelectedHabit(habit);
      setModalOpen(true);
    }
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
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Habit Name</TableHead>
                <TableHead>Location Tracking</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {habits.map((habit) => (
                <TableRow key={habit._id || habit.id}>
                  <TableCell className="font-medium">{habit.name}</TableCell>
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
                    <div className="flex items-center gap-1">
                      <Target className="size-4 text-muted-foreground" />
                      {habit.streak || 0} days
                    </div>
                  </TableCell>
                  <TableCell>
                    {habit.completedSessions || 0} / {habit.totalSessions || 0}
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
                      {habit.locationTracking ? "View Sessions" : "View Details"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Modal for non-location habits */}
          {selectedHabit && !selectedHabit.locationTracking && (
            <HabitDetailModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              habit={selectedHabit}
            />
          )}
        </>
      )}
    </div>
  );
}

