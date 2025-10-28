import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wiz Works - AI 업무 자동화",
  description: "Claude API를 활용한 시각화 보고서 생성 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
