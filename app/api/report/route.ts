import { NextRequest } from "next/server";
import { generateReport } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { data, reportType } = await request.json();

    if (!data) {
      return new Response("데이터가 필요합니다.", { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response("ANTHROPIC_API_KEY가 설정되지 않았습니다.", {
        status: 500,
      });
    }

    const stream = await generateReport(data, reportType || "summary");

    // 스트리밍 응답 생성
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const text = chunk.delta.text;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return new Response("보고서 생성 중 오류가 발생했습니다.", {
      status: 500,
    });
  }
}
