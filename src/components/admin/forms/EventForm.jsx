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

export default function EventForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    family: initialData?.family || "",
    createdBy: initialData?.createdBy || "",
    eventDate: initialData?.eventDate || "",
    eventTime: initialData?.eventTime || "",
    location: initialData?.location || "",
    attendees: initialData?.attendees || 1,
    type: initialData?.type || "Family Event",
    status: initialData?.status || "upcoming",
    description: initialData?.description || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push("/admin/families/list");
    router.refresh();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            placeholder="Family Movie Night"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Event description..."
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
          <Label htmlFor="eventDate">Event Date *</Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={(e) => handleChange("eventDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTime">Event Time *</Label>
          <Input
            id="eventTime"
            type="time"
            value={formData.eventTime}
            onChange={(e) => handleChange("eventTime", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
            placeholder="Living Room"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendees">Attendees *</Label>
          <Input
            id="attendees"
            type="number"
            value={formData.attendees}
            onChange={(e) => handleChange("attendees", parseInt(e.target.value))}
            required
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Event Type *</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Family Event">Family Event</SelectItem>
              <SelectItem value="Celebration">Celebration</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="School Event">School Event</SelectItem>
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
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
          {loading ? "Saving..." : initialData ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}


