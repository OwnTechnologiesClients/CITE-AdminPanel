"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Target, CheckCircle2, XCircle, Clock, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { getParticipantProgress } from "@/lib/api/adultChallenges";
import { formatDate } from "@/lib/utils";

export default function ParticipantProgressPage() {
  const params = useParams();
  const router = useRouter();
  const { id: challengeId, userId } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const progressData = await getParticipantProgress(challengeId, userId);
        setData(progressData);
      } catch (err) {
        console.error("Error fetching participant progress:", err);
        setError(err.message || "Failed to load participant progress");
      } finally {
        setLoading(false);
      }
    }

    if (challengeId && userId) {
      fetchData();
    }
  }, [challengeId, userId]);

  const getSessionStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'missed':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Missed</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
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
        Position #{position}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mx-auto mb-4" />
          <p>Loading participant progress...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error || "Participant progress not found"}</p>
          <Link href={`/admin/adults/adult-challenges/${challengeId}`}>
            <Button variant="outline">Back to Challenge</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { user, challenge, participation, sessions } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/adults/adult-challenges/${challengeId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.fullName || user?.email || "Participant"} Progress
          </h1>
          <p className="text-muted-foreground mt-2">
            View detailed progress for {challenge?.name || "challenge"}
          </p>
        </div>
      </div>

      {/* User & Challenge Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Participant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Name</p>
              <p className="text-sm text-muted-foreground">
                {user?.fullName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p className="text-sm text-muted-foreground">
                {user?.email || "N/A"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Joined At</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                {formatDate(participation?.joinedAt)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <Badge variant={participation?.status === 'active' ? 'default' : 'outline'}>
                {participation?.status || 'N/A'}
              </Badge>
            </div>
            {participation?.finalPosition && (
              <div>
                <p className="text-sm font-medium mb-1">Final Position</p>
                {getPositionBadge(participation.finalPosition)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Challenge Name</p>
              <p className="text-sm font-medium">{challenge?.name || "N/A"}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {challenge?.duration || 0} days
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Daily Goal</p>
                <div className="flex items-center gap-1 text-sm">
                  <Target className="size-4 text-muted-foreground" />
                  {challenge?.dailyGoal?.value || 0} {challenge?.dailyGoal?.customUnit || challenge?.dailyGoal?.unit || ''}
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Start Date</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                {formatDate(challenge?.startDate)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">End Date</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                {formatDate(challenge?.endDate)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Days Completed</p>
                <p className="text-2xl font-bold">
                  {participation?.daysCompleted || 0} / {challenge?.duration || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Total Progress</p>
                <p className="text-2xl font-bold">
                  {participation?.totalProgress?.toFixed(1) || 0} {challenge?.dailyGoal?.customUnit || challenge?.dailyGoal?.unit || ''}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Progress Percentage</p>
                <p className="text-2xl font-bold">
                  {participation?.progressPercentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completion Progress</span>
                <span className="text-sm text-muted-foreground">
                  {participation?.daysCompleted || 0} / {challenge?.duration || 0} days
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${participation?.progressPercentage || 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sessions</CardTitle>
          <CardDescription>
            Track progress for each day of the challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sessions || sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sessions available
            </p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session._id || session.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <span className="font-bold text-primary">
                          Day {session.dayNumber}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {formatDate(session.targetDate)}
                        </p>
                        {session.status === 'completed' && session.completedAt && (
                          <p className="text-xs text-muted-foreground">
                            Completed: {formatDate(session.completedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    {getSessionStatusBadge(session.status)}
                  </div>

                  <Separator />

                  {session.status === 'completed' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium mb-1 text-muted-foreground">Progress Value</p>
                        <div className="flex items-center gap-2">
                          <Target className="size-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {session.progressValue?.toFixed(2) || 0} {challenge?.dailyGoal?.customUnit || challenge?.dailyGoal?.unit || ''}
                          </span>
                          {session.goalMet && (
                            <Badge className="bg-green-500 text-xs">Goal Met</Badge>
                          )}
                        </div>
                      </div>

                      {session.submittedAt && (
                        <div>
                          <p className="text-xs font-medium mb-1 text-muted-foreground">Submitted At</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="size-4 text-muted-foreground" />
                            {formatDate(session.submittedAt)}
                          </div>
                        </div>
                      )}

                      {session.proofImage && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-medium mb-2 text-muted-foreground">Proof Image</p>
                          <div 
                            className="aspect-video rounded overflow-hidden border max-w-md cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => {
                              const imageUrl = session.proofImage.startsWith('http') 
                                ? session.proofImage 
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${session.proofImage}`;
                              setSelectedImage(imageUrl);
                            }}
                          >
                            <img
                              src={session.proofImage.startsWith('http') ? session.proofImage : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${session.proofImage}`}
                              alt={`Day ${session.dayNumber} proof`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.png';
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {session.trackerSessionId && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-medium mb-1 text-muted-foreground">
                            Tracker Session
                          </p>
                          <Link
                            href={`/admin/tracker/${
                              typeof session.trackerSessionId === 'string'
                                ? session.trackerSessionId
                                : session.trackerSessionId?.sessionId || session.trackerSessionId?._id
                            }`}
                          >
                            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                              Linked to tracker session
                            </Badge>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {session.status === 'missed' && (
                    <p className="text-sm text-muted-foreground">
                      This session was missed or not completed
                    </p>
                  )}

                  {session.status === 'pending' && (
                    <p className="text-sm text-muted-foreground">
                      This session is pending
                    </p>
                  )}

                  {session.status === 'in_progress' && (
                    <p className="text-sm text-muted-foreground">
                      This session is currently in progress
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Screen Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <DialogTitle className="sr-only">Proof Image - Full Size View</DialogTitle>
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Full size proof"
                className="max-w-full max-h-[95vh] object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-image.png';
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}