"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HabitForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    status: initialData?.status || "active",
    description: initialData?.description || "",
    locationTracking: initialData?.locationTracking || false,
    minDistance: initialData?.minDistance || 0.5,
    minDuration: initialData?.minDuration || 10,
    updateFrequency: initialData?.updateFrequency || 5,
    autoPause: initialData?.autoPause || true,
    backgroundTracking: initialData?.backgroundTracking || true,
  });

  // Generate slug from name automatically
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push("/admin/adults/habits");
    router.refresh();
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    // Auto-generate slug when name changes
    if (field === "name" && !initialData) {
      newData.slug = generateSlug(value);
    }
    setFormData(newData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            placeholder="Morning Exercise"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="morning-exercise"
            disabled={!initialData} // Auto-generated, only editable when editing
          />
          <p className="text-xs text-muted-foreground">
            {initialData ? "Edit slug manually" : "Auto-generated from habit name"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter a description for this habit..."
            rows={4}
          />
        </div>
      </div>

      {/* Location Tracking Section */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="locationTracking" className="text-base font-semibold flex items-center gap-2">
              <MapPin className="size-4" />
              Location Tracking
            </Label>
            <p className="text-sm text-muted-foreground">
              Enable real-time GPS tracking for this habit
            </p>
          </div>
          <Switch
            id="locationTracking"
            checked={formData.locationTracking}
            onCheckedChange={(checked) => handleChange("locationTracking", checked)}
            disabled={initialData?.locationTracking} // Cannot disable if already enabled
          />
        </div>

        {formData.locationTracking && (
          <>
            {initialData?.locationTracking && (
              <Alert>
                <AlertTriangle className="size-4" />
                <AlertDescription>
                  Location tracking is required for this habit and cannot be disabled.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minDistance">Minimum Distance (km) *</Label>
                  <Input
                    id="minDistance"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.minDistance}
                    onChange={(e) => handleChange("minDistance", parseFloat(e.target.value))}
                    required={formData.locationTracking}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum distance required to complete habit
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minDuration">Minimum Duration (minutes) *</Label>
                  <Input
                    id="minDuration"
                    type="number"
                    min="1"
                    value={formData.minDuration}
                    onChange={(e) => handleChange("minDuration", parseInt(e.target.value))}
                    required={formData.locationTracking}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum time required to complete habit
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="updateFrequency">Update Frequency (seconds)</Label>
                  <Input
                    id="updateFrequency"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.updateFrequency}
                    onChange={(e) => handleChange("updateFrequency", parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    How often GPS location is updated
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoPause">Auto-pause on Stop</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically pause tracking when user stops moving
                    </p>
                  </div>
                  <Switch
                    id="autoPause"
                    checked={formData.autoPause}
                    onCheckedChange={(checked) => handleChange("autoPause", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="backgroundTracking">Background Tracking</Label>
                    <p className="text-xs text-muted-foreground">
                      Continue tracking when app is in background
                    </p>
                  </div>
                  <Switch
                    id="backgroundTracking"
                    checked={formData.backgroundTracking}
                    onCheckedChange={(checked) => handleChange("backgroundTracking", checked)}
                  />
                </div>
              </div>

              {!initialData && (
                <Alert>
                  <AlertTriangle className="size-4" />
                  <AlertDescription>
                    Once enabled, location tracking becomes mandatory for this habit and cannot be disabled.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/adults/habits")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Habit" : "Create Habit"}
        </Button>
      </div>
    </form>
  );
}

