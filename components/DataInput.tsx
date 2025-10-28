"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface DataInputProps {
  onDataSubmit: (data: string, prompt: string) => void;
  isLoading: boolean;
}

export default function DataInput({ onDataSubmit, isLoading }: DataInputProps) {
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState("주요 트렌드와 인사이트를 찾아주세요.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.trim()) {
      onDataSubmit(data, prompt);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setData(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 hover-lift">
      <h2 className="text-3xl font-black mb-6 text-gradient-primary">
        📊 데이터 입력
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 파일 업로드 */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            파일 업로드
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-purple-300 dark:border-purple-600 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  CSV, TXT, JSON 파일
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv,.txt,.json"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* 직접 입력 */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            또는 직접 입력
          </label>
          <textarea
            className="w-full h-44 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
            placeholder="데이터를 입력하세요...
예시:
• CSV: name,value\n서울,100\n부산,80
• JSON: [{&quot;name&quot;:&quot;1월&quot;, &quot;value&quot;:4000}]
• 텍스트: 자유 형식"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        {/* 분석 요청사항 */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            분석 요청사항
          </label>
          <input
            type="text"
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="어떤 인사이트를 원하시나요?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !data.trim()}
          className="group w-full gradient-marketing text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl hover-glow"
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                분석 중...
              </>
            ) : (
              <>
                ✨ 분석 시작
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
