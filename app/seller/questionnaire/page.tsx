"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { SellerProfile, SellerQuestionnaire, FinancialRow } from "@/lib/types";
import { Upload } from "lucide-react";

const currentYear = new Date().getFullYear();

const DEFAULT_FINANCIALS: FinancialRow[] = [
  { year: String(currentYear - 2), grossRevenue: "", sde: "" },
  { year: String(currentYear - 1), grossRevenue: "", sde: "" },
  { year: String(currentYear), grossRevenue: "", sde: "" },
];

export default function SellerQuestionnairePage() {
  const router = useRouter();
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);

  const [whySelling, setWhySelling] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [financials, setFinancials] = useState<FinancialRow[]>(DEFAULT_FINANCIALS);
  const [leaseInfo, setLeaseInfo] = useState("");
  const [ownerPresence, setOwnerPresence] = useState<"yes" | "no" | "partially">("yes");
  const [documentNames, setDocumentNames] = useState<string[]>([]);

  useEffect(() => {
    const profile = localStorage.getItem("seller_profile");
    if (profile) {
      const p: SellerProfile = JSON.parse(profile);
      setSellerProfile(p);
      setWhySelling(p.reasonForSelling);
    }
  }, []);

  const updateFinancialRow = (i: number, field: keyof FinancialRow, value: string) => {
    setFinancials((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocumentNames((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const questionnaire: SellerQuestionnaire = {
      whySelling,
      askingPrice,
      financials,
      leaseInfo,
      ownerPresence,
      documentNames,
      sellerProfile: sellerProfile!,
      valuation: JSON.parse(localStorage.getItem("seller_valuation") || "null"),
    };

    localStorage.setItem("seller_questionnaire", JSON.stringify(questionnaire));
    router.push("/seller/preview");
  };

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Seller Questionnaire</h1>
          <p className="text-muted-foreground mt-1">
            Complete these details to create your listing and attract qualified buyers.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Q1 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">1. Why are you considering selling?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={whySelling}
                  onChange={(e) => setWhySelling(e.target.value)}
                  placeholder="Describe your reason for selling..."
                  rows={3}
                  required
                />
              </CardContent>
            </Card>

            {/* Q2 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">2. What is your asking price and what does it include?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="e.g. $350,000 — includes all equipment, inventory, lease transfer, goodwill"
                  rows={3}
                  required
                />
              </CardContent>
            </Card>

            {/* Q3 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">3. Annual gross revenue and SDE — last 3 years</CardTitle>
                <CardDescription>SDE = Seller&apos;s Discretionary Earnings (profit + owner salary)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-muted-foreground w-24">Year</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">Gross Revenue</th>
                        <th className="text-left py-2 font-medium text-muted-foreground">SDE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.map((row, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3 pr-4">
                            <Input
                              value={row.year}
                              onChange={(e) => updateFinancialRow(i, "year", e.target.value)}
                              className="w-20 text-center"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                              <Input
                                value={row.grossRevenue}
                                onChange={(e) => updateFinancialRow(i, "grossRevenue", e.target.value)}
                                className="pl-6"
                                placeholder="0"
                              />
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                              <Input
                                value={row.sde}
                                onChange={(e) => updateFinancialRow(i, "sde", e.target.value)}
                                className="pl-6"
                                placeholder="0"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Q4 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">4. Current lease terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={leaseInfo}
                  onChange={(e) => setLeaseInfo(e.target.value)}
                  placeholder="e.g. 3 years remaining, 5-year renewal option at $4,200/month"
                  required
                />
              </CardContent>
            </Card>

            {/* Q5 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">5. Does the business require owner presence daily?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={ownerPresence}
                  onValueChange={(v) => setOwnerPresence(v as typeof ownerPresence)}
                  className="space-y-2"
                >
                  {[
                    { value: "yes", label: "Yes", desc: "Owner is on-site most days" },
                    { value: "no", label: "No", desc: "Business runs without owner daily presence" },
                    { value: "partially", label: "Partially", desc: "Owner checks in a few times per week" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        ownerPresence === opt.value ? "border-[#185FA5] bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <div>
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Q6 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">6. Supporting documents (optional)</CardTitle>
                <CardDescription>PDF files only. Names are stored — files are not uploaded in this POC.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to select PDF files</span>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {documentNames.length > 0 && (
                  <ul className="space-y-1">
                    {documentNames.map((name, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#185FA5]" />
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={!sellerProfile || !whySelling || !askingPrice || !leaseInfo}
              className="w-full bg-[#185FA5] hover:bg-[#134d87] py-6 text-base font-semibold"
            >
              Create my listing preview →
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
