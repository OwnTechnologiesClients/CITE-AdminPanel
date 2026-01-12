"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Package, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Loader2 
} from "lucide-react";
import { getPlansForModule, getDefaultPlan } from "@/lib/data/subscriptionPlans";
import { formatDate } from "@/lib/utils";
import { getUserById, updateUser } from "@/lib/api/users";

export default function ModulePlanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;
  const moduleName = params.moduleName;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planStatus, setPlanStatus] = useState("active");
  const [expirationDate, setExpirationDate] = useState("");
  const [hasAccess, setHasAccess] = useState(true);

  const formatModuleName = (module) => {
    const moduleMap = {
      'parents_kids': 'Parents & Kids',
      'adults': 'Adults',
      'together': 'Together'
    };
    return moduleMap[module] || module;
  };

  const availablePlans = getPlansForModule(moduleName);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(userId);
        setUser(userData);
        
        // Find the module data
        const userModuleData = (userData.selectedModules || []).find(
          m => (m.module || m) === moduleName
        );

        if (userModuleData) {
          const currentPlan = userModuleData.plan || userModuleData.subscription?.plan;
          setSelectedPlanId(currentPlan || getDefaultPlan(moduleName)?.id || "");
          setPlanStatus(userModuleData.subscription?.status || userModuleData.status || "active");
          
          if (userModuleData.subscription?.expiresAt) {
            const date = new Date(userModuleData.subscription.expiresAt);
            setExpirationDate(date.toISOString().split('T')[0]);
          } else if (userModuleData.expiresAt) {
            const date = new Date(userModuleData.expiresAt);
            setExpirationDate(date.toISOString().split('T')[0]);
          } else {
            // Set default expiration to 30 days from now
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            setExpirationDate(defaultDate.toISOString().split('T')[0]);
          }
          
          setHasAccess(userModuleData.isActive !== false);
        } else {
          // New module assignment - set defaults
          const defaultPlan = getDefaultPlan(moduleName);
          setSelectedPlanId(defaultPlan?.id || "");
          setPlanStatus("active");
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 30);
          setExpirationDate(defaultDate.toISOString().split('T')[0]);
          setHasAccess(true);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    if (userId && moduleName) {
      fetchUserData();
    }
  }, [userId, moduleName]);

  const selectedPlan = availablePlans.find(plan => plan.id === selectedPlanId);

  const handleSave = async () => {
    if (!selectedPlanId) {
      setError("Please select a plan");
      return;
    }

    if (!expirationDate) {
      setError("Please set an expiration date");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Find existing module or create new one
      const existingModules = user?.selectedModules || [];
      const moduleIndex = existingModules.findIndex(
        m => (m.module || m) === moduleName
      );

      let updatedModules;
      if (moduleIndex >= 0) {
        // Update existing module
        updatedModules = [...existingModules];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          module: moduleName,
          isActive: hasAccess,
          plan: selectedPlanId,
          subscription: {
            plan: selectedPlanId,
            status: planStatus,
            expiresAt: new Date(expirationDate).toISOString(),
            tier: selectedPlan?.name || "standard"
          }
        };
      } else {
        // Add new module
        updatedModules = [
          ...existingModules,
          {
            module: moduleName,
            isActive: hasAccess,
            plan: selectedPlanId,
            subscription: {
              plan: selectedPlanId,
              status: planStatus,
              expiresAt: new Date(expirationDate).toISOString(),
              tier: selectedPlan?.name || "standard"
            }
          }
        ];
      }

      await updateUser(userId, {
        selectedModules: updatedModules
      });

      // Navigate back to user details
      router.push(`/admin/users/${userId}`);
    } catch (err) {
      console.error("Error updating module plan:", err);
      setError(err.message || "Failed to update module plan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/users/${userId}`)}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Module Plan Details</h1>
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading module plan data...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/users/${userId}`)}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/users/${userId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {formatModuleName(moduleName)} - Subscription Plan
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage subscription plan details for this module
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Available Plans */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availablePlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlanId === plan.id
                      ? "border-primary ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlan ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="planStatus">Status</Label>
                    <Select
                      value={planStatus}
                      onValueChange={setPlanStatus}
                    >
                      <SelectTrigger id="planStatus">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasAccess">Module Access</Label>
                      <Badge variant={hasAccess ? "default" : "outline"}>
                        {hasAccess ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={hasAccess ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHasAccess(true)}
                        className="flex-1"
                      >
                        <CheckCircle2 className="size-4 mr-2" />
                        Enable
                      </Button>
                      <Button
                        type="button"
                        variant={!hasAccess ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHasAccess(false)}
                        className="flex-1"
                      >
                        <XCircle className="size-4 mr-2" />
                        Disable
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Current Plan Summary */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <Label className="text-sm font-semibold">Selected Plan Summary</Label>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        ${selectedPlan.price}/{selectedPlan.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={planStatus === "active" ? "default" : "outline"}>
                        {planStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(expirationDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access:</span>
                      <Badge variant={hasAccess ? "default" : "outline"}>
                        {hasAccess ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please select a plan to configure
              </p>
            )}

            {error && (
              <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/users/${userId}`)}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving || !selectedPlanId}
                className="flex-1"
              >
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

