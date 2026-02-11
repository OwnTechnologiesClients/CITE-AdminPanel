"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function TopInfluencesChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
        No influence data yet
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.influence ?? "Unknown",
    count: item.count ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="text-xs"
          tick={{ fill: "var(--muted-foreground)" }}
          tickFormatter={(v) => (v.length > 12 ? `${v.slice(0, 12)}…` : v)}
        />
        <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
          formatter={(value) => [value ?? 0, "Count"]}
          labelFormatter={(name) => name}
        />
        <Bar dataKey="count" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} name="Count" />
      </BarChart>
    </ResponsiveContainer>
  );
}
