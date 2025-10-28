"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface VisualizationChartProps {
  data: ChartData[];
  chartType?: "bar" | "line" | "pie";
}

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"];

export default function VisualizationChart({
  data,
  chartType: initialChartType = "bar",
}: VisualizationChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">(initialChartType);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-700">
        <p className="text-gray-500 dark:text-gray-400 font-medium">데이터를 분석하면 차트가 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 hover-lift animate-[slide-in-up_0.6s_ease-out]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-gradient-primary">
          📊 데이터 시각화
        </h3>

        {/* 차트 타입 선택 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("bar")}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              chartType === "bar"
                ? "gradient-marketing text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">막대</span>
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              chartType === "line"
                ? "gradient-marketing text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <LineChartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">선</span>
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              chartType === "pie"
                ? "gradient-marketing text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">원형</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              />
              <Legend wrapperStyle={{ fontWeight: '600' }} />
              <Bar
                dataKey="value"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </BarChart>
          )}

          {chartType === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              />
              <Legend wrapperStyle={{ fontWeight: '600' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#667eea"
                strokeWidth={3}
                dot={{ fill: '#764ba2', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}

          {chartType === "pie" && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
