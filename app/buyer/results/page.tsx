"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, extractJSON } from "@/lib/utils";
import { getScoredListings } from "@/lib/fitScore";
import type { BuyerProfile, Listing, DDReport } from "@/lib/types";
import {
  MapPin, DollarSign, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronUp, Loader2, AlertTriangle,
  Users, Clock, Building2, BarChart3, Sparkles,
} from "lucide-react";

// ── helpers ────────────────────────────────────────────────────────────────

function fitBadge(score: number) {
  if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
}

function fitLabel(score: number) {
  if (score >= 80) return "Strong fit";
  if (score >= 60) return "Good fit";
  if (score >= 40) return "Partial fit";
  return "Low fit";
}

function riskBarColor(score: number) {
  if (score <= 3) return "bg-green-500";
  if (score <= 6) return "bg-yellow-500";
  return "bg-red-500";
}

function GrowthBadge({ trend }: { trend: Listing["growthTrend"] }) {
  if (trend === "growing")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
        <TrendingUp className="h-3 w-3" /> Growing
      </span>
    );
  if (trend === "declining")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        <TrendingDown className="h-3 w-3" /> Declining
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
      <Minus className="h-3 w-3" /> Stable
    </span>
  );
}

// ── Match Summary bar ──────────────────────────────────────────────────────

