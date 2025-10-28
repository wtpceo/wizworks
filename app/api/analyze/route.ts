import { NextRequest, NextResponse } from "next/server";
import { analyzeData } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { data, prompt } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: "데이터가 필요합니다." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const result = await analyzeData(
      data,
      prompt || "주요 인사이트를 찾아주세요."
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
