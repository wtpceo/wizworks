"use client";

import { useState } from "react";
import { Upload, FileImage, X } from "lucide-react";

interface ReportMetadata {
  companyName: string;
  department: string;
  authorName: string;
  targetCompany: string;
  reportTitle: string;
  reportPeriod?: string;
}

interface DataInputProps {
  onDataSubmit: (
    data: string,
    prompt: string,
    images: string[],
    metadata: ReportMetadata
  ) => void;
  isLoading: boolean;
}

export default function DataInput({ onDataSubmit, isLoading }: DataInputProps) {
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState("주요 트렌드와 인사이트를 찾아주세요.");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 메타데이터 상태
  const [metadata, setMetadata] = useState<ReportMetadata>({
    companyName: "위즈더플래닝",
    department: "",
    authorName: "",
    targetCompany: "",
    reportTitle: "",
    reportPeriod: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 입력 항목 검증
    if (!metadata.department.trim()) {
      alert("부서명을 입력해주세요.");
      return;
    }
    if (!metadata.authorName.trim()) {
      alert("작성자명을 입력해주세요.");
      return;
    }
    if (!metadata.targetCompany.trim()) {
      alert("대상 업체명을 입력해주세요.");
      return;
    }
    if (!metadata.reportTitle.trim()) {
      alert("보고서 제목을 입력해주세요.");
      return;
    }

    // 데이터 또는 이미지 중 하나는 필수
    if (!data.trim() && images.length === 0) {
      alert("데이터를 입력하거나 이미지를 업로드해주세요.");
      return;
    }

    onDataSubmit(data, prompt, images, metadata);
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

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles((prev) => [...prev, ...fileArray]);

      // 이미지 파일을 base64로 인코딩
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setImages((prev) => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 hover-lift">
      <h2 className="text-3xl font-black mb-6 text-gradient-primary">
        📊 보고서 작성
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 메타데이터 입력 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-bold mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2">
            <span>📋</span> 보고서 정보 (필수)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                회사명
              </label>
              <input
                type="text"
                value={metadata.companyName}
                disabled
                className="w-full p-3 bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                부서명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.department}
                onChange={(e) =>
                  setMetadata({ ...metadata, department: e.target.value })
                }
                placeholder="예: 마케팅팀"
                className="w-full p-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                작성자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.authorName}
                onChange={(e) =>
                  setMetadata({ ...metadata, authorName: e.target.value })
                }
                placeholder="예: 홍길동"
                className="w-full p-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                대상 업체명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.targetCompany}
                onChange={(e) =>
                  setMetadata({ ...metadata, targetCompany: e.target.value })
                }
                placeholder="예: ABC 주식회사"
                className="w-full p-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                보고서 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.reportTitle}
                onChange={(e) =>
                  setMetadata({ ...metadata, reportTitle: e.target.value })
                }
                placeholder="예: 2024년 1분기 마케팅 성과 분석"
                className="w-full p-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                보고 기간 (선택)
              </label>
              <input
                type="text"
                value={metadata.reportPeriod}
                onChange={(e) =>
                  setMetadata({ ...metadata, reportPeriod: e.target.value })
                }
                placeholder="예: 2024.01.01 ~ 2024.03.31"
                className="w-full p-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            데이터 캡처 이미지 업로드
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-blue-300 dark:border-blue-600 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <FileImage className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">클릭하여 이미지 업로드</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  PNG, JPG, JPEG (여러 개 선택 가능)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* 업로드된 이미지 미리보기 */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600"
                >
                  <img
                    src={image}
                    alt={`업로드 이미지 ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                    이미지 {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 데이터 파일 업로드 (선택) */}
        <div>
          <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            데이터 파일 업로드 (선택)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="group flex flex-col items-center justify-center w-full h-28 border-2 border-purple-300 dark:border-purple-600 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
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
            데이터 직접 입력 (선택)
          </label>
          <textarea
            className="w-full h-36 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
            placeholder="데이터를 직접 입력하세요...
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
          disabled={isLoading}
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
                ✨ 보고서 생성
              </>
            )}
          </span>
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          * 이미지 또는 데이터 중 하나 이상 입력해주세요
        </p>
      </form>
    </div>
  );
}
