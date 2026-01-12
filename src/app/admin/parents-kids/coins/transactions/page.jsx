"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Search, Coins, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getAllCoinTransactions } from "@/lib/api/coins";
import { getKids } from "@/lib/api/kids";

export default function CoinTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [kidFilter, setKidFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch kids for filter dropdown
        const kidsData = await getKids();
        setKids(kidsData);

        // Build params
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(kidFilter !== "all" && { kidId: kidFilter }),
          ...(typeFilter !== "all" && { type: typeFilter }),
        };

        const response = await getAllCoinTransactions(params);
        setTransactions(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Error fetching coin transactions:", err);
        setError(err.message || "Failed to load coin transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, kidFilter, typeFilter]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.kidName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.parentName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [transactions, searchQuery]);

  const getTransactionTypeBadge = (type) => {
    const badges = {
      earned: { label: "Earned", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      spent: { label: "Spent", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
      added: { label: "Added", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
      deducted: { label: "Deducted", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
    };
    const badge = badges[type] || { label: type, className: "bg-gray-100 text-gray-800" };
    return (
      <Badge className={badge.className}>
        {badge.label}
      </Badge>
    );
  };

  const getSourceBadge = (source) => {
    const colors = {
      task_completion: "bg-blue-100 text-blue-800",
      reward_redemption: "bg-purple-100 text-purple-800",
      manual_add: "bg-green-100 text-green-800",
      manual_deduct: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    const label = source?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Other";
    return (
      <Badge className={colors[source] || colors.other}>
        {label}
      </Badge>
    );
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalEarned = transactions
      .filter(t => t.transactionType === 'earned' || t.transactionType === 'added')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalSpent = transactions
      .filter(t => t.transactionType === 'spent' || t.transactionType === 'deducted')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return {
      totalEarned,
      totalSpent,
      net: totalEarned - totalSpent,
      count: transactions.length
    };
  }, [transactions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coin Transactions</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coin Transactions</h1>
          <p className="text-muted-foreground mt-2 text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coin Transactions</h1>
        <p className="text-muted-foreground mt-2">
          View all coin transactions across all kids
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.count}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.totalEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Coins earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Coins spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summaryStats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summaryStats.net.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Earned - Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by kid name, parent, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={kidFilter} onValueChange={(value) => { setKidFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Kids" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kids</SelectItem>
                {kids.map((kid) => (
                  <SelectItem key={kid._id} value={kid._id}>
                    {kid.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="earned">Earned</SelectItem>
                <SelectItem value="spent">Spent</SelectItem>
                <SelectItem value="added">Added</SelectItem>
                <SelectItem value="deducted">Deducted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Coin Transactions</CardTitle>
          <CardDescription>
            {pagination.total || filteredTransactions.length} total transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No coin transactions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Kid</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Balance After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(transaction.transactionDate || transaction.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.kidName || "N/A"}</TableCell>
                    <TableCell>{transaction.parentName || "N/A"}</TableCell>
                    <TableCell>{getTransactionTypeBadge(transaction.transactionType)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 font-medium ${
                        transaction.transactionType === 'earned' || transaction.transactionType === 'added'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.transactionType === 'spent' || transaction.transactionType === 'deducted' ? '-' : '+'}
                        <Coins className="h-4 w-4" />
                        {transaction.amount || 0}
                      </div>
                    </TableCell>
                    <TableCell>{getSourceBadge(transaction.source)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description || "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {(transaction.balanceAfter || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

