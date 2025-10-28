"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, AlertCircle, ChevronLeft, ChevronRight, Edit2, Send, X } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ProposalDownload from "./ProposalDownload";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ProposalGeneratorProps {
  documentContent: string;
  chatHistory: ChatMessage[];
}

interface ChartData {
  type: "bar" | "pie" | "line";
  data: Array<{ name: string; value: number }>;
  title: string;
}

interface Slide {
  slideNumber: number;
  type: string;
  heading: string;
  content: string | string[];
  imageKeyword?: string;
  chartData?: ChartData;
}

interface GeneratedProposal {
  title: string;
  subtitle: string;
  coverImage: string;
  slides: Slide[];
}

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe", "#43e97b"];

export default function ProposalGenerator({
  documentContent,
  chatHistory,
}: ProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const proposalRef = useRef<HTMLDivElement>(null);

  // 슬라이드 편집 관련 상태
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [editMessages, setEditMessages] = useState<ChatMessage[]>([]);
  const [editInput, setEditInput] = useState("");
  const [isEditingSlide, setIsEditingSlide] = useState(false);

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
      setCurrentSlide(0);
    } catch (err) {
      console.error("Proposal generation error:", err);
      setError("제안서 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 슬라이드 편집 시작
  const startEditingSlide = (index: number) => {
    setEditingSlideIndex(index);
    setEditMessages([]);
    setEditInput("");
  };

  // 슬라이드 편집 취소
  const cancelEditingSlide = () => {
    setEditingSlideIndex(null);
    setEditMessages([]);
    setEditInput("");
  };

  // 슬라이드 편집 메시지 전송
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInput.trim() || editingSlideIndex === null || !proposal) return;

    const userMessage: ChatMessage = { role: "user", content: editInput };
    const updatedMessages = [...editMessages, userMessage];
    setEditMessages(updatedMessages);
    setEditInput("");
    setIsEditingSlide(true);

    try {
      const currentSlideData = proposal.slides[editingSlideIndex];

      const response = await fetch("/api/edit-slide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slideContent: currentSlideData,
          editMessages: updatedMessages,
          slideType: currentSlideData.type,
        }),
      });

      if (!response.ok) {
        throw new Error("슬라이드 수정 실패");
      }

      const data = await response.json();

      // 슬라이드 업데이트
      const updatedSlides = [...proposal.slides];
      updatedSlides[editingSlideIndex] = {
        ...updatedSlides[editingSlideIndex],
        heading: data.updatedSlide.heading,
        content: data.updatedSlide.content,
        chartData: data.updatedSlide.chartData,
      };

      setProposal({
        ...proposal,
        slides: updatedSlides,
      });

      // AI 응답 추가
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: "슬라이드가 수정되었습니다.",
      };
      setEditMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error("Slide edit error:", err);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "슬라이드 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
      };
      setEditMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsEditingSlide(false);
    }
  };

  // 슬라이드 타입별 아이콘 이모지
  const getSlideIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      title: "🎯",
      content: "📋",
      "image-content": "💡",
      chart: "📊",
      timeline: "📅",
      budget: "💰",
      team: "👥",
      closing: "✨",
    };
    return icons[type] || "▶️";
  };

  const renderChart = (chartData: ChartData) => {
    const chartProps = {
      data: chartData.data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    if (chartData.type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "2px solid #667eea",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartData.type === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "2px solid #667eea",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: "#764ba2", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartData.type === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const renderSlide = (slide: Slide) => {
    // content를 안전하게 문자열로 변환
    const contentText = typeof slide.content === 'string'
      ? slide.content
      : Array.isArray(slide.content)
      ? slide.content.join('\n')
      : String(slide.content || '');

    const slideIcon = getSlideIcon(slide.type);

    // 표지 슬라이드
    if (slide.type === "title") {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-16 gradient-marketing text-white relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="text-9xl mb-8">{slideIcon}</div>
            <h1 className="text-7xl font-black mb-8 drop-shadow-2xl">
              {slide.heading}
            </h1>
            <p className="text-3xl font-medium mb-12 opacity-90">
              {contentText}
            </p>
            <div className="w-32 h-1 bg-white/50 mx-auto mb-8"></div>
            <p className="text-xl opacity-75">
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      );
    }

    // 일반 콘텐츠 슬라이드
    if (slide.type === "content") {
      const lines = contentText.split("\n").filter(line => line.trim());
      return (
        <div className="h-full p-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-4 mb-12">
            <div className="text-6xl">{slideIcon}</div>
            <h2 className="text-5xl font-black text-gradient-primary">
              {slide.heading}
            </h2>
          </div>
          <div className="space-y-6">
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {idx + 1}
                </div>
                <p className="flex-1 text-2xl leading-relaxed text-gray-700 dark:text-gray-300">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 강조 콘텐츠 슬라이드 (이전 image-content)
    if (slide.type === "image-content") {
      const lines = contentText.split("\n").filter(line => line.trim());
      return (
        <div className="h-full p-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
          <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-12">
              <div className="text-8xl">{slideIcon}</div>
              <h2 className="text-6xl font-black text-gradient-primary">
                {slide.heading}
              </h2>
            </div>
            <div className="space-y-6">
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-6 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-3xl">
                    ✓
                  </div>
                  <p className="flex-1 text-3xl font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 차트 슬라이드
    if (slide.type === "chart" && slide.chartData) {
      return (
        <div className="h-full p-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center gap-4 mb-12">
            <div className="text-6xl">{slideIcon}</div>
            <h2 className="text-5xl font-black text-gradient-primary">
              {slide.heading}
            </h2>
          </div>
          <div className="h-[calc(100%-120px)]">
            {contentText && (
              <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
                {contentText}
              </p>
            )}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl h-[calc(100%-80px)]">
              {renderChart(slide.chartData)}
            </div>
          </div>
        </div>
      );
    }

    // 마무리 슬라이드
    if (slide.type === "closing") {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-16 gradient-creative text-white relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="text-9xl mb-8">{slideIcon}</div>
            <h2 className="text-7xl font-black mb-12 drop-shadow-2xl">
              {slide.heading}
            </h2>
            <p className="text-3xl leading-relaxed mb-16 opacity-90 whitespace-pre-line max-w-4xl">
              {contentText}
            </p>
            <div className="w-32 h-1 bg-white/50 mx-auto mb-8"></div>
            <div className="text-2xl opacity-75">
              <p className="font-bold">Wiz Works</p>
              <p className="text-lg mt-2">AI로 업무를 혁신하세요</p>
            </div>
          </div>
        </div>
      );
    }

    // 기타 슬라이드 타입 (기본 레이아웃)
    const lines = contentText.split("\n").filter(line => line.trim());
    return (
      <div className="h-full p-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-center gap-4 mb-12">
          <div className="text-6xl">{slideIcon}</div>
          <h2 className="text-5xl font-black text-gradient-primary">
            {slide.heading}
          </h2>
        </div>
        {lines.length > 0 ? (
          <div className="space-y-6">
            {lines.map((line, idx) => (
              <div key={idx} className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg">
                <p className="text-2xl leading-relaxed text-gray-700 dark:text-gray-300">
                  {line}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-2xl leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {contentText}
          </div>
        )}
      </div>
    );
  };

  const nextSlide = () => {
    if (proposal && currentSlide < proposal.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
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
                프레젠테이션 제안서 생성
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                작성한 문서를 바탕으로 시각적인 프레젠테이션을 자동 생성합니다
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

      {/* 생성된 프레젠테이션 */}
      {proposal && (
        <>
          <div className="flex justify-end">
            <ProposalDownload proposalRef={proposalRef} proposal={proposal} />
          </div>

          {/* 슬라이드 컨테이너 */}
          <div
            ref={proposalRef}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* 슬라이드 */}
            <div className="aspect-[16/9] bg-gray-50 dark:bg-gray-900 relative">
              {proposal.slides[currentSlide] && renderSlide(proposal.slides[currentSlide])}

              {/* 슬라이드 번호 */}
              <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 text-white rounded-lg text-sm font-medium">
                {currentSlide + 1} / {proposal.slides.length}
              </div>

              {/* 편집 버튼 */}
              {editingSlideIndex !== currentSlide && (
                <button
                  onClick={() => startEditingSlide(currentSlide)}
                  className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium shadow-lg transition-all hover:scale-105"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>편집</span>
                </button>
              )}
            </div>

            {/* 내비게이션 */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>이전</span>
                </button>

                {/* 슬라이드 인디케이터 */}
                <div className="flex gap-2">
                  {proposal.slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentSlide
                          ? "bg-white w-8"
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  disabled={currentSlide === proposal.slides.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                >
                  <span>다음</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 슬라이드 편집 인터페이스 */}
          {editingSlideIndex !== null && (
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="gradient-creative w-10 h-10 rounded-xl flex items-center justify-center">
                    <Edit2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      슬라이드 {editingSlideIndex + 1} 편집
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Claude에게 어떻게 수정할지 말해주세요
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelEditingSlide}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* 편집 대화 내역 */}
              <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
                {editMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-purple-50 dark:bg-purple-900/20 ml-auto max-w-[80%]"
                        : "bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {msg.role === "user" ? "나" : "Claude"}
                    </p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* 편집 입력 폼 */}
              <form onSubmit={handleEditSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  placeholder="예: 첫 번째 포인트를 좀 더 구체적으로 수정해줘"
                  disabled={isEditingSlide}
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!editInput.trim() || isEditingSlide}
                  className="px-6 py-3 gradient-creative text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isEditingSlide ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>수정 중...</span>
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
          )}

          {/* 슬라이드 썸네일 */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              슬라이드 목록
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {proposal.slides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`aspect-[16/9] rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentSlide
                      ? "border-purple-500 shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                  }`}
                >
                  <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 flex flex-col justify-between">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-2">
                      {slide.heading}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      슬라이드 {idx + 1}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
