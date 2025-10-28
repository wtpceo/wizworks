"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, User, Bot, FileText } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ProposalChatProps {
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  setDocumentContent: (content: string) => void;
}

export default function ProposalChat({
  chatHistory,
  setChatHistory,
  setDocumentContent,
}: ProposalChatProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/proposal-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("채팅 응답 실패");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
      };

      const finalHistory = [...updatedHistory, assistantMessage];
      setChatHistory(finalHistory);
      setDocumentContent(data.documentContent || "");
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
      };
      setChatHistory([...updatedHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    setDocumentContent("");
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="gradient-marketing w-12 h-12 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              PRD 문서 작성
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Claude와 대화하며 제안서의 기반이 될 문서를 작성하세요
            </p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            대화 초기화
          </button>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="mb-6 h-[500px] overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              대화를 시작하세요
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
              프로젝트 목표, 요구사항, 예산, 일정 등을 Claude와 대화하며 정리할 수 있습니다
            </p>
          </div>
        ) : (
          <>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-marketing flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "gradient-marketing text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 gradient-marketing text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>전송 중...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>전송</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
