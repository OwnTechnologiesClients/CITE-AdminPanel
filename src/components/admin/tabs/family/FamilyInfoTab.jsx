"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Calendar, ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FamilyInfoTab({ family }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{family.name}</h2>
              <div className="flex items-center gap-4">
                <Badge variant={family.status === "active" ? "default" : "outline"}>
                  {family.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {formatDate(family.createdDate)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <Users className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{family.members}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <ClipboardList className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-2xl font-bold">{family.events.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <Calendar className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                  <p className="text-lg font-semibold">
                    {formatDate(family.lastActivity)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Family Members</h3>
              <div className="space-y-2">
                {family.membersList.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-5 pb-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Parents</p>
                <p className="text-2xl font-bold leading-tight">{family.parents}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Kids</p>
                <p className="text-2xl font-bold leading-tight">{family.kids}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Meals</p>
                <p className="text-2xl font-bold leading-tight">{family.meals.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Lists</p>
                <p className="text-2xl font-bold leading-tight">{family.lists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

