"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchableSelect from "../common/SearchableSelect";
import { getParents } from "@/lib/api/parents";

export default function KidForm({ initialData = null, parentId = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    age: initialData?.age || "",
    parentId: initialData?.parentId || parentId || "",
    status: initialData?.status || "active",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push("/admin/parents-kids/kids");
    router.refresh();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            placeholder="Emma Doe"
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
            placeholder="emma.doe@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange("age", parseInt(e.target.value) || "")}
            required
            min="0"
            max="18"
            placeholder="8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentId">Parent *</Label>
          <SearchableSelect
            fetchData={getParents}
            getLabel={(parent) => `${parent.name} (${parent.email})`}
            getValue={(parent) => String(parent.id)}
            getSearchValue={(parent) => `${parent.name} ${parent.email}`}
            renderItem={(parent) => (
              <div className="flex flex-col">
                <span>{parent.name}</span>
                <span className="text-xs text-muted-foreground">{parent.email}</span>
              </div>
            )}
            value={formData.parentId}
            onValueChange={(value) => handleChange("parentId", value)}
            placeholder="Select parent..."
            searchPlaceholder="Search parents..."
            disabled={!!parentId}
            preSelectedValue={parentId ? String(parentId) : null}
            emptyText="No parent found."
            loadingText="Loading parents..."
          />
          {parentId && (
            <p className="text-xs text-muted-foreground">
              Parent is pre-selected from the parent detail page
            </p>
          )}
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
          {loading ? "Saving..." : initialData ? "Update Kid" : "Create Kid"}
        </Button>
      </div>
    </form>
  );
}

