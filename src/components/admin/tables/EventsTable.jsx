"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Calendar, MapPin, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

// Mock data - replace with actual API call
const mockEvents = [
  {
    id: 1,
    title: "Family Movie Night",
    family: "Doe Family",
    createdBy: "John Doe",
    eventDate: "2024-12-20",
    eventTime: "19:00",
    location: "Living Room",
    attendees: 4,
    type: "Family Event",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Birthday Party",
    family: "Smith Family",
    createdBy: "Jane Smith",
    eventDate: "2024-12-22",
    eventTime: "14:00",
    location: "Backyard",
    attendees: 8,
    type: "Celebration",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Weekly Family Meeting",
    family: "Johnson Family",
    createdBy: "Emma Johnson",
    eventDate: "2024-12-15",
    eventTime: "18:00",
    location: "Dining Room",
    attendees: 5,
    type: "Meeting",
    status: "completed",
  },
  {
    id: 4,
    title: "Grocery Shopping",
    family: "Brown Family",
    createdBy: "Michael Brown",
    eventDate: "2024-12-18",
    eventTime: "10:00",
    location: "Supermarket",
    attendees: 2,
    type: "Shopping",
    status: "upcoming",
  },
  {
    id: 5,
    title: "School Play",
    family: "Wilson Family",
    createdBy: "Sarah Wilson",
    eventDate: "2024-12-10",
    eventTime: "15:30",
    location: "School Auditorium",
    attendees: 3,
    type: "School Event",
    status: "completed",
  },
];

const statusConfig = {
  upcoming: { label: "Upcoming", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

export default function EventsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events] = useState(mockEvents);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Events</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Title</TableHead>
              <TableHead>Family</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => {
                const status = statusConfig[event.status] || statusConfig.upcoming;
                const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
                
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.family}</TableCell>
                    <TableCell>{event.createdBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div>{formatDate(event.eventDate)}</div>
                          <div className="text-muted-foreground">
                            {event.eventTime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <span>{event.attendees}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 size-4" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </CardContent>
    </Card>
  );
}

