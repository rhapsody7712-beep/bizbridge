import Anthropic from "@anthropic-ai/sdk";
import type { SellerQuestionnaire } from "@/lib/types";
import { extractJSON } from "@/lib/utils";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const q: SellerQuestionnaire = await req.json();

    const latestFinancial = q.financials?.[q.financials.length - 1];

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system:
        "You are a professional business listing copywriter specializing in small business acquisitions. Write a compelling, accurate, and professional 100-word business description for potential buyers. Be specific, factual, and trust-building. Respond with JSON: {\"summary\": string}. No markdown, no extra text.",
      messages: [
        {
          role: "user",
          content: `
Business type: ${q.sellerProfile?.businessType}
Location: ${q.sellerProfile?.cityState}
Years in operation: ${q.sellerProfile?.yearsInOperation}
Annual gross revenue: $${q.sellerProfile?.annualRevenue?.toLocaleString()}
Latest year gross revenue: ${latestFinancial?.grossRevenue ? `$${latestFinancial.grossRevenue}` : "not provided"}
Latest year SDE: ${latestFinancial?.sde ? `$${latestFinancial.sde}` : "not provided"}
Asking price: ${q.askingPrice}
Lease: ${q.leaseInfo}
Owner presence required: ${q.ownerPresence}
Seller reason: ${q.sellerProfile?.reasonForSelling}

Write a 100-word professional listing description as JSON {"summary": "..."}.
`.trim(),
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonStr = extractJSON(text);
    const { summary } = JSON.parse(jsonStr);

    return Response.json({ summary });
  } catch (err) {
    console.error("[seller-summary]", err);
    return Response.json(
      {
        summary:
          "This established business represents a compelling acquisition opportunity with a proven revenue model and motivated seller ready for a smooth transition.",
      },
      { status: 200 }
    );
  }
}
