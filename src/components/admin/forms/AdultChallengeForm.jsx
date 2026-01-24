"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Trash2 } from "lucide-react";
import { apiPost, apiPut, apiPostFormData, apiPutFormData } from "@/lib/api/client";

export default function AdultChallengeForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 5,
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
    dailyGoal: {
      value: initialData?.dailyGoal?.value || 0,
      unit: initialData?.dailyGoal?.unit || "km",
      customUnit: initialData?.dailyGoal?.customUnit || null,
    },
    timeLimit: initialData?.timeLimit || null,
    requiresTracker: initialData?.requiresTracker || false,
    activityType: initialData?.activityType || null,
    conditions: initialData?.conditions || "",
    maxParticipants: initialData?.maxParticipants || null,
    status: initialData?.status || 1,
    rewards: initialData?.rewards || [
      { position: 1, rewards: [] },
      { position: 2, rewards: [] },
      { position: 3, rewards: [] },
    ],
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(initialData?.images?.[0] || null);

  // Generate slug from name automatically
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (field, value) => {
    const newData = { ...formData };
    
    if (field.includes('.')) {
      // Handle nested fields like dailyGoal.value
      const [parent, child] = field.split('.');
      newData[parent] = { ...newData[parent], [child]: value };
    } else {
      newData[field] = value;
    }
    
    // Auto-generate slug when name changes
    if (field === "name" && !initialData) {
      newData.slug = generateSlug(value);
    }
    
    // Auto-calculate end date when duration or start date changes
    if ((field === "duration" || field === "startDate") && newData.startDate && newData.duration) {
      const start = new Date(newData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + parseInt(newData.duration) - 1);
      newData.endDate = end.toISOString().split('T')[0];
    }

    // Auto-set activity type when tracker is enabled
    if (field === "requiresTracker" && value && !newData.activityType) {
      newData.activityType = "running";
    }

    setFormData(newData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setExistingImage(null); // Clear existing image when new one is selected
    }
  };

  const removeImageFile = () => {
    setImageFile(null);
  };

  const removeExistingImage = () => {
    setExistingImage(null);
  };

  const addReward = (position) => {
    const newData = { ...formData };
    const positionRewards = newData.rewards.find(r => r.position === position);
    if (positionRewards) {
      positionRewards.rewards.push({
        type: "badge",
        name: "",
        description: "",
        image: null,
        customValue: null,
      });
    }
    setFormData(newData);
  };

  const removeReward = (position, rewardIndex) => {
    const newData = { ...formData };
    const positionRewards = newData.rewards.find(r => r.position === position);
    if (positionRewards) {
      positionRewards.rewards.splice(rewardIndex, 1);
    }
    setFormData(newData);
  };

  const updateReward = (position, rewardIndex, field, value) => {
    const newData = { ...formData };
    const positionRewards = newData.rewards.find(r => r.position === position);
    if (positionRewards && positionRewards.rewards[rewardIndex]) {
      positionRewards.rewards[rewardIndex][field] = value;
    }
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('dailyGoal', JSON.stringify(formData.dailyGoal));
      if (formData.timeLimit) {
        formDataToSend.append('timeLimit', formData.timeLimit);
      }
      // Proof is always required; users can submit either a photo or a tracker session
      formDataToSend.append('requiresProof', true);
      formDataToSend.append('requiresTracker', formData.requiresTracker);
      if (formData.activityType) {
        formDataToSend.append('activityType', formData.activityType);
      }
      formDataToSend.append('conditions', formData.conditions || '');
      if (formData.maxParticipants) {
        formDataToSend.append('maxParticipants', formData.maxParticipants);
      }
      formDataToSend.append('status', formData.status);
      formDataToSend.append('rewards', JSON.stringify(formData.rewards));
      
      // Handle images - only one image allowed
      // If a new image file is uploaded, use that; otherwise keep existing image
      if (imageFile) {
        // New image uploaded - send the file
        formDataToSend.append('images', imageFile);
      } else if (existingImage) {
        // Keep existing image - send as JSON array with one item
        formDataToSend.append('images', JSON.stringify([existingImage]));
      } else {
        // No image - send empty array
        formDataToSend.append('images', JSON.stringify([]));
      }

      const endpoint = initialData 
        ? `/adult-challenges/${initialData._id || initialData.id}`
        : '/adult-challenges';
      
      const method = initialData ? apiPutFormData : apiPostFormData;
      
      await method(endpoint, formDataToSend);

      router.push("/admin/adults/adult-challenges");
      router.refresh();
    } catch (err) {
      console.error('Error saving challenge:', err);
      setError(err.message || 'Failed to save challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Challenge Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              placeholder="7km Daily Run Challenge"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              required
              placeholder="7km-daily-run-challenge"
              disabled={!initialData}
            />
            <p className="text-xs text-muted-foreground">
              {initialData ? "Edit slug manually" : "Auto-generated from challenge name"}
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter challenge description..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Challenge Duration & Time */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Challenge Duration & Time</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => handleChange("duration", parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
            <Input
              id="timeLimit"
              type="number"
              min="1"
              value={formData.timeLimit || ""}
              onChange={(e) => handleChange("timeLimit", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Enter time limit if this challenge should be time-gated
            </p>
          </div>
        </div>
      </div>

      {/* Daily Goal - Target to achieve each day */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Daily Target</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The target value participants must achieve each day (e.g., "7 km" means run 7 km each day, "10000 steps" means take 10000 steps each day)
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="goalValue">Target Value *</Label>
            <Input
              id="goalValue"
              type="number"
              min="0"
              step="0.1"
              value={formData.dailyGoal.value}
              onChange={(e) => handleChange("dailyGoal.value", parseFloat(e.target.value) || 0)}
              required
              placeholder="e.g., 7"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalUnit">Unit *</Label>
            <Select 
              value={formData.dailyGoal.unit} 
              onValueChange={(value) => handleChange("dailyGoal.unit", value)}
            >
              <SelectTrigger id="goalUnit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilometers</SelectItem>
                <SelectItem value="m">Meters</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {formData.dailyGoal.unit === "custom" ? (
              <>
                <Label htmlFor="customUnit">Custom Unit *</Label>
                <Input
                  id="customUnit"
                  value={formData.dailyGoal.customUnit || ""}
                  onChange={(e) => handleChange("dailyGoal.customUnit", e.target.value)}
                  placeholder="e.g., laps"
                  required={formData.dailyGoal.unit === "custom"}
                />
              </>
            ) : (
              <div className="h-10 flex items-end">
                <span className="text-sm text-muted-foreground">
                  {formData.dailyGoal.unit === "km" && "Kilometers"}
                  {formData.dailyGoal.unit === "m" && "Meters"}
                  {formData.dailyGoal.unit === "steps" && "Steps"}
                  {formData.dailyGoal.unit === "minutes" && "Minutes"}
                  {formData.dailyGoal.unit === "hours" && "Hours"}
                  {formData.dailyGoal.unit === "count" && "Count"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof & Tracker Settings */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Proof & Tracking</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Photo proof is always required (participants can take a photo or upload one). Optionally enable GPS tracking for activities like running.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 mt-1">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium">Photo Proof Required</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Participants must submit a photo as proof of completion. They can either take a photo or upload an existing image.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresTracker"
                checked={formData.requiresTracker}
                onCheckedChange={(checked) => handleChange("requiresTracker", checked)}
              />
              <div className="flex-1">
                <Label htmlFor="requiresTracker" className="cursor-pointer">Requires GPS Tracker</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enable if participants should use GPS tracking for activities like running, cycling, etc.
                </p>
              </div>
            </div>

            {formData.requiresTracker && (
              <div className="ml-7 space-y-2">
                <Label htmlFor="activityType">Activity Type *</Label>
                <Select 
                  value={formData.activityType || "running"} 
                  onValueChange={(value) => handleChange("activityType", value)}
                >
                  <SelectTrigger id="activityType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="steps">Steps</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The type of activity that will be tracked (for GPS-based challenges)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Additional Settings</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="conditions">Conditions/Rules</Label>
            <Textarea
              id="conditions"
              value={formData.conditions}
              onChange={(e) => handleChange("conditions", e.target.value)}
              placeholder="Enter challenge conditions and rules..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Max Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants || ""}
              onChange={(e) => handleChange("maxParticipants", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Leave empty for unlimited"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of participants. Leave empty for unlimited.
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Challenge Image</h3>
        <div className="space-y-3">
          {existingImage && (
            <div className="relative group max-w-md">
              <img
                src={existingImage.startsWith('http') ? existingImage : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${existingImage}`}
                alt="Challenge"
                className="w-full h-auto max-h-[250px] object-contain rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                onClick={removeExistingImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {imageFile && (
            <div className="relative group max-w-md">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="New challenge image"
                className="w-full h-auto max-h-[250px] object-contain rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                onClick={removeImageFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-xs text-muted-foreground">
              Upload a single image for this challenge
            </p>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Rewards</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure rewards for top 3 positions. Each position can have multiple rewards (badges, titles, certificates, etc.)
          </p>
        </div>
        
        {[1, 2, 3].map((position) => (
          <div key={position} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Position {position} Rewards</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addReward(position)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reward
              </Button>
            </div>

            {formData.rewards
              .find(r => r.position === position)?.rewards.length === 0 ? (
              <p className="text-sm text-muted-foreground">No rewards configured</p>
            ) : (
              <div className="space-y-3">
                {formData.rewards
                  .find(r => r.position === position)?.rewards.map((reward, rewardIndex) => (
                    <div key={rewardIndex} className="border rounded p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Reward {rewardIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeReward(position, rewardIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Reward Type *</Label>
                          <Select
                            value={reward.type}
                            onValueChange={(value) => updateReward(position, rewardIndex, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="badge">Badge</SelectItem>
                              <SelectItem value="title">Title</SelectItem>
                              <SelectItem value="certificate">Certificate</SelectItem>
                              <SelectItem value="special_access">Special Access</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Reward Name *</Label>
                          <Input
                            value={reward.name}
                            onChange={(e) => updateReward(position, rewardIndex, 'name', e.target.value)}
                            placeholder="e.g., Gold Champion Badge"
                            required
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={reward.description || ""}
                            onChange={(e) => updateReward(position, rewardIndex, 'description', e.target.value)}
                            placeholder="Reward description..."
                            rows={2}
                          />
                        </div>

                        {reward.type === "custom" && (
                          <div className="space-y-2 md:col-span-2">
                            <Label>Custom Value</Label>
                            <Input
                              value={reward.customValue || ""}
                              onChange={(e) => updateReward(position, rewardIndex, 'customValue', e.target.value)}
                              placeholder="Enter custom reward value..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Status</h3>
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
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/adults/adult-challenges")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Challenge" : "Create Challenge"}
        </Button>
      </div>
    </form>
  );
}