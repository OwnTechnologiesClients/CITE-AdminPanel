"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function UserReflectionsTab({ reflections }) {
  return (
    <div className="space-y-4">
      {reflections.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No reflections found for this user
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Feeling</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reflections.map((reflection) => (
              <TableRow key={reflection.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>{formatDate(reflection.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{reflection.time}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Heart className="size-4 text-muted-foreground" />
                    <span className="font-medium">{reflection.feeling}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={reflection.mood === "positive" ? "default" : "secondary"}>
                    {reflection.mood}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate">{reflection.notes}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

