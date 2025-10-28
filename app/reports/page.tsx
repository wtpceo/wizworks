"use client";

import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DataInput from "@/components/DataInput";
import VisualizationChart from "@/components/VisualizationChart";
import InsightsPanel from "@/components/InsightsPanel";
import DownloadReport from "@/components/DownloadReport";

interface AnalysisResult {
  insights: string[];
  summary: string;
  chartData: Array<{ name: string; value: number }>;
  recommendations: string[];
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDataSubmit = async (data: string, prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "분석 실패");
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-creative"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_7s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_9s_ease-in-out_infinite_2s]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-12 animate-[slide-in-up_0.6s_ease-out]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all mb-6 border border-white/30"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            시각화 보고서 생성
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Claude AI가 데이터를 분석하고 실행 가능한 인사이트를 제공합니다
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 왼쪽: 데이터 입력 */}
          <div>
            <DataInput onDataSubmit={handleDataSubmit} isLoading={isLoading} />
          </div>

          {/* 오른쪽: 결과 */}
          <div className="space-y-6">
            {result && (
              <>
                {/* 다운로드 버튼 */}
                <div className="flex justify-end animate-[slide-in-up_0.6s_ease-out]">
                  <DownloadReport reportRef={reportRef} data={result} />
                </div>

                {/* 보고서 영역 */}
                <div ref={reportRef}>
                  <VisualizationChart data={result.chartData} chartType="bar" />
                  <InsightsPanel
                    insights={result.insights}
                    summary={result.summary}
                    recommendations={result.recommendations}
                  />
                </div>
              </>
            )}

            {!result && !isLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  데이터를 입력하고 분석을 시작하세요
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">
                  Claude가 데이터를 분석하고 있습니다...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 사용 예시 */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-[slide-in-up_0.8s_ease-out]">
          <h2 className="text-2xl font-bold mb-6 text-gradient-primary">
            💡 데이터 입력 예시
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
              <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">CSV 형식</h3>
              <code className="text-sm text-gray-700 dark:text-gray-300">
                name,value<br />
                서울,100<br />
                부산,80<br />
                대구,60
              </code>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-xl">
              <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-2">JSON 형식</h3>
              <code className="text-sm text-gray-700 dark:text-gray-300 break-words">
                {`[{"name": "1월", "value": 4000}]`}
              </code>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">텍스트 형식</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                지난달 매출은 1000만원이었고 이번달은 1200만원입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
