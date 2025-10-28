import Anthropic from "@anthropic-ai/sdk";

// Claude 클라이언트 초기화
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// 데이터 분석 및 인사이트 생성
export async function analyzeData(data: string, prompt: string) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `다음 데이터를 분석하고 ${prompt}

데이터:
${data}

JSON 형식으로 다음 정보를 제공해주세요:
1. insights: 데이터에서 발견한 주요 인사이트 배열
2. summary: 전체 데이터에 대한 요약
3. chartData: 시각화를 위한 데이터 배열 (각 항목은 {name: string, value: number} 형식)
4. recommendations: 데이터 기반 추천사항 배열`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      // JSON 추출 (코드 블록 제거)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content.text);
    }

    throw new Error("Unexpected response format");
  } catch (error) {
    console.error("Claude API Error:", error);
    throw error;
  }
}

// 보고서 생성을 위한 스트리밍 응답
export async function generateReport(
  data: string,
  reportType: "summary" | "detailed" | "presentation"
) {
  const prompts = {
    summary: "간단한 요약 보고서를 작성해주세요.",
    detailed: "상세한 분석 보고서를 작성해주세요. 각 데이터 포인트를 깊이 있게 분석하고 비즈니스 관점에서의 시사점을 포함해주세요.",
    presentation: "프레젠테이션용 보고서를 작성해주세요. 핵심 메시지와 시각적 요소를 강조해주세요.",
  };

  return anthropic.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `다음 데이터를 기반으로 ${prompts[reportType]}

데이터:
${data}`,
      },
    ],
  });
}
