"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Users, Loader2 } from "lucide-react";
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
import { getFamilies, getFamilyMembers } from "@/lib/api/families";

export default function FamiliesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFamilies() {
      try {
        setLoading(true);
        setError(null);
        const familiesData = await getFamilies();
        
        // Fetch member counts for each family
        const familiesWithStats = await Promise.all(
          familiesData.map(async (family) => {
            try {
              const members = await getFamilyMembers(family._id);
              const activeMembers = members.filter(m => m.status === 'active');
              const parents = activeMembers.filter(m => ['parent', 'guardian'].includes(m.role));
              const kids = activeMembers.filter(m => m.role === 'child');
              
              return {
                ...family,
                totalMembers: activeMembers.length,
                parentsCount: parents.length,
                kidsCount: kids.length,
              };
            } catch (err) {
              console.error(`Error fetching members for family ${family._id}:`, err);
              return {
                ...family,
                totalMembers: 0,
                parentsCount: 0,
                kidsCount: 0,
              };
            }
          })
        );
        
        setFamilies(familiesWithStats);
      } catch (err) {
        console.error("Error fetching families:", err);
        setError(err.message || "Failed to load families");
      } finally {
        setLoading(false);
      }
    }

    fetchFamilies();
  }, []);

  const filteredFamilies = families.filter(
    (family) =>
      family.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Loading families...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Families</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search families..."
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
              <TableHead>Family Name</TableHead>
              <TableHead>Family Code</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Composition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFamilies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No families found
                </TableCell>
              </TableRow>
            ) : (
              filteredFamilies.map((family) => (
                <TableRow key={family._id}>
                  <TableCell className="font-medium">{family.name || "N/A"}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {family.familyCode || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" />
                      <span>{family.totalMembers || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="text-muted-foreground">P:</span> {family.parentsCount || 0}{" "}
                      <span className="text-muted-foreground ml-2">K:</span> {family.kidsCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={family.status === 1 ? "default" : "outline"}
                    >
                      {family.status === 1 ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(family.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/families/${family._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 size-4" />
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredFamilies.length} of {families.length} families
        </div>
      </CardContent>
    </Card>
  );
}

