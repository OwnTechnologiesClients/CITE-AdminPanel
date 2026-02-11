"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
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
            {reflections.map((reflection) => {
              const feelings = Array.isArray(reflection.feelings) 
                ? reflection.feelings.join(", ") 
                : reflection.feelings || "N/A";
              const reflectionDate = reflection.date || reflection.createdAt;
              const reflectionTime = reflection.time || (reflectionDate ? new Date(reflectionDate).toLocaleTimeString() : "");
              
              return (
                <TableRow key={reflection._id || reflection.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span>{formatDate(reflectionDate)}</span>
                      </div>
                      {reflectionTime && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{reflectionTime}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden>💭</span>
                      <span className="font-medium">{feelings}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reflection.mood === "positive" || reflection.mood === "great" || reflection.mood === "good" ? "default" : "secondary"}>
                      {reflection.mood || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{reflection.notes || "—"}</p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

