"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, extractJSON } from "@/lib/utils";
import type { BuyerProfile, Listing, DDReport } from "@/lib/types";
import { MapPin, DollarSign, TrendingUp, ChevronDown, ChevronUp, Loader2, AlertTriangle } from "lucide-react";

const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    name: "Cascade Pest Solutions",
    type: "Pest Control",
    askingPrice: 425000,
    revenue: 180000,
    location: "Bellevue, WA",
    fitScore: 87,
    description:
      "Established residential and commercial pest control serving King County since 2011. Strong recurring revenue base with 340+ active contracts. Fully licensed, 3 technicians included.",
  },
  {
    id: "2",
    name: "Harbor Clean Coin Laundry",
    type: "Laundromat",
    askingPrice: 280000,
    revenue: 145000,
    location: "Tacoma, WA",
    fitScore: 72,
    description:
      "Well-maintained 28-machine coin laundromat with a loyal neighborhood customer base. Low owner involvement — currently runs ~8 hrs/week of owner time. Long-term lease with 5-yr renewal option.",
  },
];

function fitScoreColor(score: number) {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function riskColor(score: number) {
  if (score <= 3) return "bg-green-500";
  if (score <= 6) return "bg-yellow-500";
  return "bg-red-500";
}

interface ListingCardProps {
  listing: Listing;
  profile: BuyerProfile | null;
}

function ListingCard({ listing, profile }: ListingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [report, setReport] = useState<DDReport | null>(null);
  const [error, setError] = useState("");

  const generateReport = async () => {
    if (report) { setExpanded((e) => !e); return; }
    setExpanded(true);
    setStreaming(true);
    setStreamedText("");
    setError("");

    try {
      const res = await fetch("/api/dd-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyer_profile: profile, listing }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamedText(full);
      }

      const jsonStr = extractJSON(full);
      const parsed: DDReport = JSON.parse(jsonStr);
      setReport(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{listing.name}</CardTitle>
              <Badge className={fitScoreColor(listing.fitScore)}>
                {listing.fitScore}% fit
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">{listing.type}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-[#185FA5] shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Asking</div>
              <div className="font-semibold">{formatCurrency(listing.askingPrice)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-[#185FA5] shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Revenue</div>
              <div className="font-semibold">{formatCurrency(listing.revenue)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-[#185FA5] shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="font-semibold">{listing.location}</div>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          variant="outline"
          className="w-full border-[#185FA5] text-[#185FA5] hover:bg-blue-50"
          onClick={generateReport}
          disabled={streaming}
        >
          {streaming ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating DD Report...</>
          ) : expanded && report ? (
            <><ChevronUp className="h-4 w-4 mr-2" />Hide AI Due Diligence Report</>
          ) : (
            <><ChevronDown className="h-4 w-4 mr-2" />View AI Due Diligence Report</>
          )}
        </Button>

        {/* Streaming raw output while generating */}
        {streaming && streamedText && (
          <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono text-green-400 max-h-40 overflow-auto">
            {streamedText}
            <span className="animate-pulse">▊</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Structured report */}
        {expanded && report && !streaming && (
          <div className="space-y-6 pt-2">
            <Separator />

            {/* Executive Summary */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Executive Summary
              </h4>
              <p className="text-sm leading-relaxed">{report.executive_summary}</p>
            </div>

            {/* Risk Scores */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Risk Scores
              </h4>
              <div className="space-y-3">
                {report.risk_scores?.map((r) => (
                  <div key={r.dimension}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{r.dimension}</span>
                      <span
                        className={`font-semibold ${
                          r.score <= 3 ? "text-green-600" : r.score <= 6 ? "text-yellow-600" : "text-red-600"
                        }`}
                      >
                        {r.score}/10
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all ${riskColor(r.score)}`}
                        style={{ width: `${r.score * 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SWOT */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                SWOT Analysis
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Strengths", items: report.swot?.strengths, color: "bg-green-50 border-green-200", textColor: "text-green-800" },
                  { label: "Weaknesses", items: report.swot?.weaknesses, color: "bg-red-50 border-red-200", textColor: "text-red-800" },
                  { label: "Opportunities", items: report.swot?.opportunities, color: "bg-blue-50 border-blue-200", textColor: "text-blue-800" },
                  { label: "Threats", items: report.swot?.threats, color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-800" },
                ].map((q) => (
                  <div key={q.label} className={`p-3 rounded-lg border ${q.color}`}>
                    <div className={`text-xs font-semibold uppercase mb-2 ${q.textColor}`}>{q.label}</div>
                    <ul className="space-y-1">
                      {q.items?.map((item, i) => (
                        <li key={i} className="text-xs leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch Out Items */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">
                Top 5 Things to Watch Out For
              </h4>
              <ol className="space-y-2">
                {report.watch_out_items?.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#185FA5] text-white text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Staffing Estimate (absentee only) */}
            {report.staffing_estimate && (
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  Staffing Estimate (WA State)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold text-muted-foreground">Role</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">FTE</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Rate Range</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Annual Est.</th>
                        <th className="text-left py-2 font-semibold text-muted-foreground">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.staffing_estimate.roles.map((role, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 font-medium">{role.title}</td>
                          <td className="py-2">{role.fte}</td>
                          <td className="py-2">{role.hourly_rate_range}</td>
                          <td className="py-2">{role.annual_cost_est}</td>
                          <td className="py-2">
                            <Badge variant={role.required === "Yes" ? "default" : "secondary"} className="text-xs">
                              {role.required}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t font-semibold">
                        <td className="py-2" colSpan={3}>Total Annual Staffing Cost</td>
                        <td className="py-2 text-[#185FA5]" colSpan={2}>
                          {report.staffing_estimate.total_annual_est}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BuyerResultsPage() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("buyer_profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Matched Listings</h1>
          <p className="text-muted-foreground mt-1">
            {profile
              ? `Based on your ${formatCurrency(profile.budget)} budget, ${profile.timeAvailable} hrs/week, and ${profile.ownerType} preference in ${profile.preferredState}.`
              : "Expand each listing below to generate a full AI due diligence report."}
          </p>
        </div>

        <div className="space-y-6">
          {MOCK_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} listing={listing} profile={profile} />
          ))}
        </div>
      </main>
    </>
  );
}
