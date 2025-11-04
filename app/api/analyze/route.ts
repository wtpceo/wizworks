import { NextRequest, NextResponse } from "next/server";
import { analyzeData } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { data, prompt, images } = await request.json();

    // 데이터 또는 이미지 중 하나는 필수
    if (!data && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: "데이터 또는 이미지가 필요합니다." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    console.log("Analysis request:", {
      hasData: !!data,
      imageCount: images?.length || 0,
      prompt: prompt || "주요 트렌드와 인사이트를 찾아주세요.",
    });

    const result = await analyzeData(
      data || "",
      prompt || "주요 트렌드와 인사이트를 찾아주세요.",
      images
    );

    console.log("Analysis completed successfully");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    // 에러 메시지를 더 자세히 표시
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json(
      { error: `분석 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
