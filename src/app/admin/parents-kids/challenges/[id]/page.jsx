"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, Users, Gift, Image, CheckCircle2, XCircle, Clock, Target, Baby } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getChallengeById } from "@/lib/api/challenges";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ParentsKidsChallengeDetailPage() {
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
        const challengeData = await getChallengeById(challengeId);
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
          <p>Loading challenge details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <Link href="/admin/parents-kids/challenges">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p>Challenge not found</p>
          <Link href="/admin/parents-kids/challenges">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rewardItems = challenge.reward?.items || [];

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      active: "default",
      completed: "default",
      cancelled: "destructive",
    };
    const classNames = {
      draft: "",
      active: "",
      completed: "bg-green-500 text-white",
      cancelled: "",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className={classNames[status] || ""}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </Badge>
    );
  };

  const getProofStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    const classNames = {
      pending: "",
      approved: "bg-green-500 text-white",
      rejected: "",
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle2,
      rejected: XCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <Badge variant={variants[status] || "secondary"} className={classNames[status] || ""}>
        <Icon className="size-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/parents-kids/challenges">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to Parents & Kids Challenges
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Baby className="size-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{challenge.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">Parents & Kids</Badge>
                {getStatusBadge(challenge.challengeStatus)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Challenge Details */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenge.description && (
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Created By (Parent)</p>
              <p className="text-sm text-muted-foreground">
                {challenge.createdBy?.fullName || challenge.createdBy?.username || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Created At</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(challenge.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements & Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements & Rewards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Requirements</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    Photo Proof: {challenge.photoProofRequired ? "Required" : "Not Required"}
                  </span>
                </div>
                {challenge.trackingEnabled && (
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      Tracking: {challenge.trackingType} - Target: {challenge.trackingTarget} {challenge.trackingUnit}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Rewards</p>
              <div className="flex items-start gap-2">
                <Gift className="size-4 text-muted-foreground mt-1" />
                <div className="text-sm space-y-2">
                  <div>{challenge.reward?.coins || 0} coins</div>
                  {rewardItems.length > 0 && (
                    <div className="space-y-1">
                      {rewardItems.map((item, index) => (
                        <div key={`reward-item-${index}`} className="flex items-center gap-1">
                          <Gift className="size-4 text-muted-foreground" />
                          <div>
                            {index + 1}. {item?.name || "Unnamed"}
                            {item?.description && (
                              <span className="text-muted-foreground"> ({item.description})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {challenge.rewardTransferred && (
              <div>
                <Badge variant="default" className="bg-green-500 text-white">Reward Transferred</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Transferred on {formatDate(challenge.rewardTransferredAt)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participating Kids */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="size-5" />
              Participating Kids ({challenge.participants?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {challenge.participants && challenge.participants.length > 0 ? (
              <div className="space-y-2">
                {challenge.participants.map((participant, index) => (
                  <div key={participant._id || index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      {participant.name || participant.fullName || participant.username || "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No kids participating</p>
            )}
          </CardContent>
        </Card>

        {/* Winner */}
        {challenge.winnerId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-5" />
                Winner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-500" />
                <span className="text-sm font-medium">
                  {challenge.winnerId?.name || challenge.winnerId?.fullName || challenge.winnerId?.username || "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proofs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Submitted Proofs ({challenge.proofs?.length || 0})</CardTitle>
            <CardDescription>
              View all proofs submitted by kids
            </CardDescription>
          </CardHeader>
          <CardContent>
            {challenge.proofs && challenge.proofs.length > 0 ? (
              <div className="space-y-4">
                {challenge.proofs.map((proof, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {proof.participantId?.name || proof.participantId?.fullName || proof.participantId?.username || "Unknown Kid"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {formatDate(proof.submittedAt)}
                        </p>
                      </div>
                      {getProofStatusBadge(proof.status)}
                    </div>
                    {proof.photos && proof.photos.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Photos ({proof.photos.length})</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {proof.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="aspect-square border rounded overflow-hidden">
                              <img
                                src={photo.startsWith('http') ? photo : `http://localhost:5000${photo}`}
                                alt={`Proof ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.png';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {proof.trackingData && proof.trackingData.value !== null && (
                      <div>
                        <p className="text-xs font-medium mb-1">Tracking Data</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="size-4 text-muted-foreground" />
                          <span>
                            {proof.trackingData.value} {proof.trackingData.unit} / {proof.trackingData.target} {proof.trackingData.unit}
                            {proof.trackingData.achieved && (
                              <Badge variant="default" className="ml-2 bg-green-500 text-white">Target Achieved</Badge>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {proof.status === 'rejected' && proof.rejectionReason && (
                      <div>
                        <p className="text-xs font-medium mb-1">Rejection Reason</p>
                        <p className="text-xs text-muted-foreground">{proof.rejectionReason}</p>
                      </div>
                    )}
                    {proof.reviewedBy && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Reviewed by: {proof.reviewedBy?.fullName || proof.reviewedBy?.username || "Unknown"}
                          {proof.reviewedAt && ` on ${formatDate(proof.reviewedAt)}`}
                        </p>
                      </div>
                    )}
                    {index < challenge.proofs.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No proofs submitted yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
