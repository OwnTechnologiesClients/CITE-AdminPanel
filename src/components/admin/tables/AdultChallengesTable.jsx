"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getAdultChallenges, deleteChallenge } from "@/lib/api/adultChallenges";

export default function AdultChallengesTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAdultChallenges();
      setChallenges(data || []);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (challengeId, challengeName) => {
    if (!confirm(`Are you sure you want to delete "${challengeName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(challengeId);
      await deleteChallenge(challengeId);
      // Refresh the list
      await fetchChallenges();
    } catch (err) {
      console.error('Error deleting challenge:', err);
      alert('Failed to delete challenge. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading challenges...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Challenges</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Link href="/admin/adults/adult-challenges/add">
              <Button>Add Challenge</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Challenge Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChallenges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No challenges found
                </TableCell>
              </TableRow>
            ) : (
              filteredChallenges.map((challenge) => (
                <TableRow key={challenge._id || challenge.id}>
                  <TableCell className="font-medium">{challenge.name}</TableCell>
                  <TableCell>{challenge.duration} days</TableCell>
                  <TableCell>{challenge.startDate ? formatDate(challenge.startDate) : '-'}</TableCell>
                  <TableCell>{challenge.participantsCount || 0}</TableCell>
                  <TableCell>
                    <Badge variant={challenge.status === 1 ? "default" : "outline"}>
                      {challenge.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/adults/adult-challenges/${challenge._id || challenge.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      <Link href={`/admin/adults/adult-challenges/${challenge._id || challenge.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(challenge._id || challenge.id, challenge.name)}
                        disabled={deletingId === (challenge._id || challenge.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

