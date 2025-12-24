"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function FamilyMealsTab({ meals }) {
  return (
    <div className="space-y-4">
      {meals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No meals found
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meals.map((meal) => (
              <TableRow key={meal._id}>
                <TableCell className="font-medium">{meal.title || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {meal.type || "other"}
                  </Badge>
                  {meal.isCompleted && (
                    <Badge variant="default" className="ml-2">Completed</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>{formatDate(meal.date)}</span>
                    </div>
                    {meal.time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{meal.time}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{meal.description || "N/A"}</span>
                  {meal.servings && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({meal.servings} servings)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {meal.createdBy ? (
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span className="font-medium">
                        {meal.createdBy.fullName || meal.createdBy.username || "N/A"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

