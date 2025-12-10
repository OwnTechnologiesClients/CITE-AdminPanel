"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, DollarSign, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

const trackerIcons = {
  location: MapPin,
  expense: DollarSign,
};

export default function FamilyTrackerTab({ tracker }) {
  return (
    <div className="space-y-4">
      {tracker.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No trackers found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tracker.map((item) => {
            const Icon = trackerIcons[item.type] || Activity;
            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-primary" />
                      <CardTitle>{item.title}</CardTitle>
                    </div>
                    <Badge variant={item.status === "active" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>Last update: {formatDate(item.lastUpdate)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

