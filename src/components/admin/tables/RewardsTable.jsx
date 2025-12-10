"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Gift, CheckCircle2 } from "lucide-react";
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
const mockRewards = [
  {
    id: 1,
    name: "Extra Screen Time",
    family: "Doe Family",
    createdBy: "John Doe",
    cost: 100,
    redeemed: 5,
    available: true,
    createdDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Choose Dinner",
    family: "Smith Family",
    createdBy: "Jane Smith",
    cost: 150,
    redeemed: 3,
    available: true,
    createdDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Stay Up Late",
    family: "Johnson Family",
    createdBy: "Emma Johnson",
    cost: 200,
    redeemed: 8,
    available: true,
    createdDate: "2024-01-10",
  },
  {
    id: 4,
    name: "New Toy",
    family: "Brown Family",
    createdBy: "Michael Brown",
    cost: 500,
    redeemed: 1,
    available: true,
    createdDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Ice Cream Treat",
    family: "Wilson Family",
    createdBy: "Sarah Wilson",
    cost: 75,
    redeemed: 12,
    available: false,
    createdDate: "2024-04-12",
  },
];

export default function RewardsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rewards] = useState(mockRewards);

  const filteredRewards = rewards.filter(
    (reward) =>
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Rewards</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search rewards..."
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
              <TableHead>Reward Name</TableHead>
              <TableHead>Family</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Cost (Coins)</TableHead>
              <TableHead>Times Redeemed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRewards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No rewards found
                </TableCell>
              </TableRow>
            ) : (
              filteredRewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gift className="size-4 text-muted-foreground" />
                      <span className="font-medium">{reward.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{reward.family}</TableCell>
                  <TableCell>{reward.createdBy}</TableCell>
                  <TableCell>
                    <span className="font-medium">{reward.cost.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-muted-foreground" />
                      <span>{reward.redeemed}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reward.available ? "default" : "outline"}>
                      {reward.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(reward.createdDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredRewards.length} of {rewards.length} rewards
        </div>
      </CardContent>
    </Card>
  );
}

