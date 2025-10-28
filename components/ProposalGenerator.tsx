"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import ProposalDownload from "./ProposalDownload";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ProposalGeneratorProps {
  documentContent: string;
  chatHistory: ChatMessage[];
}

interface GeneratedProposal {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
  executiveSummary: string;
  timeline: string;
  budget: string;
}

export default function ProposalGenerator({
  documentContent,
  chatHistory,
}: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (chatHistory.length === 0) {
      setError("먼저 문서 작성 탭에서 Claude와 대화를 진행해주세요.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatHistory,
          documentContent,
        }),
      });

      if (!response.ok) {
        throw new Error("제안서 생성 실패");
      }

      const data = await response.json();
      setProposal(data.proposal);
    } catch (err) {
      console.error("Proposal generation error:", err);
      setError("제안서 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 및 생성 버튼 */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-creative w-12 h-12 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                제안서 생성
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                작성한 문서를 바탕으로 전문적인 제안서를 자동 생성합니다
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || chatHistory.length === 0}
            className="flex items-center gap-2 px-6 py-3 gradient-creative text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>제안서 생성</span>
              </>
            )}
          </button>
        </div>

        {chatHistory.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              문서 작성 탭에서 먼저 Claude와 대화를 진행해주세요.
            </p>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* 생성된 제안서 */}
      {proposal && (
        <>
          <div className="flex justify-end">
            <ProposalDownload proposalRef={proposalRef} proposal={proposal} />
          </div>

          <div
            ref={proposalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            {/* 제안서 제목 */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gradient-primary">
              <h1 className="text-4xl font-black text-gradient-primary mb-2">
                {proposal.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                생성 날짜: {new Date().toLocaleDateString("ko-KR")}
              </p>
            </div>

            {/* 요약 */}
            {proposal.executiveSummary && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-500">📋</span> 요약
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {proposal.executiveSummary}
                </p>
              </div>
            )}

            {/* 섹션들 */}
            {proposal.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-purple-500">▶</span> {section.heading}
                </h2>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap pl-6">
                  {section.content}
                </div>
              </div>
            ))}

            {/* 일정 */}
            {proposal.timeline && (
              <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border-l-4 border-green-500">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-green-500">📅</span> 일정
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {proposal.timeline}
                </p>
              </div>
            )}

            {/* 예산 */}
            {proposal.budget && (
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-l-4 border-yellow-500">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">💰</span> 예산
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {proposal.budget}
                </p>
              </div>
            )}

            {/* 푸터 */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                본 제안서는 <strong>Wiz Works</strong> AI 시스템으로 자동 생성되었습니다
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
