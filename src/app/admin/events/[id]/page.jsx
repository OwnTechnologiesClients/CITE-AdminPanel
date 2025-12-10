import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Calendar, MapPin, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

export default async function ViewEventPage({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  const statusConfig = {
    upcoming: { label: "Upcoming", variant: "default" },
    completed: { label: "Completed", variant: "secondary" },
    cancelled: { label: "Cancelled", variant: "outline" },
  };

  const status = statusConfig[event.status] || statusConfig.upcoming;
  const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
            <p className="text-muted-foreground mt-2">
              View and manage event information
            </p>
          </div>
        </div>
        <Link href={`/admin/events/${id}/edit`}>
          <Button>
            <Edit className="mr-2 size-4" />
            Edit Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant={status.variant}>{status.label}</Badge>
              <Badge variant="outline">{event.type}</Badge>
            </div>

            <Separator />

            {event.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {eventDateTime.toLocaleDateString()} at {eventDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Attendees</p>
                  <p className="font-medium">{event.attendees}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{event.createdBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Family</p>
                  <p className="font-medium">{event.family}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-lg font-semibold">
                    {eventDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

