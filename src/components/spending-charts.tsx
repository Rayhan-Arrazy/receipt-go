"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, PieChartIcon, BarChart2 } from "lucide-react";
import { getCategoryColor, formatCurrency } from "@/lib/constants";

interface Receipt {
  id: string;
  amount: number;
  date: string | Date;
  category: string;
  currency: string;
}

interface SpendingChartsProps {
  receipts: Receipt[];
}

interface CategoryData {
  name: string;
  total: number;
  count: number;
  color: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-white font-semibold text-sm">{payload[0].name}</p>
        <p className="text-slate-300 text-sm">{formatCurrency(payload[0].value)}</p>
        <p className="text-slate-400 text-xs">{payload[0].payload.count} receipts</p>
      </div>
    );
  }
  return null;
};

export function SpendingCharts({ receipts }: SpendingChartsProps) {
  const categoryData = useMemo<CategoryData[]>(() => {
    const map: Record<string, { total: number; count: number }> = {};

    receipts.forEach((r) => {
      // Normalize to USD for simplicity (in a real app you'd use exchange rates)
      if (!map[r.category]) map[r.category] = { total: 0, count: 0 };
      map[r.category].total += r.amount;
      map[r.category].count += 1;
    });

    return Object.entries(map)
      .map(([name, { total, count }]) => ({
        name,
        total: parseFloat(total.toFixed(2)),
        count,
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.total - a.total);
  }, [receipts]);

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};

    receipts.forEach((r) => {
      const date = new Date(r.date);
      const key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!map[key]) map[key] = 0;
      map[key] += r.amount;
    });

    return Object.entries(map)
      .map(([month, total]) => ({
        month,
        total: parseFloat(total.toFixed(2)),
      }))
      .slice(-6); // last 6 months
  }, [receipts]);

  const totalSpending = useMemo(
    () => receipts.reduce((sum, r) => sum + r.amount, 0),
    [receipts]
  );

  if (receipts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center">
        <div className="p-4 rounded-2xl bg-white/5">
          <TrendingUp className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-400 font-medium">No spending data yet</p>
        <p className="text-slate-500 text-sm">Upload receipts to see your spending analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-violet-400" />
          <h3 className="text-white font-semibold">Total Spending</h3>
        </div>
        <p className="text-3xl font-bold text-white">{formatCurrency(totalSpending)}</p>
        <p className="text-slate-400 text-sm mt-1">across {receipts.length} receipts</p>
      </div>

      {/* Monthly Bar Chart */}
      {monthlyData.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <BarChart2 className="w-5 h-5 text-violet-400" />
            <h3 className="text-white font-semibold">Monthly Spending</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar
                dataKey="total"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Pie Chart */}
      {categoryData.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <PieChartIcon className="w-5 h-5 text-violet-400" />
            <h3 className="text-white font-semibold">By Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="total"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Category breakdown list */}
          <div className="mt-4 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-slate-300 text-sm">{cat.name}</span>
                  <span className="text-slate-500 text-xs">({cat.count})</span>
                </div>
                <span className="text-white text-sm font-medium">
                  {formatCurrency(cat.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
