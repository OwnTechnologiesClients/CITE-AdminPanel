"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Calendar, Phone, Loader2, Package, Star, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { getUserById } from "@/lib/api/users";
import { formatDate } from "@/lib/utils";
import { getDisplayEmail, getDisplayPhone, getDisplaySubtitle } from "@/lib/userDisplayUtils";
import { getPlanById } from "@/lib/data/subscriptionPlans";
import { useRouter } from "next/navigation";

export default function ViewUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleModuleClick = (moduleItem) => {
    const moduleName = moduleItem.module || moduleItem;
    router.push(`/admin/users/${userId}/modules/${moduleName}`);
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground mt-2">Loading user information...</p>
          </div>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Not Found</h1>
            <p className="text-muted-foreground mt-2">
              {error || `The user with ID ${userId} could not be found.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const userName = user.fullName || user.username || "Unknown";
  const userEmail = getDisplayEmail(user);
  const userPhone = getDisplayPhone(user);
  const userSubtitle = getDisplaySubtitle(user);
  const userRoles = user.roles || [];
  const primaryRole = userRoles[0]?.name || user.userType || "N/A";
  
  // Get active modules
  const activeModules = (user.selectedModules || []).filter(m => m.isActive !== false);
  const primaryModule = user.primaryModule;
  
  // Format module name for display
  const formatModuleName = (module) => {
    const moduleMap = {
      'parents_kids': 'Parents & Kids',
      'adults': 'Adults',
      'together': 'Together'
    };
    return moduleMap[module] || module;
  };
  
  // Get subscription info (if available)
  const subscription = user.subscription || user.subscriptionPlan || null;

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{userName}</h2>
                <p className="text-muted-foreground">{userSubtitle}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Role</Label>
                <div className="mt-1">
                  <Badge variant="default">{primaryRole}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">User Type</Label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {user.userType || "N/A"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={user.status === 1 || user.status === "active" ? "default" : "outline"}>
                    {user.status === 1 ? "active" : user.status === 0 ? "inactive" : user.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="mt-1 font-medium flex items-center gap-2 break-all">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  {userEmail}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="mt-1 font-medium flex items-center gap-2 break-all">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  {userPhone}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Joined Date</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(user.createdAt || user.created || user.joinedDate)}
                </p>
              </div>
              {user.updatedAt && (
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="mt-1 font-medium flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    {formatDate(user.updatedAt || user.updated)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modules & Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="size-4 text-muted-foreground" />
                <Label className="text-sm font-semibold">User Modules</Label>
              </div>
              {activeModules.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No active modules</p>
              ) : (
                <div className="space-y-2">
                  {activeModules.map((moduleItem, index) => {
                    const moduleName = moduleItem.module || moduleItem;
                    const isPrimary = primaryModule === moduleName;
                    const planId = moduleItem.plan || moduleItem.subscription?.plan;
                    const plan = planId ? getPlanById(moduleName, planId) : null;
                    const planStatus = moduleItem.subscription?.status || moduleItem.status || "active";
                    const expiresAt = moduleItem.subscription?.expiresAt || moduleItem.expiresAt;

                    return (
                      <div
                        key={index}
                        onClick={() => handleModuleClick(moduleItem)}
                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Package className="size-5 text-primary" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{formatModuleName(moduleName)}</span>
                                {isPrimary && (
                                  <Badge variant="default" className="text-xs">
                                    <Star className="size-3 mr-1" />
                                    Primary
                                  </Badge>
                                )}
                              </div>
                              {plan && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-muted-foreground">{plan.name}</span>
                                  {expiresAt && (
                                    <>
                                      <span className="text-muted-foreground">•</span>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        Expires {formatDate(expiresAt)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {plan && (
                            <Badge variant={planStatus === "active" ? "default" : "outline"}>
                              {planStatus}
                            </Badge>
                          )}
                          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {primaryModule && !activeModules.some(m => {
                const moduleName = m.module || m;
                return primaryModule === moduleName;
              }) && (
                <p className="text-xs text-muted-foreground mt-2">
                  Primary module: {formatModuleName(primaryModule)} (not in active modules)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

