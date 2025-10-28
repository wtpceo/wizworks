import Link from "next/link";
import { BarChart3, FileText, Sparkles, Zap, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-marketing"></div>

      {/* Floating shapes for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-[float_8s_ease-in-out_infinite_2s]"></div>
      <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-[float_10s_ease-in-out_infinite_4s]"></div>

      <main className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-[slide-in-up_0.8s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 text-white border border-white/30">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Marketing Analytics</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-white drop-shadow-2xl">
              Wiz Works
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 font-medium mb-4 drop-shadow-lg">
            데이터를 인사이트로, 인사이트를 성과로
          </p>

          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Claude AI가 마케팅 데이터를 분석하고 실행 가능한 인사이트를 제공합니다.
            복잡한 데이터도 단 몇 분 만에 아름다운 보고서로 변환하세요.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 시각화 보고서 */}
          <Link href="/reports" className="group">
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover-lift cursor-pointer overflow-hidden border border-white/20">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>

              <div className="relative z-10">
                <div className="gradient-marketing w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-gradient-primary transition-all">
                  시각화 보고서
                </h2>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  데이터를 업로드하고 Claude가 분석하여 인터랙티브한 차트와 인사이트를 생성합니다
                </p>

                <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                  시작하기 <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* 문서 분석 */}
          <div className="group relative">
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover-lift cursor-pointer overflow-hidden border border-white/20 opacity-75 hover:opacity-100 transition-opacity">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                Coming Soon
              </div>

              <div className="relative z-10">
                <div className="gradient-creative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FileText className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  문서 분석
                </h2>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  PDF, Excel 파일을 업로드하여 핵심 내용을 자동으로 요약하고 분석합니다
                </p>
              </div>
            </div>
          </div>

          {/* 자동화 워크플로우 */}
          <div className="group relative">
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover-lift cursor-pointer overflow-hidden border border-white/20 opacity-75 hover:opacity-100 transition-opacity">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                Coming Soon
              </div>

              <div className="relative z-10">
                <div className="gradient-vibrant w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  자동화 워크플로우
                </h2>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  반복 작업을 자동화하고 Playwright로 웹 작업을 스케줄링합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Target, number: "10x", label: "더 빠른 분석" },
            { icon: BarChart3, number: "95%", label: "정확도" },
            { icon: Zap, number: "24/7", label: "자동화" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 animate-[slide-in-up_0.8s_ease-out]"
              style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
            >
              <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
              <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
              <div className="text-white/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
