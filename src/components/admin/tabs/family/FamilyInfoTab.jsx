"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Calendar, ClipboardList, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function FamilyInfoTab({ family, stats, members = [], eventsCount = 0, mealsCount = 0, recipesCount = 0, listsCount = 0 }) {
  const activeMembers = members.filter(m => m.status === 'active');
  const parents = activeMembers.filter(m => ['parent', 'guardian'].includes(m.role));
  const kids = activeMembers.filter(m => m.role === 'child');
  const totalMembers = activeMembers.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{family.name || "N/A"}</h2>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant={family.status === 1 ? "default" : "outline"}>
                  {family.status === 1 ? "active" : "inactive"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {formatDate(family.createdAt)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <Users className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{totalMembers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <ClipboardList className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-2xl font-bold">{eventsCount}</p>
                </div>
              </div>
              {stats?.lastActivity && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                  <Calendar className="size-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity</p>
                    <p className="text-lg font-semibold">
                      {formatDate(stats.lastActivity)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Family Members</h3>
              {activeMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No active members found</p>
              ) : (
                <div className="space-y-2">
                  {activeMembers.map((member) => {
                    const memberUserId = member.userId?._id || member.userId?.id || member.userId;
                    const memberName = member.userId?.fullName || member.userId?.username || "N/A";
                    const memberEmail = member.userId?.email;
                    
                    const getInitials = (name) => {
                      if (!name) return "??";
                      return name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                    };

                    const memberCard = (
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="size-10">
                            <AvatarFallback className="text-sm">{getInitials(memberName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">
                              {memberName}
                            </p>
                            {memberEmail && (
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="size-3 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{memberEmail}</p>
                              </div>
                            )}
                            {member.isPrimary && (
                              <Badge variant="default" className="mt-1 text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{member.role || "N/A"}</Badge>
                          <Badge variant={member.status === 'active' ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    );

                    return memberUserId ? (
                      <Link key={member._id} href={`/admin/users/${memberUserId}`}>
                        {memberCard}
                      </Link>
                    ) : (
                      <div key={member._id}>
                        {memberCard}
                      </div>
                    );
                  })}
                </div>
              )}
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
                <p className="text-2xl font-bold leading-tight">{parents.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Kids</p>
                <p className="text-2xl font-bold leading-tight">{kids.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Meals</p>
                <p className="text-2xl font-bold leading-tight">{mealsCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Lists</p>
                <p className="text-2xl font-bold leading-tight">{listsCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-tight mb-1">Recipes</p>
                <p className="text-2xl font-bold leading-tight">{recipesCount}</p>
              </div>
              {stats && (
                <div>
                  <p className="text-sm text-muted-foreground leading-tight mb-1">Total</p>
                  <p className="text-2xl font-bold leading-tight">{stats.totalMembers || totalMembers}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

