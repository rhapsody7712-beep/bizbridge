"use client";
import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, extractJSON } from "@/lib/utils";
import { SAMPLE_SELLERS, getComparables } from "@/lib/mockSellerData";
import type { SellerProfile, ValuationResult } from "@/lib/types";
import { Loader2, TrendingUp, ArrowRight, Zap, Clock, BarChart3 } from "lucide-react";

const BUSINESS_TYPES = [
  "Pest Control", "Laundromat", "Cleaning Service", "Landscaping",
  "Retail", "Restaurant", "Auto Repair", "Childcare", "Gym / Fitness", "Other",
];

const REASONS = [
  "Retirement", "Relocation", "Health", "Other opportunity", "Burnout", "Other",
];

const INITIAL: SellerProfile = {
  businessType: "",
  cityState: "",
  annualRevenue: 0,
  yearsInOperation: 0,
  reasonForSelling: "",
};

export default function SellerIntakePage() {
  const [form, setForm] = useState<SellerProfile>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [error, setError] = useState("");

  const update = (patch: Partial<SellerProfile>) => setForm((f) => ({ ...f, ...patch }));

  const isValid =
    form.businessType && form.cityState && form.annualRevenue > 0 &&
    form.yearsInOperation > 0 && form.reasonForSelling;

  const loadSample = (index: number) => {
    const sample = SAMPLE_SELLERS[index];
    setForm(sample.profile);
    setValuation(null);
    setError("");
    // Also pre-store questionnaire data so the full flow works end-to-end
    localStorage.setItem("seller_questionnaire_prefill", JSON.stringify(sample.questionnaire));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValuation(null);

    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_type: form.businessType,
          revenue: form.annualRevenue,
          years_in_operation: form.yearsInOperation,
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const text = await res.text();
      const data: ValuationResult = JSON.parse(extractJSON(text));
      setValuation(data);

      localStorage.setItem("seller_profile", JSON.stringify(form));
      localStorage.setItem("seller_valuation", JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Valuation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const comparables = valuation ? getComparables(form.businessType) : [];

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Get Your Instant Business Valuation</h1>
          <p className="text-muted-foreground mt-1">
            Answer 5 quick questions and we&apos;ll give you a market-based value range in seconds.
          </p>
        </div>

        {/* Sample data loader */}
        <Card className="mb-6 bg-blue-50/40 border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#185FA5]" />
              Try with a sample business
            </CardTitle>
            <CardDescription className="text-xs">
              Load a pre-filled example to explore the full seller flow instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SELLERS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => loadSample(i)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    form.businessType === s.profile.businessType
                      ? "bg-[#185FA5] text-white border-[#185FA5]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#185FA5] hover:text-[#185FA5]"
                  }`}
                >
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Estimate</CardTitle>
            <CardDescription>Basic information to calculate your SDE multiple range.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="bizType">Business Type</Label>
                <Select value={form.businessType} onValueChange={(v) => update({ businessType: v })}>
                  <SelectTrigger id="bizType">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityState">City / State</Label>
                <Input
                  id="cityState"
                  placeholder="e.g. Bellevue, WA"
                  value={form.cityState}
                  onChange={(e) => update({ cityState: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Approx. Annual Gross Revenue</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="revenue"
                    type="number"
                    min={0}
                    placeholder="350000"
                    className="pl-7"
                    value={form.annualRevenue || ""}
                    onChange={(e) => update({ annualRevenue: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Years in Operation</Label>
                <Input
                  id="years"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="8"
                  value={form.yearsInOperation || ""}
                  onChange={(e) => update({ yearsInOperation: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Selling</Label>
                <Select value={form.reasonForSelling} onValueChange={(v) => update({ reasonForSelling: v })}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <Button
                type="submit"
                disabled={!isValid || loading}
                className="w-full bg-[#185FA5] hover:bg-[#134d87]"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Calculating valuation...</>
                ) : (
                  "Get my instant valuation"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Valuation Result */}
        {valuation && (
          <div className="mt-6 space-y-4">
            {/* Main valuation card */}
            <Card className="border-2 border-[#185FA5] bg-blue-50/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-[#185FA5]/10 shrink-0">
                    <TrendingUp className="h-6 w-6 text-[#185FA5]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Business Value</p>
                    <p className="text-3xl font-bold text-[#185FA5]">
                      {formatCurrency(valuation.low_estimate)} – {formatCurrency(valuation.high_estimate)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      SDE estimate:{" "}
                      <span className="font-medium text-foreground">{formatCurrency(valuation.sde_estimate)}</span>
                      {" "}· Multiple used:{" "}
                      <span className="font-medium text-foreground">{valuation.multiple_used}</span>
                    </p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="text-center bg-white rounded-lg p-3 border">
                    <BarChart3 className="h-4 w-4 text-[#185FA5] mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">SDE Estimate</div>
                    <div className="font-bold text-sm">{formatCurrency(valuation.sde_estimate)}</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3 border">
                    <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Multiple Range</div>
                    <div className="font-bold text-sm">{valuation.multiple_used}</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3 border">
                    <Clock className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Avg. Days to Close</div>
                    <div className="font-bold text-sm">
                      {comparables.length > 0
                        ? Math.round(comparables.reduce((sum, c) => sum + c.daysOnMarket, 0) / comparables.length)
                        : "75"}{" "}
                      days
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Methodology
                  </p>
                  <p className="text-sm leading-relaxed">{valuation.methodology_note}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comparable sales */}
            {comparables.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Comparable Sales in WA</CardTitle>
                  <CardDescription>
                    Similar {form.businessType.toLowerCase()} businesses that sold in Washington State
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">Business</th>
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">Sold Price</th>
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">Revenue</th>
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">SDE</th>
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">Multiple</th>
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">DOM</th>
                          <th className="text-left py-2 font-medium text-muted-foreground text-xs">Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparables.map((c, i) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50">
                            <td className="py-2.5">
                              <div className="font-medium text-xs">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.location}</div>
                            </td>
                            <td className="py-2.5 font-semibold text-xs text-[#185FA5]">{formatCurrency(c.soldPrice)}</td>
                            <td className="py-2.5 text-xs">{formatCurrency(c.grossRevenue)}</td>
                            <td className="py-2.5 text-xs text-green-700 font-medium">{formatCurrency(c.sde)}</td>
                            <td className="py-2.5 text-xs">
                              <Badge variant="outline" className="text-xs font-medium">{c.multiple}x</Badge>
                            </td>
                            <td className="py-2.5 text-xs text-muted-foreground">{c.daysOnMarket}d</td>
                            <td className="py-2.5 text-xs text-muted-foreground">{c.monthYearSold}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t bg-gray-50/50">
                          <td className="py-2 text-xs font-semibold text-muted-foreground" colSpan={4}>Your estimate vs. comps avg</td>
                          <td className="py-2 text-xs font-bold text-[#185FA5]">
                            {(comparables.reduce((sum, c) => sum + c.multiple, 0) / comparables.length).toFixed(2)}x avg
                          </td>
                          <td className="py-2 text-xs font-bold text-muted-foreground">
                            {Math.round(comparables.reduce((sum, c) => sum + c.daysOnMarket, 0) / comparables.length)}d avg
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gray-50">
              <CardContent className="pt-5">
                <p className="text-sm font-medium mb-3">
                  Ready to create your listing? Complete the seller questionnaire to go live.
                </p>
                <Link href="/seller/questionnaire">
                  <Button className="bg-[#185FA5] hover:bg-[#134d87] w-full sm:w-auto">
                    Continue to full questionnaire
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