function MatchSummary({ listings, profile }: { listings: Listing[]; profile: BuyerProfile }) {
  const inBudget = listings.filter((l) => l.askingPrice <= profile.budget).length;
  const strongFit = listings.filter((l) => l.fitScore >= 70).length;
  const industryMatch = listings.filter(
    (l) => l.type.toLowerCase().includes(profile.industry.toLowerCase()) ||
           profile.industry.toLowerCase().includes(l.type.toLowerCase()) ||
           profile.industry === "Other"
  ).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: "Within Budget", value: inBudget, total: listings.length, color: "text-green-600" },
        { label: "Strong Fit (70+)", value: strongFit, total: listings.length, color: "text-[#185FA5]" },
        { label: "Industry Match", value: industryMatch, total: listings.length, color: "text-purple-600" },
      ].map((stat) => (
        <div key={stat.label} className="bg-white border rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}/{stat.total}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Listing Card ──────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: Listing;
  profile: BuyerProfile | null;
  rank: number;
}

function ListingCard({ listing, profile, rank }: ListingCardProps) {
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

      const parsed: DDReport = JSON.parse(extractJSON(full));
      setReport(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setStreaming(false);
    }
  };

  const age = new Date().getFullYear() - listing.yearEstablished;

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${listing.fitScore >= 80 ? "border-green-200" : listing.fitScore >= 60 ? "border-yellow-200" : ""}`}>
      {/* Header */}
      <CardHeader className="pb-3 bg-gray-50/60">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-muted-foreground">#{rank}</span>
              <CardTitle className="text-lg truncate">{listing.name}</CardTitle>
              <GrowthBadge trend={listing.growthTrend} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{listing.type}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />{listing.location}
              </span>
              <span className="text-xs text-muted-foreground">Est. {listing.yearEstablished} ({age} yrs)</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${fitBadge(listing.fitScore)}`}>
              <Sparkles className="h-3.5 w-3.5" />
              {listing.fitScore}% — {fitLabel(listing.fitScore)}
            </div>
            <div className="mt-1">
              <Progress
                value={listing.fitScore}
                className={`h-1.5 w-24 ml-auto ${listing.fitScore >= 80 ? "[&>div]:bg-green-500" : listing.fitScore >= 60 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-400"}`}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-[#185FA5]" />
              <span className="text-xs text-muted-foreground">Asking Price</span>
            </div>
            <div className="font-bold text-sm">{formatCurrency(listing.askingPrice)}</div>
            <div className="text-xs text-muted-foreground">{listing.multipleOnAsk}x SDE</div>
          </div>

          <div className="bg-green-50/60 border border-green-100 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs text-muted-foreground">Annual SDE</span>
            </div>
            <div className="font-bold text-sm text-green-700">{formatCurrency(listing.sde)}</div>
            <div className="text-xs text-muted-foreground">{listing.sdeMargin}% margin</div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="font-bold text-sm">{formatCurrency(listing.revenue)}</div>
            <div className="text-xs text-muted-foreground">Annual gross</div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground">Owner Time</span>
            </div>
            <div className="font-bold text-sm">{listing.ownerHoursPerWeek} hrs/wk</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />{listing.employees} employees
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> Key Highlights
          </div>
          <ul className="space-y-1.5">
            {listing.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#185FA5]/10 text-[#185FA5] flex items-center justify-center font-bold text-[10px]">
                  {i + 1}
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Lease */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span><strong className="text-amber-700">Lease:</strong> {listing.leaseTerm}</span>
        </div>

        <Separator />

        {/* DD Report button */}
        <Button
          variant="outline"
          className="w-full border-[#185FA5] text-[#185FA5] hover:bg-blue-50"
          onClick={generateReport}
          disabled={streaming}
        >
          {streaming ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating AI Due Diligence Report...</>
          ) : expanded && report ? (
            <><ChevronUp className="h-4 w-4 mr-2" />Hide AI Due Diligence Report</>
          ) : (
            <><ChevronDown className="h-4 w-4 mr-2" />View AI Due Diligence Report</>
          )}
        </Button>

        {/* Streaming raw output */}
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

        {/* Structured DD report */}
        {expanded && report && !streaming && (
          <div className="space-y-6 pt-2">
            <Separator />

            {/* Executive Summary */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Executive Summary</h4>
              <p className="text-sm leading-relaxed">{report.executive_summary}</p>
            </div>

            {/* Risk Scores */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Risk Scores</h4>
              <div className="space-y-3">
                {report.risk_scores?.map((r) => (
                  <div key={r.dimension}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{r.dimension}</span>
                      <span className={`font-semibold ${r.score <= 3 ? "text-green-600" : r.score <= 6 ? "text-yellow-600" : "text-red-600"}`}>
                        {r.score}/10
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className={`h-full transition-all ${riskBarColor(r.score)}`} style={{ width: `${r.score * 10}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SWOT */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">SWOT Analysis</h4>
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
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Top 5 Things to Watch Out For</h4>
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
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Staffing Estimate (WA State)</h4>
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
                        <td className="py-2 text-[#185FA5]" colSpan={2}>{report.staffing_estimate.total_annual_est}</td>
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

// ── Page ──────────────────────────────────────────────────────────────────

export default function BuyerResultsPage() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("buyer_profile");
    if (stored) {
      const p: BuyerProfile = JSON.parse(stored);
      setProfile(p);
      setListings(getScoredListings(p));
    } else {
      // fallback: show all listings with neutral scores
      const { getScoredListings: getScored } = require("@/lib/fitScore");
      const defaultProfile: BuyerProfile = {
        budget: 500000, timeAvailable: 20, ownerType: "active",
        industry: "Other", preferredState: "WA", priority: "cash-flow",
      };
      setListings(getScored(defaultProfile));
    }
  }, []);

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Matched Listings</h1>
          {profile ? (
            <p className="text-muted-foreground mt-1">
              Ranked by fit score based on your{" "}
              <strong>{formatCurrency(profile.budget)}</strong> budget,{" "}
              <strong>{profile.timeAvailable} hrs/week</strong>,{" "}
              <strong>{profile.ownerType}</strong> preference in{" "}
              <strong>{profile.preferredState}</strong>.
            </p>
          ) : (
            <p className="text-muted-foreground mt-1">Showing all available listings sorted by fit score.</p>
          )}
        </div>

        {/* Match Summary */}
        {profile && listings.length > 0 && (
          <MatchSummary listings={listings} profile={profile} />
        )}

        {/* Listing cards */}
        <div className="space-y-6">
          {listings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} profile={profile} rank={i + 1} />
          ))}
        </div>
      </main>
    </>
  );
}
