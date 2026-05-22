import Anthropic from "@anthropic-ai/sdk";
import { extractJSON } from "@/lib/utils";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a business valuation expert. Given business type, annual gross revenue, and years in operation, return a JSON valuation estimate: {"low_estimate": number, "high_estimate": number, "sde_estimate": number, "multiple_used": string, "methodology_note": string}. Base multiples on current market data: service businesses 1.5-3.5x SDE, retail 1.5-2.5x, restaurants 1.0-2.0x. SDE is typically 15-35% of gross revenue depending on business type and maturity. Respond with valid JSON only — no markdown, no explanation outside the JSON.`;

export async function POST(req: Request) {
  try {
    const { business_type, revenue, years_in_operation } = await req.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Business type: ${business_type}\nAnnual gross revenue: $${Number(revenue).toLocaleString()}\nYears in operation: ${years_in_operation}\n\nProvide valuation estimate as JSON only.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonStr = extractJSON(text);
    const valuation = JSON.parse(jsonStr);

    return Response.json(valuation);
  } catch (err) {
    console.error("[valuation]", err);
    return Response.json(
      { error: "Valuation failed" },
      { status: 500 }
    );
  }
}
