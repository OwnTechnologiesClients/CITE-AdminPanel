"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Target, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HabitDetailModal({ open, onOpenChange, habit }) {
  if (!habit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{habit.name}</DialogTitle>
          <DialogDescription>
            View details for this habit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Slug</Label>
              <div className="mt-1">
                <code className="text-xs bg-muted px-2 py-1 rounded">{habit.slug || "N/A"}</code>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge variant={habit.status === "active" ? "default" : "outline"}>
                  {habit.status}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Location Tracking</Label>
              <div className="mt-1">
                {habit.locationTracking ? (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="size-3" />
                    Enabled
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Disabled</span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Streak</Label>
              <div className="mt-1 flex items-center gap-2">
                <Target className="size-4 text-muted-foreground" />
                <span className="font-medium">{habit.streak} days</span>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Total Sessions</Label>
              <p className="mt-1 font-medium">{habit.totalSessions}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Completed Sessions</Label>
              <p className="mt-1 font-medium">{habit.completedSessions}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Created At</Label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(habit.createdAt)}</span>
              </div>
            </div>
          </div>

          {habit.description && (
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-1 text-sm">{habit.description}</p>
            </div>
          )}

          {habit.locationTracking && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <Label className="text-muted-foreground">Location Tracking Settings</Label>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Distance:</span>
                  <span className="font-medium">{habit.minDistance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Duration:</span>
                  <span className="font-medium">{habit.minDuration} minutes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

