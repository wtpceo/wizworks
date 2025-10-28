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

    const systemPrompt = `당신은 전문적인 제안서 작성 전문가입니다.
사용자와의 대화 내용을 바탕으로 다음 형식의 제안서를 JSON 형태로 생성하세요.

제안서는 다음 구조를 가져야 합니다:
{
  "title": "제안서 제목",
  "executiveSummary": "요약 (프로젝트의 핵심 내용을 간략히)",
  "sections": [
    {
      "heading": "섹션 제목",
      "content": "섹션 내용"
    }
  ],
  "timeline": "프로젝트 일정",
  "budget": "예산 개요"
}

섹션은 다음을 포함해야 합니다:
1. 프로젝트 개요 및 배경
2. 목표 및 기대효과
3. 제안 내용 (구체적인 실행 방안)
4. 기술 스택 및 방법론
5. 팀 구성 및 역할
6. 리스크 관리

각 섹션의 내용은 구체적이고 전문적으로 작성하세요.
모든 내용은 한국어로 작성하세요.
반드시 유효한 JSON 형식으로만 응답하세요.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
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
        executiveSummary: "대화 내용을 바탕으로 생성된 제안서입니다.",
        sections: [
          {
            heading: "제안 내용",
            content: responseText,
          },
        ],
        timeline: "협의 필요",
        budget: "협의 필요",
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
