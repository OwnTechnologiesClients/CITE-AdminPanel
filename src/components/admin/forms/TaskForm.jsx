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

export default function TaskForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    assignedTo: initialData?.assignedTo || "",
    assignedBy: initialData?.assignedBy || "",
    family: initialData?.family || "",
    type: initialData?.type || "Kid Task",
    status: initialData?.status || "pending",
    dueDate: initialData?.dueDate || "",
    coins: initialData?.coins || 50,
    description: initialData?.description || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push("/admin/tasks");
    router.refresh();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            placeholder="Complete Math Homework"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Task description..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To *</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => handleChange("assignedTo", e.target.value)}
            required
            placeholder="User Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedBy">Assigned By *</Label>
          <Input
            id="assignedBy"
            value={formData.assignedBy}
            onChange={(e) => handleChange("assignedBy", e.target.value)}
            required
            placeholder="User Name"
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
          <Label htmlFor="type">Task Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kid Task">Kid Task</SelectItem>
              <SelectItem value="Family Task">Family Task</SelectItem>
              <SelectItem value="Adult Habit">Adult Habit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coins">Coins Reward *</Label>
          <Input
            id="coins"
            type="number"
            value={formData.coins}
            onChange={(e) => handleChange("coins", parseInt(e.target.value))}
            required
            min="0"
          />
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
          {loading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}


