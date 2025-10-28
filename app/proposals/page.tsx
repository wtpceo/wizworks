"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import ProposalChat from "@/components/ProposalChat";
import ProposalGenerator from "@/components/ProposalGenerator";

type TabType = "chat" | "generate";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [documentContent, setDocumentContent] = useState<string>("");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-creative"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_7s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-[float_9s_ease-in-out_infinite_2s]"></div>

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
            AI 제안서 작성
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Claude AI와 대화하며 PRD를 작성하고, 전문적인 제안서를 자동 생성하세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 inline-flex gap-2 border border-white/20">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === "chat"
                ? "gradient-marketing text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>문서 작성</span>
          </button>
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeTab === "generate"
                ? "gradient-marketing text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>제안서 생성</span>
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="animate-[slide-in-up_0.6s_ease-out]">
          {activeTab === "chat" && (
            <ProposalChat
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              setDocumentContent={setDocumentContent}
            />
          )}
          {activeTab === "generate" && (
            <ProposalGenerator
              documentContent={documentContent}
              chatHistory={chatHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
}
