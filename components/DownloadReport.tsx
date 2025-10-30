"use client";

import { useState } from "react";
import { Download, FileText, FileType } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ReportMetadata {
  companyName: string;
  department: string;
  authorName: string;
  targetCompany: string;
  reportTitle: string;
  reportPeriod?: string;
}

interface DownloadReportProps {
  reportRef: React.RefObject<HTMLDivElement>;
  data: {
    insights: string[];
    summary: string;
    chartData: Array<{ name: string; value: number }>;
    recommendations: string[];
    metadata?: ReportMetadata;
  };
}

export default function DownloadReport({ reportRef, data }: DownloadReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFileName = (extension: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const title = data.metadata?.reportTitle
      ? data.metadata.reportTitle.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '-')
      : 'report';
    return `${title}-${dateStr}-${timeStr}.${extension}`;
  };

  const downloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wiz Works - 시각화 보고서</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            font-size: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
            text-align: center;
        }
        .header p {
            color: #666;
            font-size: 18px;
            text-align: center;
        }
        .metadata {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .metadata-item {
            display: flex;
            gap: 10px;
        }
        .metadata-label {
            font-weight: bold;
            color: #667eea;
            min-width: 100px;
        }
        .metadata-value {
            color: #333;
        }
        .section {
            margin: 30px 0;
            padding: 25px;
            border-radius: 15px;
            background: #f8f9fa;
        }
        .section h2 {
            font-size: 28px;
            margin-bottom: 20px;
            color: #667eea;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .summary {
            background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
            border-left: 5px solid #3b82f6;
        }
        .insights {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 5px solid #f59e0b;
        }
        .recommendations {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left: 5px solid #10b981;
        }
        .chart-data {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border-left: 5px solid #a855f7;
        }
        .insight-item, .recommendation-item {
            padding: 15px;
            margin: 10px 0;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .insight-item {
            display: flex;
            gap: 15px;
            align-items: start;
        }
        .insight-number {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        .recommendation-item {
            padding-left: 30px;
            position: relative;
        }
        .recommendation-item:before {
            content: "✓";
            position: absolute;
            left: 10px;
            color: #10b981;
            font-weight: bold;
            font-size: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: bold;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #666;
            font-size: 14px;
        }
        .timestamp {
            color: #999;
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 ${data.metadata?.reportTitle || 'Wiz Works 분석 보고서'}</h1>
            <p>AI 기반 데이터 분석 보고서</p>
            ${data.metadata ? `
            <div class="metadata">
                <div class="metadata-item">
                    <span class="metadata-label">회사명:</span>
                    <span class="metadata-value">${data.metadata.companyName}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">부서명:</span>
                    <span class="metadata-value">${data.metadata.department}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">작성자:</span>
                    <span class="metadata-value">${data.metadata.authorName}</span>
                </div>
                <div class="metadata-item">
                    <span class="metadata-label">대상 업체:</span>
                    <span class="metadata-value">${data.metadata.targetCompany}</span>
                </div>
                ${data.metadata.reportPeriod ? `
                <div class="metadata-item">
                    <span class="metadata-label">보고 기간:</span>
                    <span class="metadata-value">${data.metadata.reportPeriod}</span>
                </div>
                ` : ''}
                <div class="metadata-item">
                    <span class="metadata-label">작성일:</span>
                    <span class="metadata-value">${new Date().toLocaleDateString('ko-KR')}</span>
                </div>
            </div>
            ` : ''}
        </div>

        ${data.summary ? `
        <div class="section summary">
            <h2>📈 핵심 요약</h2>
            <p style="font-size: 16px; line-height: 1.8;">${data.summary}</p>
        </div>
        ` : ''}

        ${data.insights && data.insights.length > 0 ? `
        <div class="section insights">
            <h2>💡 주요 인사이트</h2>
            ${data.insights.map((insight, index) => `
                <div class="insight-item">
                    <div class="insight-number">${index + 1}</div>
                    <p style="flex: 1; line-height: 1.6;">${insight}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${data.chartData && data.chartData.length > 0 ? `
        <div class="section chart-data">
            <h2>📊 데이터 테이블</h2>
            <table>
                <thead>
                    <tr>
                        <th>항목</th>
                        <th>값</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.chartData.map(item => `
                        <tr>
                            <td><strong>${item.name}</strong></td>
                            <td>${item.value.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}

        ${data.recommendations && data.recommendations.length > 0 ? `
        <div class="section recommendations">
            <h2>🎯 액션 아이템</h2>
            ${data.recommendations.map(rec => `
                <div class="recommendation-item">
                    <p style="line-height: 1.6;">${rec}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Wiz Works</strong> - AI로 업무를 자동화하고 시각화 보고서를 생성하세요</p>
            <p class="timestamp">생성 시간: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateFileName('html');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    try {
      const element = reportRef.current;

      // 고해상도 캡처 (4배 스케일)
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: true,
        allowTaint: false,
        foreignObjectRendering: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // PNG로 변환 (최고 품질)
      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        compress: false,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / 4; // scale 4로 나눔
      const imgHeight = canvas.height / 4;

      // A4 용지에 맞게 비율 계산
      const ratio = Math.min(
        (pdfWidth - 40) / imgWidth,
        (pdfHeight - 40) / imgHeight
      );

      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const imgX = (pdfWidth - finalWidth) / 2;
      const imgY = 20;

      // 다중 페이지 처리
      let heightLeft = finalHeight;
      let position = imgY;
      let page = 1;

      // 첫 페이지
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        position,
        finalWidth,
        finalHeight,
        undefined,
        'FAST'
      );

      heightLeft -= (pdfHeight - 40);

      // 추가 페이지가 필요한 경우
      while (heightLeft > 0) {
        position = heightLeft - finalHeight + imgY;
        pdf.addPage();
        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          position,
          finalWidth,
          finalHeight,
          undefined,
          'FAST'
        );
        heightLeft -= (pdfHeight - 40);
        page++;
      }

      pdf.save(generateFileName('pdf'));
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
        className="group flex items-center gap-2 px-6 py-3 gradient-marketing text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
