"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Static data - grouped permissions by permission groups
const mockGroupedPermissions = [
  {
    _id: "1",
    groupName: "Dashboard",
    description: "Dashboard access and viewing permissions",
    permissions: [
      {
        _id: "p1",
        name: "view-dashboard",
        description: "Access dashboard",
        selected: true,
      },
      {
        _id: "p2",
        name: "view-analytics",
        description: "View analytics and reports",
        selected: true,
      },
    ],
  },
  {
    _id: "2",
    groupName: "User Management",
    description: "User and account management permissions",
    permissions: [
      {
        _id: "p3",
        name: "view-users",
        description: "View user list",
        selected: true,
      },
      {
        _id: "p4",
        name: "create-users",
        description: "Create new users",
        selected: false,
      },
      {
        _id: "p5",
        name: "update-users",
        description: "Update user information",
        selected: true,
      },
      {
        _id: "p6",
        name: "delete-users",
        description: "Delete users",
        selected: false,
      },
    ],
  },
  {
    _id: "3",
    groupName: "Kids Management",
    description: "Kids and children management permissions",
    permissions: [
      {
        _id: "p7",
        name: "view-kids",
        description: "View kids list",
        selected: true,
      },
      {
        _id: "p8",
        name: "create-kids",
        description: "Create new kid profiles",
        selected: true,
      },
      {
        _id: "p9",
        name: "update-kids",
        description: "Update kid information",
        selected: true,
      },
      {
        _id: "p10",
        name: "delete-kids",
        description: "Delete kid profiles",
        selected: false,
      },
    ],
  },
  {
    _id: "4",
    groupName: "Tasks Management",
    description: "Task creation and management permissions",
    permissions: [
      {
        _id: "p11",
        name: "view-tasks",
        description: "View tasks",
        selected: true,
      },
      {
        _id: "p12",
        name: "create-tasks",
        description: "Create new tasks",
        selected: true,
      },
      {
        _id: "p13",
        name: "update-tasks",
        description: "Update tasks",
        selected: true,
      },
      {
        _id: "p14",
        name: "delete-tasks",
        description: "Delete tasks",
        selected: false,
      },
    ],
  },
  {
    _id: "5",
    groupName: "Rewards Management",
    description: "Reward creation and management permissions",
    permissions: [
      {
        _id: "p15",
        name: "view-rewards",
        description: "View rewards",
        selected: true,
      },
      {
        _id: "p16",
        name: "create-rewards",
        description: "Create new rewards",
        selected: true,
      },
      {
        _id: "p17",
        name: "update-rewards",
        description: "Update rewards",
        selected: true,
      },
      {
        _id: "p18",
        name: "delete-rewards",
        description: "Delete rewards",
        selected: false,
      },
    ],
  },
  {
    _id: "6",
    groupName: "Role Management",
    description: "Role and permission management",
    permissions: [
      {
        _id: "p19",
        name: "view-roles",
        description: "View roles list",
        selected: false,
      },
      {
        _id: "p20",
        name: "manage-roles",
        description: "Create and manage roles",
        selected: false,
      },
      {
        _id: "p21",
        name: "manage-permissions",
        description: "Create and manage permissions",
        selected: false,
      },
    ],
  },
];

// Static role data
const mockRole = {
  id: "2",
  name: "Parent",
  description: "Manage kids, tasks, rewards, and family settings",
};

export default function RolePermissionsPage() {
  const params = useParams();
  const roleId = params.id;
  const [permissions, setPermissions] = useState(mockGroupedPermissions);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (permissionId, groupId) => {
    setPermissions((prev) =>
      prev.map((group) => {
        if (group._id === groupId) {
          return {
            ...group,
            permissions: group.permissions.map((perm) =>
              perm._id === permissionId
                ? { ...perm, selected: !perm.selected }
                : perm
            ),
          };
        }
        return group;
      })
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement API call
    console.log("Saving permissions:", permissions);
    setHasChanges(false);
    // Show success message
  };

  const selectedCount = permissions.reduce(
    (total, group) =>
      total + group.permissions.filter((p) => p.selected).length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/roles"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Roles
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{mockRole.name}</h1>
              <p className="text-muted-foreground mt-1">{mockRole.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Selected Permissions</p>
            <p className="text-2xl font-bold">{selectedCount}</p>
          </div>
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {permissions.map((group) => {
          const selectedInGroup = group.permissions.filter((p) => p.selected).length;
          return (
            <Card key={group._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.groupName}</CardTitle>
                    <CardDescription className="mt-1">
                      {group.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {selectedInGroup} / {group.permissions.length} selected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Label
                            htmlFor={`perm-${permission._id}`}
                            className="font-semibold cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          {permission.selected && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                      <Switch
                        id={`perm-${permission._id}`}
                        checked={permission.selected}
                        onCheckedChange={() =>
                          togglePermission(permission._id, group._id)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
