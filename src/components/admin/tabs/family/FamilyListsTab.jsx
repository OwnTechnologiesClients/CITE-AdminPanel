"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function FamilyListsTab({ lists }) {
  return (
    <div className="space-y-4">
      {lists.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No lists found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <Card key={list.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{list.title}</h3>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Created by {list.createdBy.name}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-lg border"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground" />
                      )}
                      <span
                        className={item.completed ? "line-through text-muted-foreground" : ""}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

