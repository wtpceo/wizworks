"use client";

import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface InsightsPanelProps {
  insights?: string[];
  summary?: string;
  recommendations?: string[];
}

export default function InsightsPanel({
  insights = [],
  summary = "",
  recommendations = [],
}: InsightsPanelProps) {
  if (!summary && insights.length === 0 && recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-[slide-in-up_0.6s_ease-out]">
      {/* 요약 */}
      {summary && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700 hover-lift">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-blue-900 dark:text-blue-100 mb-3">
                📈 핵심 요약
              </h3>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed font-medium">{summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* 주요 인사이트 */}
      {insights.length > 0 && (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gradient-secondary">
              💡 주요 인사이트
            </h3>
          </div>
          <ul className="space-y-4">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="group flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-md transition-all border border-purple-100 dark:border-purple-800"
              >
                <span className="flex-shrink-0 w-8 h-8 gradient-marketing text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {index + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300 pt-1 leading-relaxed font-medium">{insight}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 추천사항 */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border-2 border-green-200 dark:border-green-700 hover-lift">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-green-500 rounded-lg shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-green-900 dark:text-green-100">
              🎯 액션 아이템
            </h3>
          </div>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-green-800 dark:text-green-200 p-3 bg-white/50 dark:bg-green-900/20 rounded-lg hover:bg-white/80 dark:hover:bg-green-900/30 transition-all"
              >
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">✓</span>
                <span className="font-medium leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
