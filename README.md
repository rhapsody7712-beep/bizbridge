# BizBridge — AI-Powered Business Acquisition Marketplace

A full-stack Next.js 14 POC for buying and selling traditional businesses, with live Claude-powered due diligence reports, instant valuations, and AI-generated listing descriptions.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Anthropic SDK** (claude-sonnet-4-6)
- **In-memory state** via localStorage (no database)

## Setup

### 1. Install dependencies

```bash
cd bizbridge
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## The 6 Screens

| Route | Screen |
|---|---|
| `/` | Home — role selector (Buy / Sell) |
| `/buyer/intake` | Buyer intake — 3-step form (budget, industry, owner type) |
| `/buyer/results` | Buyer results — matched listings + live streaming DD report |
| `/seller/intake` | Seller intake — 5-field form + instant valuation |
| `/seller/questionnaire` | Seller questionnaire — full listing details |
| `/seller/preview` | Seller listing preview + AI description + Go Live |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/dd-report` | POST | Streams a full due diligence report via Claude (JSON, streamed) |
| `/api/valuation` | POST | Returns SDE multiple valuation estimate (JSON) |
| `/api/seller-summary` | POST | Returns AI-generated 100-word listing description (JSON) |

## Buyer Flow

1. Go to `/buyer/intake` — fill out 3-step form
2. Submit → redirected to `/buyer/results`
3. Click **View AI Due Diligence Report** on any listing
4. Watch the Claude response stream in real time
5. Report renders: executive summary, risk scores, SWOT, watch-out items
6. If absentee owner selected: staffing estimate table included automatically

## Seller Flow

1. Go to `/seller/intake` — 5 fields, submit
2. Instant valuation appears: `$X – $Y` with SDE multiple and methodology
3. Click **Continue to full questionnaire**
4. Fill out `/seller/questionnaire` — financials table, lease, owner presence, documents
5. Submit → `/seller/preview`
6. AI-generated listing description loads automatically
7. Click **Go Live** → success toast

## DD Report Structure

```json
{
  "executive_summary": "3-sentence summary",
  "risk_scores": [
    { "dimension": "Financial Health", "score": 4, "rationale": "..." },
    { "dimension": "Market Position", "score": 3, "rationale": "..." },
    { "dimension": "Operational Complexity", "score": 5, "rationale": "..." },
    { "dimension": "Legal & Compliance", "score": 2, "rationale": "..." },
    { "dimension": "Owner Dependency", "score": 7, "rationale": "..." },
    { "dimension": "Exit Liquidity", "score": 4, "rationale": "..." }
  ],
  "swot": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "opportunities": ["..."],
    "threats": ["..."]
  },
  "watch_out_items": ["1...", "2...", "3...", "4...", "5..."],
  "staffing_estimate": {
    "roles": [
      { "title": "General Manager", "fte": 1, "hourly_rate_range": "$28-35/hr", "annual_cost_est": "$62,000", "required": "Yes" }
    ],
    "total_annual_est": "$95,000"
  }
}
```

## Project Structure

```
bizbridge/
├── app/
│   ├── page.tsx                      # Home
│   ├── layout.tsx
│   ├── globals.css
│   ├── buyer/
│   │   ├── intake/page.tsx           # 3-step buyer form
│   │   └── results/page.tsx          # Listings + streaming DD report
│   ├── seller/
│   │   ├── intake/page.tsx           # Quick valuation form
│   │   ├── questionnaire/page.tsx    # Full listing questionnaire
│   │   └── preview/page.tsx          # Listing preview + go live
│   └── api/
│       ├── dd-report/route.ts        # Streaming Claude DD report
│       ├── valuation/route.ts        # Claude valuation estimate
│       └── seller-summary/route.ts   # Claude listing description
├── components/
│   ├── nav.tsx
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── types.ts
│   └── utils.ts
└── README.md
```

## Notes

- All state is stored in `localStorage` — refreshing the browser preserves data within a session
- The DD report streams raw JSON from Claude and renders the structured report once complete
- Absentee owner type triggers the staffing estimate section in the DD report automatically
- The seller-summary API gracefully falls back to a default description if Claude is unavailable
