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
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "메시지가 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    // Claude API 메시지 형식으로 변환
    const claudeMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }));

    const systemPrompt = `당신은 전문적인 PRD(Product Requirements Document) 작성을 돕는 AI 어시스턴트입니다.

사용자와 대화하며 다음 정보를 수집하고 정리합니다:

1. **프로젝트 개요**
   - 프로젝트명
   - 목적 및 배경
   - 주요 목표

2. **요구사항**
   - 기능 요구사항
   - 비기능 요구사항
   - 제약사항

3. **대상 사용자**
   - 타겟 고객/사용자
   - 사용자 니즈

4. **범위**
   - 포함 사항
   - 제외 사항

5. **일정 및 예산**
   - 프로젝트 일정
   - 마일스톤
   - 예산 범위

6. **성공 지표**
   - KPI
   - 측정 방법

대화할 때:
- 친근하고 전문적인 톤을 유지하세요
- 필요한 정보를 명확히 질문하세요
- 사용자의 답변을 정리하고 확인하세요
- 추가로 고려해야 할 사항을 제안하세요
- 한국어로 응답하세요`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const assistantMessage = response.content[0];
    const responseText =
      assistantMessage.type === "text" ? assistantMessage.text : "";

    // 대화 내용을 바탕으로 문서 내용 추출
    const documentContent = extractDocumentContent(messages, responseText);

    return NextResponse.json({
      response: responseText,
      documentContent,
    });
  } catch (error) {
    console.error("Proposal chat error:", error);
    return NextResponse.json(
      { error: "채팅 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 대화 내용에서 문서 내용 추출
function extractDocumentContent(
  messages: ChatMessage[],
  latestResponse: string
): string {
  const allContent = messages
    .map((msg) => `${msg.role === "user" ? "사용자" : "AI"}: ${msg.content}`)
    .join("\n\n");

  return `${allContent}\n\nAI: ${latestResponse}`;
}
