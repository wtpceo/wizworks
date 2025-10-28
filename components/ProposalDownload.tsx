"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

interface Proposal {
  title: string;
  subtitle: string;
  coverImage: string;
  slides: Slide[];
}

interface ProposalDownloadProps {
  proposalRef: React.RefObject<HTMLDivElement>;
  proposal: Proposal;
}

export default function ProposalDownload({
  proposalRef,
  proposal,
}: ProposalDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFileName = (extension: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    return `제안서-${proposal.title}-${dateStr}-${timeStr}.${extension}`;
  };

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

  const downloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${proposal.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            background: #f3f4f6;
            padding: 20px;
        }
        .slide {
            width: 1200px;
            height: 675px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            page-break-after: always;
            position: relative;
            overflow: hidden;
        }
        .gradient-marketing {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .gradient-creative {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .slide-number {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.5);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
        }
        .title-slide {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 80px;
            color: white;
            position: relative;
        }
        .title-slide .icon {
            font-size: 120px;
            margin-bottom: 30px;
        }
        .title-slide h1 {
            font-size: 72px;
            font-weight: 900;
            margin-bottom: 30px;
        }
        .title-slide p {
            font-size: 36px;
            margin-bottom: 60px;
            opacity: 0.9;
        }
        .title-slide .divider {
            width: 120px;
            height: 4px;
            background: rgba(255,255,255,0.5);
            margin: 0 auto 30px;
        }
        .content-slide {
            padding: 80px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }
        .content-slide .header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 60px;
        }
        .content-slide .icon {
            font-size: 64px;
        }
        .content-slide h2 {
            font-size: 56px;
            font-weight: 900;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .bullet-item {
            display: flex;
            align-items: start;
            gap: 24px;
            padding: 24px;
            margin-bottom: 24px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .bullet-number {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 900;
            flex-shrink: 0;
        }
        .bullet-text {
            flex: 1;
            font-size: 24px;
            line-height: 1.6;
            color: #333;
        }
        .highlight-slide {
            padding: 80px;
            background: linear-gradient(135deg, #faf5ff 0%, #fff0f5 100%);
        }
        .highlight-item {
            display: flex;
            align-items: start;
            gap: 24px;
            padding: 32px;
            margin-bottom: 24px;
            background: rgba(255,255,255,0.9);
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .highlight-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 900;
            flex-shrink: 0;
        }
        .highlight-text {
            flex: 1;
            font-size: 28px;
            font-weight: 600;
            line-height: 1.6;
            color: #1a1a1a;
        }
        .closing-slide {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 80px;
            color: white;
            position: relative;
        }
        .closing-slide .icon {
            font-size: 120px;
            margin-bottom: 30px;
        }
        .closing-slide h2 {
            font-size: 72px;
            font-weight: 900;
            margin-bottom: 40px;
        }
        .closing-slide p {
            font-size: 32px;
            line-height: 1.6;
            margin-bottom: 60px;
            opacity: 0.9;
        }
        .closing-slide .divider {
            width: 120px;
            height: 4px;
            background: rgba(255,255,255,0.5);
            margin: 0 auto 30px;
        }
        .closing-slide .brand {
            font-size: 28px;
            font-weight: 900;
        }
        .closing-slide .tagline {
            font-size: 20px;
            margin-top: 10px;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .slide {
                margin: 0;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    ${proposal.slides
      .map(
        (slide, idx) => {
          // content를 안전하게 문자열로 변환
          const contentText = typeof slide.content === 'string'
            ? slide.content
            : Array.isArray(slide.content)
            ? slide.content.join('\n')
            : String(slide.content || '');

          const lines = contentText.split("\n").filter(line => line.trim());
          const icon = getSlideIcon(slide.type);

          return `
    <div class="slide">
        ${
          slide.type === "title"
            ? `
        <div class="title-slide gradient-marketing">
            <div class="icon">${icon}</div>
            <h1>${slide.heading}</h1>
            <p>${contentText}</p>
            <div class="divider"></div>
            <p style="font-size: 24px; opacity: 0.7;">${new Date().toLocaleDateString(
              "ko-KR"
            )}</p>
        </div>
        `
            : slide.type === "image-content"
            ? `
        <div class="highlight-slide">
            <div class="header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 60px;">
                <div class="icon" style="font-size: 80px;">${icon}</div>
                <h2 style="font-size: 56px; font-weight: 900; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${slide.heading}</h2>
            </div>
            ${lines
              .map(
                (line, lineIdx) => `
            <div class="highlight-item">
                <div class="highlight-icon">✓</div>
                <div class="highlight-text">${line}</div>
            </div>
            `
              )
              .join("")}
        </div>
        `
            : slide.type === "closing"
            ? `
        <div class="closing-slide gradient-creative">
            <div class="icon">${icon}</div>
            <h2>${slide.heading}</h2>
            <p style="white-space: pre-line;">${contentText}</p>
            <div class="divider"></div>
            <div>
                <div class="brand">Wiz Works</div>
                <div class="tagline">AI로 업무를 혁신하세요</div>
            </div>
        </div>
        `
            : `
        <div class="content-slide">
            <div class="header">
                <div class="icon">${icon}</div>
                <h2>${slide.heading}</h2>
            </div>
            ${lines.length > 0
              ? lines
                  .map(
                    (line, lineIdx) => `
            <div class="bullet-item">
                <div class="bullet-number">${lineIdx + 1}</div>
                <div class="bullet-text">${line}</div>
            </div>
            `
                  )
                  .join("")
              : `<div class="bullet-text">${contentText}</div>`}
        </div>
        `
        }
        <div class="slide-number">${idx + 1} / ${proposal.slides.length}</div>
    </div>
    `;
        }
      )
      .join("")}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateFileName("html");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!proposalRef.current) return;

    setIsGenerating(true);
    try {
      const element = proposalRef.current;

      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 0,
        removeContainer: true,
        allowTaint: false,
        foreignObjectRendering: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1200, 675], // 16:9 비율
        compress: false,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / 4;
      const imgHeight = canvas.height / 4;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = (pdfHeight - finalHeight) / 2;

      let heightLeft = finalHeight;
      let position = imgY;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        position,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - finalHeight + imgY;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          position,
          finalWidth,
          finalHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pdfHeight;
      }

      pdf.save(generateFileName("pdf"));
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={downloadHTML}
        className="group flex items-center gap-2 px-6 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200 dark:border-gray-700"
      >
        <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>HTML 다운로드</span>
      </button>

      <button
        onClick={downloadPDF}
        disabled={isGenerating}
        className="group flex items-center gap-2 px-6 py-3 gradient-creative text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>PDF 생성 중...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            <span>PDF 다운로드</span>
          </>
        )}
      </button>
    </div>
  );
}
