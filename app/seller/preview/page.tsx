"use client";
import { useState, useEffect } from "react";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { SellerQuestionnaire } from "@/lib/types";
import {
  MapPin, DollarSign, Calendar, FileText, Users, Loader2,
  CheckCircle2, Sparkles, Building2, BarChart3, Clock, TrendingUp, Flame,
} from "lucide-react";
import { getMarketContext } from "@/lib/mockSellerData";

export default function SellerPreviewPage() {
  const [data, setData] = useState<SellerQuestionnaire | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("seller_questionnaire");
    if (!stored) return;
    const q: SellerQuestionnaire = JSON.parse(stored);
    setData(q);
    generateSummary(q);
  }, []);

  const generateSummary = async (q: SellerQuestionnaire) => {
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/seller-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q),
      });
      if (!res.ok) throw new Error("Summary failed");
      const { summary } = await res.json();
      setAiSummary(summary);
    } catch {
      setAiSummary(
        "This established business offers a proven revenue model and a motivated seller ready to transition. Contact us for the full information package."
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!data) {
    return (
      <>
        <Nav />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">No listing data found. Please complete the questionnaire first.</p>
        </main>
      </>
    );
  }

  const { sellerProfile, valuation, financials, askingPrice, leaseInfo, ownerPresence, documentNames, whySelling } = data;
  const market = getMarketContext(sellerProfile?.businessType ?? "");

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-green-100 text-green-800 border-green-200">Preview Mode</Badge>
              <Badge variant="outline">How buyers see your listing</Badge>
            </div>
            <h1 className="text-2xl font-bold">{sellerProfile?.businessType} — {sellerProfile?.cityState}</h1>
          </div>
          <Button
            onClick={() => showToast("Your listing is live — buyers will be matched within 24 hours")}
            className="bg-[#185FA5] hover:bg-[#134d87] font-semibold"
          >
            Go Live
          </Button>
        </div>

        <div className="space-y-6">

          {/* AI Seller Summary */}
          <Card className="border-[#185FA5]/30 bg-blue-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#185FA5]" />
                AI-Generated Seller Summary
              </CardTitle>
              <CardDescription>Written by BizBridge AI to attract qualified buyers</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating your professional listing description...
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{aiSummary}</p>
              )}
            </CardContent>
          </Card>

          {/* Key Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#185FA5]" />
                Business Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {valuation && (
                  <>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#185FA5] mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">Asking Price</div>
                      <div className="font-semibold text-sm mt-1 truncate">{askingPrice.split("—")[0].trim()}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-[#185FA5] mx-auto mb-1" />
                      <div className="text-xs text-muted-foreground">Est. Value Range</div>
                      <div className="font-semibold text-sm mt-1">
                        {formatCurrency(valuation.low_estimate)}–{formatCurrency(valuation.high_estimate)}
                      </div>
                    </div>
                  </>
                )}
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#185FA5] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Years Operating</div>
                  <div className="font-semibold text-sm mt-1">{sellerProfile?.yearsInOperation} years</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#185FA5] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-semibold text-sm mt-1">{sellerProfile?.cityState}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">3-Year Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Year</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Gross Revenue</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">SDE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{row.year}</td>
                        <td className="py-2">{row.grossRevenue ? `$${row.grossRevenue}` : "—"}</td>
                        <td className="py-2">{row.sde ? `$${row.sde}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Listing Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">What&apos;s Included</p>
                <p className="text-sm">{askingPrice}</p>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Lease Information</p>
                <p className="text-sm">{leaseInfo}</p>
              </div>

              <Separator />

              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Owner Presence Required</p>
                  <Badge
                    className={
                      ownerPresence === "no"
                        ? "bg-green-100 text-green-800"
                        : ownerPresence === "partially"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {ownerPresence === "yes" ? "Daily" : ownerPresence === "no" ? "Not required" : "Partial"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Reason for Selling</p>
                  <Badge variant="outline">{sellerProfile?.reasonForSelling}</Badge>
                </div>
              </div>

              {whySelling && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Seller&apos;s Note</p>
                    <p className="text-sm italic text-muted-foreground">&quot;{whySelling}&quot;</p>
                  </div>
                </>
              )}

              {documentNames.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> Supporting Documents
                    </p>
                    <ul className="space-y-1">
                      {documentNames.map((name, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Market Position */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#185FA5]" />
                Market Position — {sellerProfile?.businessType} in WA
              </CardTitle>
              <CardDescription>How your listing compares to the current market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-gray-50 rounded-lg p-3 border">
                  <Building2 className="h-4 w-4 text-[#185FA5] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Active Listings</div>
                  <div className="font-bold text-lg">{market.activeListings}</div>
                  <div className="text-xs text-muted-foreground">competing</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3 border">
                  <Clock className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Avg. Days to Close</div>
                  <div className="font-bold text-lg">{market.avgDaysToClose}</div>
                  <div className="text-xs text-muted-foreground">days</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3 border">
                  <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Market Multiple</div>
                  <div className="font-bold text-sm mt-1">{market.avgMultiple}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <Flame className={`h-5 w-5 shrink-0 ${
                  market.buyerDemandLevel === "High" ? "text-orange-500" :
                  market.buyerDemandLevel === "Medium" ? "text-yellow-500" : "text-gray-400"
                }`} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buyer Demand</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      market.buyerDemandLevel === "High" ? "bg-orange-100 text-orange-700" :
                      market.buyerDemandLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {market.buyerDemandLevel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{market.pricePositionNote}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Go Live CTA */}
          <Card className="bg-gradient-to-br from-[#0d3a6a] to-[#185FA5] text-white border-0">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-200 shrink-0" />
                <div>
                  <p className="font-semibold">Ready to find your buyer?</p>
                  <p className="text-sm text-blue-200">Your listing will be matched to active buyers within 24 hours.</p>
                </div>
              </div>
              <Button
                onClick={() => showToast("Your listing is live — buyers will be matched within 24 hours")}
                className="bg-white text-[#185FA5] hover:bg-blue-50 font-semibold shrink-0"
              >
                Go Live Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl animate-slide-in max-w-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </>
  );
}
