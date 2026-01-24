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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getSupportRequests, updateSupportStatus } from "@/lib/api/support";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SupportTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    fetchSupportRequests();
  }, [statusFilter, moduleFilter]);

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (moduleFilter !== "all") {
        params.module = moduleFilter;
      }

      const data = await getSupportRequests(params);
      setSupportRequests(data || []);
    } catch (err) {
      console.error("Error fetching support requests:", err);
      setError("Failed to load support requests");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setUpdatingStatusId(requestId);
      await updateSupportStatus(requestId, newStatus);
      // Refresh the list
      await fetchSupportRequests();
      // Update selected request if it's the one being updated
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredRequests = supportRequests.filter((request) => {
    const user = request.userId || {};
    const fullName = user.fullName || request.userName || "";
    const email = user.email || "";

    const matchesSearch =
      request.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const variants = {
      open: "default",
      in_progress: "secondary",
      resolved: "outline",
      closed: "secondary",
    };
    const colors = {
      open: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status?.replace("_", " ").toUpperCase() || "OPEN"}
      </Badge>
    );
  };

  const getModuleBadge = (module) => {
    const labels = {
      adults: "CITE Adult",
      parents_kids: "Kids & Parents",
      together: "Family Hub",
    };
    const colors = {
      adults: "bg-green-100 text-green-800",
      parents_kids: "bg-blue-100 text-blue-800",
      together: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={colors[module] || "bg-gray-100 text-gray-800"}>
        {labels[module] || module}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading support requests...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchSupportRequests} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Support Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by subject, user name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="adults">CITE Adult</SelectItem>
                <SelectItem value="parents_kids">Kids & Parents</SelectItem>
                <SelectItem value="together">Family Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No support requests found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Received</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {(request.userId && request.userId.fullName) ||
                              request.userName ||
                              "User"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {(request.userId && request.userId.email) || "No email"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getModuleBadge(request.module)}
                      </TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.subject}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(request._id, value)
                          }
                          disabled={updatingStatusId === request._id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              View and manage support request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    User Name
                  </Label>
                  <p className="text-sm font-medium">
                    {(selectedRequest.userId &&
                      selectedRequest.userId.fullName) ||
                      selectedRequest.userName ||
                      "User"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    User Email
                  </Label>
                  <p className="text-sm font-medium">
                    {(selectedRequest.userId && selectedRequest.userId.email) ||
                      "No email"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Module
                  </Label>
                  <div className="mt-1">
                    {getModuleBadge(selectedRequest.module)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Category
                  </Label>
                  <p className="text-sm font-medium">
                    {selectedRequest.category}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Date Received
                  </Label>
                  <p className="text-sm font-medium">
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Subject
                </Label>
                <p className="text-sm font-medium mt-1">
                  {selectedRequest.subject}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Message
                </Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {selectedRequest.message}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Update Status
                </Label>
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) =>
                    handleStatusUpdate(selectedRequest._id, value)
                  }
                  disabled={updatingStatusId === selectedRequest._id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
