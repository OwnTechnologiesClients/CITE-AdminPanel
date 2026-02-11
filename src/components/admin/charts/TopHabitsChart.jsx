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

export default function TopHabitsChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
        No habit completion data yet
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.habitName || "Unnamed",
    completions: item.completionCount ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          className="text-xs"
          tick={{ fill: "var(--muted-foreground)" }}
          tickFormatter={(v) => (v.length > 18 ? `${v.slice(0, 18)}…` : v)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "var(--card-foreground)" }}
          formatter={(value) => [value ?? 0, "Completions"]}
          labelFormatter={(name) => name}
        />
        <Bar dataKey="completions" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} name="Completions" />
      </BarChart>
    </ResponsiveContainer>
  );
}
