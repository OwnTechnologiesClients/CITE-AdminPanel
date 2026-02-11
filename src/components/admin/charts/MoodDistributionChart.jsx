"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Reflection mood colours from the app (add_reflection_screen / cite_app_home)
const MOOD_COLORS = {
  great: "#4CAF50",
  good: "#8BC34A",
  okay: "#FFC107",
  not_great: "#FF9800",
  bad: "#F44336",
};

const MOOD_DISPLAY_NAMES = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  not_great: "Not great",
  bad: "Bad",
};

function getMoodColor(moodKey) {
  if (!moodKey) return "#9CA3AF";
  return MOOD_COLORS[moodKey.toLowerCase()] ?? "#9CA3AF";
}

function getMoodDisplayName(moodKey) {
  if (!moodKey) return "Not set";
  return MOOD_DISPLAY_NAMES[moodKey.toLowerCase()] ?? moodKey;
}

export default function MoodDistributionChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
        No mood data yet
      </div>
    );
  }

  const chartData = data.map((item) => {
    const key = item.mood ?? "";
    return {
      name: getMoodDisplayName(key),
      value: item.count ?? 0,
      fill: getMoodColor(key),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          formatter={(value) => value}
          wrapperStyle={{ fontSize: "12px" }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
