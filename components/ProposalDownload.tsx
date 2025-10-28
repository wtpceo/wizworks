"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ProposalSection {
  heading: string;
  content: string;
}

interface Proposal {
  title: string;
  sections: ProposalSection[];
  executiveSummary: string;
  timeline: string;
  budget: string;
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
    return `제안서-${dateStr}-${timeStr}.${extension}`;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            color: #333;
            line-height: 1.8;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            font-size: 48px;
            font-weight: 900;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
        }
        .header p {
            color: #666;
            font-size: 16px;
        }
        .section {
            margin: 40px 0;
            padding: 30px;
            border-radius: 15px;
        }
        .section h2 {
            font-size: 28px;
            margin-bottom: 20px;
            color: #667eea;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section p, .section div {
            font-size: 16px;
            line-height: 1.8;
            color: #555;
            white-space: pre-wrap;
        }
        .summary {
            background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
            border-left: 5px solid #3b82f6;
        }
        .content-section {
            background: #f8f9fa;
            border-left: 5px solid #a855f7;
        }
        .timeline {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left: 5px solid #10b981;
        }
        .budget {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 5px solid #f59e0b;
        }
        .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #666;
            font-size: 14px;
        }
        .icon {
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ ${proposal.title}</h1>
            <p>생성 날짜: ${new Date().toLocaleDateString("ko-KR")}</p>
        </div>

        ${
          proposal.executiveSummary
            ? `
        <div class="section summary">
            <h2><span class="icon">📋</span> 요약</h2>
            <p>${proposal.executiveSummary}</p>
        </div>
        `
            : ""
        }

        ${proposal.sections
          .map(
            (section) => `
        <div class="section content-section">
            <h2><span class="icon">▶</span> ${section.heading}</h2>
            <div>${section.content}</div>
        </div>
        `
          )
          .join("")}

        ${
          proposal.timeline
            ? `
        <div class="section timeline">
            <h2><span class="icon">📅</span> 일정</h2>
            <p>${proposal.timeline}</p>
        </div>
        `
            : ""
        }

        ${
          proposal.budget
            ? `
        <div class="section budget">
            <h2><span class="icon">💰</span> 예산</h2>
            <p>${proposal.budget}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
            <p>본 제안서는 <strong>Wiz Works</strong> AI 시스템으로 자동 생성되었습니다</p>
            <p style="margin-top: 10px; color: #999; font-size: 12px;">생성 시간: ${new Date().toLocaleString(
              "ko-KR"
            )}</p>
        </div>
    </div>
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
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: false,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / 4;
      const imgHeight = canvas.height / 4;

      const ratio = Math.min(
        (pdfWidth - 40) / imgWidth,
        (pdfHeight - 40) / imgHeight
      );

      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = 20;

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

      heightLeft -= pdfHeight - 40;

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
        heightLeft -= pdfHeight - 40;
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
