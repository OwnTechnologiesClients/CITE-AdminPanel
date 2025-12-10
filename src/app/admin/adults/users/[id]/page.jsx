"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Mail, Phone, Target, Heart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { sampleAdultUser } from "@/lib/sampleData/adultUsers";
import UserHabitsTab from "@/components/admin/tabs/UserHabitsTab";
import UserReflectionsTab from "@/components/admin/tabs/UserReflectionsTab";

export default function AdultUserDetailPage() {
  const params = useParams();
  const userId = parseInt(params.id);
  
  // Debug: Log the params
  console.log("User ID from params:", params.id, "Parsed:", userId);
  
  const user = sampleAdultUser; // In real app, fetch by userId
  
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/adults/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Not Found</h1>
            <p className="text-muted-foreground mt-2">
              The user with ID {userId} could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground mt-2">
            View and manage adult user information
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="habits">
                Habits ({user.habits.length})
              </TabsTrigger>
              <TabsTrigger value="reflections">
                Reflections ({user.reflections.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* User Information Card */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-16">
                        <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-semibold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="mt-1 font-medium flex items-center gap-2">
                          <Mail className="size-4 text-muted-foreground" />
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="mt-1 font-medium flex items-center gap-2">
                          <Phone className="size-4 text-muted-foreground" />
                          {user.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="mt-1">
                          <Badge variant={user.status === "active" ? "default" : "outline"}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Joined Date</Label>
                        <p className="mt-1 font-medium flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          {formatDate(user.joinedDate)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Last Active</Label>
                        <p className="mt-1 font-medium flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          {formatDate(user.lastActive)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Member Since</Label>
                        <p className="mt-1 font-medium">{formatDate(user.joinedDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <Target className="size-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Habits</p>
                          <p className="text-2xl font-bold">{user.habits.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <Heart className="size-5 text-pink-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Reflections</p>
                          <p className="text-2xl font-bold">{user.reflections.length}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="habits" className="mt-6">
              <UserHabitsTab userId={userId} habits={user.habits} />
            </TabsContent>

            <TabsContent value="reflections" className="mt-6">
              <UserReflectionsTab reflections={user.reflections} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

