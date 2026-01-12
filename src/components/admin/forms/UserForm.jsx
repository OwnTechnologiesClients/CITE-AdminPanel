"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Package, CreditCard, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/lib/api/users";
import { formatDate } from "@/lib/utils";

export default function UserForm({ initialData = null, userId = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Format module name for display
  const formatModuleName = (module) => {
    const moduleMap = {
      'parents_kids': 'Parents & Kids',
      'adults': 'Adults',
      'together': 'Together'
    };
    return moduleMap[module] || module;
  };

  // Initialize form data from initialData
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || initialData?.name || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || initialData?.phone || "",
    userType: initialData?.userType || "adult",
    status: initialData?.status === 1 || initialData?.status === "active" ? 1 : initialData?.status === 0 || initialData?.status === "inactive" ? 0 : 1,
    primaryModule: initialData?.primaryModule || "",
  });

  // Initialize modules state
  const [modules, setModules] = useState(() => {
    if (initialData?.selectedModules && Array.isArray(initialData.selectedModules)) {
      return initialData.selectedModules.map(m => ({
        module: m.module || m,
        isActive: m.isActive !== false,
        selectedAt: m.selectedAt || new Date().toISOString()
      }));
    }
    return [];
  });

  // Initialize subscription state
  const [subscription, setSubscription] = useState(() => {
    if (initialData?.subscription) {
      return typeof initialData.subscription === 'object' 
        ? initialData.subscription 
        : { plan: initialData.subscription };
    }
    return { plan: "", status: "", tier: "", expiresAt: "" };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updateData = {
        ...formData,
        selectedModules: modules,
        subscription: subscription.plan ? subscription : undefined,
      };

      if (userId) {
        await updateUser(userId, updateData);
        router.push(`/admin/users/${userId}`);
        router.refresh();
      } else {
        // Handle create case if needed
        console.error("User ID is required for update");
        setError("User ID is required");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleToggle = (moduleName) => {
    setModules(prev => {
      const existing = prev.find(m => (m.module || m) === moduleName);
      if (existing) {
        return prev.map(m => 
          (m.module || m) === moduleName 
            ? { ...m, isActive: !m.isActive }
            : m
        );
      } else {
        return [...prev, {
          module: moduleName,
          isActive: true,
          selectedAt: new Date().toISOString()
        }];
      }
    });
  };

  const handleSubscriptionChange = (field, value) => {
    setSubscription(prev => ({ ...prev, [field]: value }));
  };

  // Available modules
  const availableModules = ['parents_kids', 'adults', 'together'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              placeholder="john.doe@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">User Type *</Label>
            <Select value={formData.userType} onValueChange={(value) => handleChange("userType", value)}>
              <SelectTrigger id="userType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="kid">Kid</SelectItem>
                <SelectItem value="adult">Adult</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={formData.status.toString()} 
              onValueChange={(value) => handleChange("status", parseInt(value))}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryModule">Primary Module</Label>
            <Select 
              value={formData.primaryModule || "none"} 
              onValueChange={(value) => handleChange("primaryModule", value === "none" ? null : value)}
            >
              <SelectTrigger id="primaryModule">
                <SelectValue placeholder="Select primary module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="parents_kids">Parents & Kids</SelectItem>
                <SelectItem value="adults">Adults</SelectItem>
                <SelectItem value="together">Together</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Modules Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="size-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Modules</h3>
        </div>
        <div className="space-y-3">
          {availableModules.map((moduleName) => {
            const moduleData = modules.find(m => (m.module || m) === moduleName);
            const isActive = moduleData ? (moduleData.isActive !== false) : false;
            const isPrimary = formData.primaryModule === moduleName;
            
            return (
              <div
                key={moduleName}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleModuleToggle(moduleName)}
                  />
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
                    {moduleData?.selectedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {formatDate(moduleData.selectedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={isActive ? "default" : "outline"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Subscription Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="size-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Subscription</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="subscriptionPlan">Plan</Label>
            <Input
              id="subscriptionPlan"
              value={subscription.plan || ""}
              onChange={(e) => handleSubscriptionChange("plan", e.target.value)}
              placeholder="e.g., Monthly, Yearly, Lifetime"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionStatus">Status</Label>
            <Select 
              value={subscription.status || "none"} 
              onValueChange={(value) => handleSubscriptionChange("status", value === "none" ? "" : value)}
            >
              <SelectTrigger id="subscriptionStatus">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionTier">Tier</Label>
            <Input
              id="subscriptionTier"
              value={subscription.tier || ""}
              onChange={(e) => handleSubscriptionChange("tier", e.target.value)}
              placeholder="e.g., Basic, Premium, Pro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionExpires">Expires At</Label>
            <Input
              id="subscriptionExpires"
              type="date"
              value={subscription.expiresAt ? new Date(subscription.expiresAt).toISOString().split('T')[0] : ""}
              onChange={(e) => handleSubscriptionChange("expiresAt", e.target.value ? new Date(e.target.value).toISOString() : "")}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}


