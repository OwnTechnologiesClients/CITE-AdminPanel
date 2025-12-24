"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Plus, Search, Edit, Trash2, FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPermissions, getPermissionGroups, getGroupedPermissions } from "@/lib/api/permissions";

// Static data for permissions (fallback)
const mockPermissions = [
  {
    id: "p1",
    name: "view-dashboard",
    description: "Access dashboard",
    group: "Dashboard",
    groupId: "1",
  },
  {
    id: "p2",
    name: "view-analytics",
    description: "View analytics and reports",
    group: "Dashboard",
    groupId: "1",
  },
  {
    id: "p3",
    name: "view-users",
    description: "View user list",
    group: "User Management",
    groupId: "2",
  },
  {
    id: "p4",
    name: "create-users",
    description: "Create new users",
    group: "User Management",
    groupId: "2",
  },
  {
    id: "p5",
    name: "update-users",
    description: "Update user information",
    group: "User Management",
    groupId: "2",
  },
  {
    id: "p6",
    name: "delete-users",
    description: "Delete users",
    group: "User Management",
    groupId: "2",
  },
  {
    id: "p7",
    name: "view-kids",
    description: "View kids list",
    group: "Kids Management",
    groupId: "3",
  },
  {
    id: "p8",
    name: "create-kids",
    description: "Create new kid profiles",
    group: "Kids Management",
    groupId: "3",
  },
  {
    id: "p9",
    name: "update-kids",
    description: "Update kid information",
    group: "Kids Management",
    groupId: "3",
  },
  {
    id: "p10",
    name: "delete-kids",
    description: "Delete kid profiles",
    group: "Kids Management",
    groupId: "3",
  },
];

// Static data for permission groups
const mockPermissionGroups = [
  {
    id: "1",
    name: "Dashboard",
    description: "Dashboard access and viewing permissions",
    permissionCount: 2,
  },
  {
    id: "2",
    name: "User Management",
    description: "User and account management permissions",
    permissionCount: 4,
  },
  {
    id: "3",
    name: "Kids Management",
    description: "Kids and children management permissions",
    permissionCount: 4,
  },
  {
    id: "4",
    name: "Tasks Management",
    description: "Task creation and management permissions",
    permissionCount: 4,
  },
  {
    id: "5",
    name: "Rewards Management",
    description: "Reward creation and management permissions",
    permissionCount: 4,
  },
  {
    id: "6",
    name: "Role Management",
    description: "Role and permission management",
    permissionCount: 3,
  },
];

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("permissions");
  const [permissions, setPermissions] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        if (activeTab === "permissions") {
          const [permsData, groupsData] = await Promise.all([
            getPermissions().catch(() => []),
            getPermissionGroups().catch(() => []),
          ]);
          setPermissions(permsData);
          setPermissionGroups(groupsData);
        } else {
          const groupsData = await getPermissionGroups().catch(() => []);
          setPermissionGroups(groupsData);
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError(err.message || "Failed to load permissions");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab]);

  const filteredPermissions = permissions.filter(
    (perm) =>
      perm.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = permissionGroups.filter(
    (group) =>
      group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage permissions and permission groups
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/permissions/groups/add">
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </Link>
          <Link href="/admin/permissions/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Permission
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="groups">Permission Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Permissions</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading permissions...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  {error}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          {searchQuery ? "No permissions found matching your search" : "No permissions found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPermissions.map((permission) => (
                        <TableRow key={permission._id || permission.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <code className="text-sm">{permission.name}</code>
                            </div>
                          </TableCell>
                          <TableCell>{permission.description || "No description"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {permission.group?.name || permission.group || "No group"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Permission Groups</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading permission groups...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGroups.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      {searchQuery ? "No permission groups found matching your search" : "No permission groups found"}
                    </div>
                  ) : (
                    filteredGroups.map((group) => (
                      <Card key={group._id || group.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <FolderOpen className="h-5 w-5 text-primary" />
                                {group.name}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {group.description || "No description"}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {group.permissions?.length || group.permissionCount || 0} permissions
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
