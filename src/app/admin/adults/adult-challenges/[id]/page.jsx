"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, Users, Target, Clock, Image, CheckCircle2, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { getAdultChallengeById, getChallengeParticipants } from "@/lib/api/adultChallenges";
import { formatDate } from "@/lib/utils";

export default function AdultChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id;
  const [challenge, setChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [challengeData, participantsData] = await Promise.all([
          getAdultChallengeById(challengeId),
          getChallengeParticipants(challengeId)
        ]);
        
        setChallenge(challengeData);
        setParticipants(participantsData || []);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(err.message || "Failed to load challenge");
      } finally {
        setLoading(false);
      }
    }

    if (challengeId) {
      fetchData();
    }
  }, [challengeId]);


  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge variant="default">Active</Badge>;
    } else if (status === 'completed') {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (status === 'abandoned') {
      return <Badge variant="outline">Abandoned</Badge>;
    }
    return null;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getPositionBadge = (position) => {
    if (!position) return null;
    const colors = {
      1: 'bg-yellow-500',
      2: 'bg-gray-400',
      3: 'bg-orange-500'
    };
    return (
      <Badge className={colors[position] || ''}>
        #{position}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading challenge details...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error || "Challenge not found"}</p>
          <Link href="/admin/adults/adult-challenges">
            <Button variant="outline">Back to Challenges</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/adults/adult-challenges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{challenge.name}</h1>
          <p className="text-muted-foreground mt-2">
            View challenge details and participants
          </p>
        </div>
      </div>

      {/* Challenge Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Challenge Details */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenge.images && challenge.images.length > 0 && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Challenge Image</p>
                  <div className="w-full rounded-lg overflow-hidden border">
                    <img
                      src={challenge.images[0].startsWith('http') ? challenge.images[0] : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${challenge.images[0]}`}
                      alt={challenge.name}
                      className="w-full h-auto max-h-[250px] object-contain"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                </div>
                <Separator />
              </>
            )}
            
            {challenge.description && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
              </>
            )}

            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Duration</p>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  {challenge.duration} days
                </div>
              </div>
              {challenge.registrationDeadline && (
                <div>
                  <p className="text-sm font-medium mb-1">Registration Deadline</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    {formatDateTime(challenge.registrationDeadline)}
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium mb-1">Start Date</p>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(challenge.startDate)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">End Date</p>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  {formatDate(challenge.endDate)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <Badge variant={challenge.status === 1 ? "default" : "outline"}>
                  {challenge.status === 1 ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {challenge.conditions && (Array.isArray(challenge.conditions) ? challenge.conditions.length > 0 : challenge.conditions) && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Conditions</p>
                  {Array.isArray(challenge.conditions) ? (
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      {challenge.conditions.map((c, i) => (
                        <li key={i}>{typeof c === "object" && c !== null ? (c.text ?? "") : String(c)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{challenge.conditions}</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Requirements & Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Daily Goal</p>
              <div className="flex items-center gap-2">
                <Target className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {challenge.dailyGoal?.value} {challenge.dailyGoal?.customUnit || challenge.dailyGoal?.unit}
                </span>
              </div>
            </div>

            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Proof Requirements</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    Requires Proof: {challenge.requiresProof ? "Yes" : "No"}
                  </span>
                </div>
                {challenge.requiresProof && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      Accepted Proof: Photo and/or Tracker Session
                    </span>
                  </div>
                )}
                {challenge.requiresTracker && (
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      Activity Type: {challenge.activityType}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {challenge.maxParticipants && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Max Participants</p>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-sm">{challenge.maxParticipants}</span>
                  </div>
                </div>
              </>
            )}

            {challenge.rewards && challenge.rewards.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Trophy className="size-4 text-muted-foreground" />
                    Rewards
                  </p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((position) => {
                      const positionRewards = challenge.rewards.find(r => r.position === position);
                      if (!positionRewards || positionRewards.rewards.length === 0) return null;
                      
                      return (
                        <div key={position} className="text-sm">
                          <Badge className={position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-400' : 'bg-orange-500'} variant="default">
                            Position {position}
                          </Badge>
                          <div className="mt-1 ml-2 space-y-1">
                            {positionRewards.rewards.map((reward, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <span>{reward.name}</span>
                                <Badge variant="outline" className="text-xs">{reward.type}</Badge>
                                {reward.description && (
                                  <span className="text-muted-foreground">- {reward.description}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Participants ({participants.length})
          </CardTitle>
          <CardDescription>
            View all participants and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No participants yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">User</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Progress</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Position</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant._id || participant.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">
                            {participant.userId?.fullName || participant.userId?.email || "Unknown"}
                          </p>
                          {participant.userId?.email && (
                            <p className="text-xs text-muted-foreground">
                              {participant.userId.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(participant.joinedAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(participant.status)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {participant.daysCompleted || 0} / {challenge.duration} days
                        {participant.totalProgress > 0 && (
                          <span className="text-muted-foreground ml-2">
                            ({participant.totalProgress.toFixed(1)} {challenge.dailyGoal?.customUnit || challenge.dailyGoal?.unit})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getPositionBadge(participant.finalPosition)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/adults/adult-challenges/${challengeId}/participants/${participant.userId?._id || participant.userId?.id || participant.userId}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Progress
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}