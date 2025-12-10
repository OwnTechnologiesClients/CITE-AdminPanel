import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EventForm from "@/components/admin/forms/EventForm";

// Mock data - replace with actual API call
async function getEvent(id) {
  return {
    id: id,
    title: "Family Movie Night",
    family: "Doe Family",
    createdBy: "John Doe",
    eventDate: "2024-12-20",
    eventTime: "19:00",
    location: "Living Room",
    attendees: 4,
    type: "Family Event",
    status: "upcoming",
    description: "Watch a family-friendly movie together",
  };
}

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/events/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground mt-2">
            Update event information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>
            Update the details for this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm initialData={event} />
        </CardContent>
      </Card>
    </div>
  );
}

