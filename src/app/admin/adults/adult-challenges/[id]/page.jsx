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
import { getAdultChallengeById, getChallengeParticipants, disqualifyParticipant, removeDisqualification, finalizeWinnersAndTransferRewards } from "@/lib/api/adultChallenges";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";


export default function AdultChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id;
  const [challenge, setChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [disqualifyDialog, setDisqualifyDialog] = useState({ open: false, participant: null });
  const [disqualifyReason, setDisqualifyReason] = useState("");
  const [disqualifying, setDisqualifying] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState({
    position1UserId: "",
    position2UserId: "none",
    position3UserId: "none"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [challengeData, participantsData] = await Promise.all([
        getAdultChallengeById(challengeId),
        getChallengeParticipants(challengeId)
      ]);

      setChallenge(challengeData);
      setParticipants(participantsData || []);
      setImageError(false);
    } catch (err) {
      console.error("Error fetching challenge:", err);
      setError(err.message || "Failed to load challenge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (challengeId) {
      fetchData();
    }
  }, [challengeId]);

  const handleFinalizeWinners = async () => {
    if (!selectedWinners.position1UserId) {
      toast.error("1st Position Required", {
        description: "Please select at least the 1st position winner."
      });
      return;
    }

    try {
      setFinalizing(true);
      // Filter out "none" values before sending to API
      const winnersToSend = {
        position1UserId: selectedWinners.position1UserId,
        position2UserId: selectedWinners.position2UserId === "none" ? "" : selectedWinners.position2UserId,
        position3UserId: selectedWinners.position3UserId === "none" ? "" : selectedWinners.position3UserId
      };
      await finalizeWinnersAndTransferRewards(challengeId, winnersToSend);
      toast.success("Winners Finalized", {
        description: "Winners have been finalized and rewards transferred successfully."
      });
      setShowFinalizeDialog(false);
      setSelectedWinners({ position1UserId: "", position2UserId: "none", position3UserId: "none" });
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error finalizing winners:", error);
      toast.error("Error Finalizing Winners", {
        description: error.message || "Failed to finalize winners. Please try again."
      });
    } finally {
      setFinalizing(false);
    }
  };

  const handleDisqualify = async () => {
    if (!disqualifyReason.trim()) {
      toast.error("Reason Required", {
        description: "Please provide a reason for disqualification."
      });
      return;
    }

    try {
      setDisqualifying(true);
      await disqualifyParticipant(challengeId, disqualifyDialog.participant.userId?._id || disqualifyDialog.participant.userId, disqualifyReason);
      toast.success("Participant Disqualified", {
        description: `${disqualifyDialog.participant.userId?.fullName || "Participant"} has been disqualified.`
      });
      setDisqualifyDialog({ open: false, participant: null });
      setDisqualifyReason("");
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error disqualifying participant:", error);
      toast.error("Error Disqualifying Participant", {
        description: error.message || "Failed to disqualify participant. Please try again."
      });
    } finally {
      setDisqualifying(false);
    }
  };

  const handleRemoveDisqualification = async (participant) => {
    try {
      await removeDisqualification(challengeId, participant.userId?._id || participant.userId);
      toast.success("Disqualification Removed", {
        description: `${participant.userId?.fullName || "Participant"} is now eligible again.`
      });
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error removing disqualification:", error);
      toast.error("Error Removing Disqualification", {
        description: error.message || "Failed to remove disqualification. Please try again."
      });
    }
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'abandoned':
        return <Badge variant="secondary" className="text-orange-600 bg-orange-100 hover:bg-orange-200 border-orange-200">Abandoned</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status || 'Unknown'}</Badge>;
    }
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{challenge.name}</h1>
            {(challenge.winnersFinalized || new Date(challenge.endDate) < new Date()) ? (
              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
            ) : challenge.status === 1 ? (
              <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>
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
                  <div className="w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center min-h-[120px]">
                    {imageError ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                        <Image className="size-10" />
                        <span className="text-sm">Image unavailable</span>
                      </div>
                    ) : (
                      <img
                        src={challenge.images[0].startsWith('http') ? challenge.images[0] : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${challenge.images[0]}`}
                        alt={challenge.name}
                        className="w-full h-auto max-h-[250px] object-contain"
                        onError={() => setImageError(true)}
                      />
                    )}
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Participants ({participants.length})
              </CardTitle>
              <CardDescription>
                View all participants and their progress
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowFinalizeDialog(true)}
              disabled={participants.some(p => p.rewardTransferred) || participants.length === 0}
            >
              <Trophy className="h-4 w-4 mr-2" />
              {participants.some(p => p.rewardTransferred) ? "Winners Finalized" : "Finalize Winners"}
            </Button>
          </div>
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
                    <th className="text-left py-3 px-4 font-medium text-sm">Reward</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant._id || participant.id} className={`border-b hover:bg-muted/50 ${participant.disqualified ? 'bg-red-50/50' : ''}`}>
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
                          {participant.disqualified && (
                            <Badge variant="destructive" className="mt-1 text-xs">
                              Disqualified
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(participant.joinedAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(
                          (participant.status === 'active' && challenge.winnersFinalized)
                            ? 'completed'
                            : participant.status
                        )}
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
                      <td className="py-3 px-4">
                        {participant.rewardTransferred ? (
                          <Badge variant="default" className="bg-green-500">
                            Transferred
                          </Badge>
                        ) : participant.finalPosition ? (
                          <Badge variant="outline">
                            Pending
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/adults/adult-challenges/${challengeId}/participants/${participant.userId?._id || participant.userId?.id || participant.userId}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          {participant.status === 'completed' && !participant.rewardTransferred && (
                            participant.disqualified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveDisqualification(participant)}
                              >
                                Reinstate
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDisqualifyDialog({ open: true, participant })}
                              >
                                Disqualify
                              </Button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Finalize Winners Dialog */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Winners and Transfer Rewards</DialogTitle>
            <DialogDescription>
              Manually select the winners for each position. Rewards will be automatically transferred to selected winners.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 1st Position */}
            <div className="space-y-2">
              <Label htmlFor="position1" className="flex items-center gap-2">
                <Badge className="bg-yellow-500">1st</Badge>
                First Position Winner *
              </Label>
              <Select
                value={selectedWinners.position1UserId}
                onValueChange={(value) => setSelectedWinners(prev => ({ ...prev, position1UserId: value }))}
              >
                <SelectTrigger id="position1">
                  <SelectValue placeholder="Select 1st place winner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {participants
                    .filter(p => p.status !== 'failed' && p.status !== 'abandoned')
                    .map((participant) => (
                      <SelectItem
                        key={participant._id || participant.id}
                        value={participant.userId?._id || participant.userId}
                        disabled={
                          participant.userId?._id === selectedWinners.position2UserId ||
                          participant.userId?._id === selectedWinners.position3UserId
                        }
                      >
                        {participant.userId?.fullName || participant.userId?.email || "Unknown"}
                        {participant.totalProgress > 0 && ` (${participant.totalProgress.toFixed(1)} ${challenge.dailyGoal?.customUnit || challenge.dailyGoal?.unit})`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2nd Position */}
            <div className="space-y-2">
              <Label htmlFor="position2" className="flex items-center gap-2">
                <Badge className="bg-gray-400">2nd</Badge>
                Second Position Winner (Optional)
              </Label>
              <Select
                value={selectedWinners.position2UserId}
                onValueChange={(value) => setSelectedWinners(prev => ({ ...prev, position2UserId: value }))}
              >
                <SelectTrigger id="position2">
                  <SelectValue placeholder="Select 2nd place winner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {participants
                    .filter(p => p.status !== 'failed' && p.status !== 'abandoned')
                    .map((participant) => (
                      <SelectItem
                        key={participant._id || participant.id}
                        value={participant.userId?._id || participant.userId}
                        disabled={
                          participant.userId?._id === selectedWinners.position1UserId ||
                          participant.userId?._id === selectedWinners.position3UserId
                        }
                      >
                        {participant.userId?.fullName || participant.userId?.email || "Unknown"}
                        {participant.totalProgress > 0 && ` (${participant.totalProgress.toFixed(1)} ${challenge.dailyGoal?.customUnit || challenge.dailyGoal?.unit})`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3rd Position */}
            <div className="space-y-2">
              <Label htmlFor="position3" className="flex items-center gap-2">
                <Badge className="bg-orange-500">3rd</Badge>
                Third Position Winner (Optional)
              </Label>
              <Select
                value={selectedWinners.position3UserId}
                onValueChange={(value) => setSelectedWinners(prev => ({ ...prev, position3UserId: value }))}
              >
                <SelectTrigger id="position3">
                  <SelectValue placeholder="Select 3rd place winner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {participants
                    .filter(p => p.status !== 'failed' && p.status !== 'abandoned')
                    .map((participant) => (
                      <SelectItem
                        key={participant._id || participant.id}
                        value={participant.userId?._id || participant.userId}
                        disabled={
                          participant.userId?._id === selectedWinners.position1UserId ||
                          participant.userId?._id === selectedWinners.position2UserId
                        }
                      >
                        {participant.userId?.fullName || participant.userId?.email || "Unknown"}
                        {participant.totalProgress > 0 && ` (${participant.totalProgress.toFixed(1)} ${challenge.dailyGoal?.customUnit || challenge.dailyGoal?.unit})`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowFinalizeDialog(false);
              setSelectedWinners({ position1UserId: "", position2UserId: "none", position3UserId: "none" });
            }} disabled={finalizing}>
              Cancel
            </Button>
            <Button onClick={handleFinalizeWinners} disabled={finalizing}>
              {finalizing ? "Finalizing..." : "Finalize & Transfer Rewards"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disqualify Participant Dialog */}
      <Dialog open={disqualifyDialog.open} onOpenChange={(open) => {
        if (!open) {
          setDisqualifyDialog({ open: false, participant: null });
          setDisqualifyReason("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disqualify Participant</DialogTitle>
            <DialogDescription>
              Disqualify {disqualifyDialog.participant?.userId?.fullName || "this participant"} from the challenge. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Disqualification</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Fake photo proofs, cheating, rule violations..."
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDisqualifyDialog({ open: false, participant: null });
              setDisqualifyReason("");
            }} disabled={disqualifying}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisqualify} disabled={disqualifying}>
              {disqualifying ? "Disqualifying..." : "Disqualify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}