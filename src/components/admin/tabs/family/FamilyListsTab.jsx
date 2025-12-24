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
            <Card key={list._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{list.name || "N/A"}</h3>
                    {list.category && (
                      <Badge variant="outline" className="capitalize">
                        {list.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {list.createdBy ? (
                        <>Created by {list.createdBy.fullName || list.createdBy.username || "N/A"}</>
                      ) : (
                        <>Created {formatDate(list.createdAt)}</>
                      )}
                    </span>
                  </div>
                </div>
                {list.description && (
                  <p className="text-sm text-muted-foreground mb-4">{list.description}</p>
                )}
                {list.items && list.items.length > 0 ? (
                  <div className="space-y-2">
                    {list.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-2 p-2 rounded-lg border"
                      >
                        {item.isCompleted ? (
                          <CheckCircle2 className="size-5 text-green-600" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground" />
                        )}
                        <span
                          className={item.isCompleted ? "line-through text-muted-foreground" : ""}
                        >
                          {item.text || "N/A"}
                        </span>
                        {item.priority && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Priority: {item.priority}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">No items in this list</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

