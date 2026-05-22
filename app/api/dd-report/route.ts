import Anthropic from "@anthropic-ai/sdk";
import type { BuyerProfile, Listing } from "@/lib/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a Washington State licensed business broker and M&A advisor with 20 years of experience. Given a buyer profile and business listing, generate a structured due diligence report. Always respond in valid JSON matching this exact schema: {"executive_summary": string, "risk_scores": [{"dimension": string, "score": number, "rationale": string}], "swot": {"strengths": string[], "weaknesses": string[], "opportunities": string[], "threats": string[]}, "watch_out_items": string[], "staffing_estimate"?: {"roles": [{"title": string, "fte": number, "hourly_rate_range": string, "annual_cost_est": string, "required": string}], "total_annual_est": string}}. Risk score dimensions: Financial Health, Market Position, Operational Complexity, Legal & Compliance, Owner Dependency, Exit Liquidity. Score 1 = low risk, 10 = high risk.`;

export async function POST(req: Request) {
  try {
    const { buyer_profile, listing }: { buyer_profile: BuyerProfile; listing: Listing } =
      await req.json();

    const includeStaffing = buyer_profile?.ownerType === "absentee";

    const userPrompt = `
Buyer Profile:
- Budget: $${buyer_profile?.budget?.toLocaleString() ?? "unknown"}
- Time available: ${buyer_profile?.timeAvailable ?? "unknown"} hrs/week
- Owner type preference: ${buyer_profile?.ownerType ?? "unknown"}
- Industry interest: ${buyer_profile?.industry ?? "unknown"}
- Priority: ${buyer_profile?.priority ?? "unknown"}
- Preferred state: ${buyer_profile?.preferredState ?? "WA"}

Business Listing:
- Name: ${listing.name}
- Type: ${listing.type}
- Location: ${listing.location}
- Asking price: $${listing.askingPrice.toLocaleString()}
- Annual revenue: $${listing.revenue.toLocaleString()}
- Description: ${listing.description}

${includeStaffing ? "IMPORTANT: The buyer wants full absentee ownership. Include a staffing_estimate section with all roles needed to run this business without the owner, with Washington State wage estimates." : "Do not include a staffing_estimate section."}

Generate the full due diligence report as valid JSON only — no markdown, no extra text.
`.trim();

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[dd-report]", err);
    return Response.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
