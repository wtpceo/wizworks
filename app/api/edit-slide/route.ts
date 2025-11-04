import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { slideContent, editMessages, slideType } = await request.json();

    if (!editMessages || editMessages.length === 0) {
      return NextResponse.json(
        { error: "수정 요청이 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    const systemPrompt = `당신은 프레젠테이션 슬라이드 수정 전문가입니다.

사용자의 요청에 따라 슬라이드 내용을 수정하세요.

슬라이드 타입: ${slideType}

수정된 슬라이드는 다음 JSON 형식으로만 응답하세요:
{
  "heading": "슬라이드 제목",
  "content": "슬라이드 본문 (각 줄은 \\n로 구분)",
  "chartData": {
    "type": "bar" | "pie" | "line",
    "data": [{"name": "항목", "value": 숫자}],
    "title": "차트 제목"
  }
}

주의사항:
- content는 반드시 문자열로, 각 불릿 포인트는 \\n으로 구분
- chartData는 차트 슬라이드(type="chart")일 때만 포함
- 모든 내용은 한국어로 작성
- 사용자의 수정 요청을 정확히 반영

반드시 유효한 JSON 형식으로만 응답하세요.`;

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: `현재 슬라이드 내용:\n${JSON.stringify(slideContent, null, 2)}\n\n다음과 같이 수정해주세요:`,
      },
      ...editMessages,
    ];

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
    });

    const assistantMessage = response.content[0];
    const responseText =
      assistantMessage.type === "text" ? assistantMessage.text : "";

    // JSON 추출
    let updatedSlide;
    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      updatedSlide = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      return NextResponse.json(
        { error: "슬라이드 수정 응답 파싱 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      updatedSlide,
      assistantResponse: responseText,
    });
  } catch (error) {
    console.error("Slide edit error:", error);
    return NextResponse.json(
      { error: "슬라이드 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
