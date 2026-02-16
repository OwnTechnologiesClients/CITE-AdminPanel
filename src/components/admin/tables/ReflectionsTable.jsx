"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { getReflections } from "@/lib/api/reflections";

export default function ReflectionsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReflections() {
      try {
        setLoading(true);
        setError(null);
        const reflectionsData = await getReflections();
        setReflections(reflectionsData);
      } catch (err) {
        console.error("Error fetching reflections:", err);
        setError(err.message || "Failed to load reflections");
      } finally {
        setLoading(false);
      }
    }

    fetchReflections();
  }, []);

  const filteredReflections = reflections.filter(
    (reflection) => {
      const userName = reflection.userId?.fullName || reflection.userId?.email || "Unknown";
      return (
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reflection.mood && reflection.mood.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  );

  const getMoodVariant = (mood) => {
    if (!mood) return "outline";
    const moodLower = mood.toLowerCase();
    if (moodLower === "great" || moodLower === "good" || moodLower === "positive") {
      return "default";
    }
    if (moodLower === "bad" || moodLower === "terrible" || moodLower === "negative") {
      return "destructive";
    }
    return "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Reflections</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reflections...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>

                  <TableHead>Mood</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReflections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No reflections found matching your search" : "No reflections found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReflections.map((reflection) => {
                    const userName = reflection.userId?.fullName || reflection.userId?.email || "Unknown";

                    return (
                      <TableRow key={reflection._id || reflection.id}>
                        <TableCell className="font-medium">{userName}</TableCell>

                        <TableCell>
                          <Badge variant={getMoodVariant(reflection.mood)}>
                            {reflection.mood || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{reflection.notes || "—"}</TableCell>
                        <TableCell>{formatDate(reflection.date || reflection.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/adults/reflections/${reflection._id || reflection.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredReflections.length} of {reflections.length} reflections
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}


