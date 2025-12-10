import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Bell, Database, KeyRound } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage system-wide settings and configurations
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Role Permissions
            </CardTitle>
            <CardDescription>
              Configure role-based permissions for Parent, Kid, Adult, and Admin roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Manage Roles</Label>
                <p className="text-sm text-muted-foreground">
                  Create and manage roles, assign permissions to roles
                </p>
              </div>
              <Link href="/admin/roles">
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Roles
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Manage Permissions</Label>
                <p className="text-sm text-muted-foreground">
                  Create and manage permissions, organize into groups
                </p>
              </div>
              <Link href="/admin/permissions">
                <Button variant="outline">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Manage Permissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure system-wide notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for important events
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable push notifications for mobile apps
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Task Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send task reminders
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Manage system-level configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Coins per Task</Label>
              <Input type="number" defaultValue="50" />
            </div>
            <div className="space-y-2">
              <Label>Maximum Family Members</Label>
              <Input type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label>Invite Link Expiry (days)</Label>
              <Input type="number" defaultValue="7" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

