"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdultChallengeForm from "@/components/admin/forms/AdultChallengeForm";
import { getAdultChallengeById } from "@/lib/api/adultChallenges";

export default function EditAdultChallengePage() {
  const params = useParams();
  const challengeId = params.id;
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setLoading(true);
        setError(null);
        const challengeData = await getAdultChallengeById(challengeId);
        setChallenge(challengeData);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(err.message || "Failed to load challenge");
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-destructive">
          <p>{error}</p>
          <Link href="/admin/adults/adult-challenges">
            <Button className="mt-4">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/adult-challenges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Challenge</h1>
          <p className="text-muted-foreground mt-2">
            Update challenge details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Information</CardTitle>
          <CardDescription>
            Update the details for this challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdultChallengeForm initialData={challenge} />
        </CardContent>
      </Card>
    </div>
  );
}
