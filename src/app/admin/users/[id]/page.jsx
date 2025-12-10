import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Mail, Calendar, Users, Coins, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Mock data - replace with actual API call
async function getUser(id) {
  // In real app, fetch from API
  return {
    id: id,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Parent",
    family: "Doe Family",
    status: "active",
    tasksCompleted: 45,
    coins: 1250,
    joinedDate: "2024-01-15",
    phone: "+1 234 567 8900",
    lastActive: "2024-12-15",
  };
}

export default async function ViewUserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage user information
            </p>
          </div>
        </div>
        <Link href={`/admin/users/${id}/edit`}>
          <Button>
            <Edit className="mr-2 size-4" />
            Edit User
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
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
                <Label className="text-muted-foreground">Role</Label>
                <div className="mt-1">
                  <Badge variant="default">{user.role}</Badge>
                </div>
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
                <Label className="text-muted-foreground">Family</Label>
                <p className="mt-1 font-medium">{user.family}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="mt-1 font-medium">{user.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Joined Date</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {new Date(user.joinedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Active</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {new Date(user.lastActive).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-bold">{user.tasksCompleted}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Coins className="size-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Coins</p>
                  <p className="text-2xl font-bold">{user.coins.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

