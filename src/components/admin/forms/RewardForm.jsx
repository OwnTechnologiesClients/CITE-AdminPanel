"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RewardForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    family: initialData?.family || "",
    createdBy: initialData?.createdBy || "",
    cost: initialData?.cost || 100,
    available: initialData?.available !== undefined ? initialData.available : true,
    description: initialData?.description || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push("/admin/rewards");
    router.refresh();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Reward Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            placeholder="Extra Screen Time"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Reward description..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="family">Family *</Label>
          <Input
            id="family"
            value={formData.family}
            onChange={(e) => handleChange("family", e.target.value)}
            required
            placeholder="Family Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdBy">Created By *</Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => handleChange("createdBy", e.target.value)}
            required
            placeholder="User Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Cost (Coins) *</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => handleChange("cost", parseInt(e.target.value))}
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="available">Status *</Label>
          <Select 
            value={formData.available ? "available" : "unavailable"} 
            onValueChange={(value) => handleChange("available", value === "available")}
          >
            <SelectTrigger id="available">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          {loading ? "Saving..." : initialData ? "Update Reward" : "Create Reward"}
        </Button>
      </div>
    </form>
  );
}


