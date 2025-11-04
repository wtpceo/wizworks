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
    const { chatHistory, documentContent } = await request.json();

    if (!chatHistory || chatHistory.length === 0) {
      return NextResponse.json(
        { error: "대화 내용이 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    // 대화 내용 요약
    const conversationSummary = chatHistory
      .map((msg: ChatMessage) => `${msg.role}: ${msg.content}`)
      .join("\n\n");

    const systemPrompt = `당신은 전문적인 프레젠테이션 제안서 작성 전문가입니다.
사용자와의 대화 내용을 바탕으로 임팩트 있는 프레젠테이션 제안서를 JSON 형태로 생성하세요.

제안서는 다음 구조를 가져야 합니다:
{
  "title": "제안서 제목",
  "subtitle": "부제목 (간단한 설명)",
  "slides": [
    {
      "slideNumber": 1,
      "type": "title" | "content" | "image-content" | "chart" | "closing",
      "heading": "슬라이드 제목",
      "content": "슬라이드 본문 (간결하게, 각 줄은 \\n로 구분, 3-5개 불릿 포인트)",
      "chartData": {
        "type": "bar" | "pie" | "line",
        "data": [{"name": "항목", "value": 숫자}],
        "title": "차트 제목"
      }
    }
  ]
}

슬라이드 구성 (8-12개):
1. 표지 (title): 제목, 부제목 - 한 줄로 간결하게
2. 요약 (content): 핵심 내용 3-5개 포인트
3. 배경 및 필요성 (image-content): 강조할 내용 3-4개 포인트
4. 목표 (content): 프로젝트 목표 3-5개
5. 제안 내용 (image-content): 솔루션 제안 3-4개
6. 기대효과 (chart): 정량적 효과를 차트로 (실제 데이터 포함)
7. 실행 방안 (content): 구체적 실행 계획 3-5개
8. 일정 (chart 또는 content): 타임라인
9. 예산 (chart 또는 content): 예산 내역
10. 팀 소개 (content, 선택): 팀 구성
11. 마무리 (closing): 감사 및 주요 메시지

각 슬라이드는:
- **제목**: 간결하고 임팩트 있게 (5-8단어)
- **내용**: 각 포인트는 한 줄로, \\n으로 구분
- **content 형식**: "첫 번째 포인트\\n두 번째 포인트\\n세 번째 포인트"
- **차트가 필요한 경우**: 실제 데이터를 포함하여 chartData 제공

주의사항:
- content는 반드시 문자열로, 배열 사용 금지
- 각 불릿 포인트는 \\n으로 구분
- 차트 데이터는 구체적인 숫자 포함
- 모든 내용은 한국어로 작성

반드시 유효한 JSON 형식으로만 응답하세요.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `다음은 클라이언트와의 대화 내용입니다. 이를 바탕으로 전문적인 제안서를 작성해주세요:\n\n${conversationSummary}`,
        },
      ],
    });

    const assistantMessage = response.content[0];
    const responseText =
      assistantMessage.type === "text" ? assistantMessage.text : "";

    // JSON 추출 (```json 블록이 있을 경우 처리)
    let proposalData;
    try {
      // ```json으로 감싸진 경우 처리
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      proposalData = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      // 파싱 실패 시 기본 구조로 폴백
      proposalData = {
        title: "프로젝트 제안서",
        subtitle: "AI로 생성된 프레젠테이션",
        slides: [
          {
            slideNumber: 1,
            type: "title",
            heading: "프로젝트 제안서",
            content: "대화 내용을 바탕으로 생성되었습니다",
          },
          {
            slideNumber: 2,
            type: "content",
            heading: "제안 내용",
            content: responseText,
          },
        ],
      };
    }

    return NextResponse.json({
      proposal: proposalData,
    });
  } catch (error) {
    console.error("Proposal generation error:", error);
    return NextResponse.json(
      { error: "제안서 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
