"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { BuyerProfile } from "@/lib/types";

const STEPS = ["Your Situation", "What You're Looking For", "Review & Generate"];

const INDUSTRIES = [
  "Pest Control", "Laundromat", "Cleaning Service",
  "Landscaping", "Retail", "Restaurant", "Other",
];

const US_STATES = [
  "WA", "OR", "CA", "ID", "MT", "AZ", "NV", "UT", "CO", "TX", "FL", "NY", "GA", "IL", "OH",
];

const INITIAL_FORM: BuyerProfile = {
  budget: 350000,
  timeAvailable: 20,
  ownerType: "active",
  industry: "Pest Control",
  preferredState: "WA",
  priority: "cash-flow",
};

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i < current
                ? "bg-green-500 text-white"
                : i === current
                ? "bg-[#185FA5] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </div>
          <span
            className={`text-sm hidden sm:inline ${
              i === current ? "text-[#185FA5] font-medium" : "text-gray-400"
            }`}
          >
            {label}
          </span>
          {i < total - 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
        </div>
      ))}
    </div>
  );
}

export default function BuyerIntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BuyerProfile>(INITIAL_FORM);

  const update = (patch: Partial<BuyerProfile>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    localStorage.setItem("buyer_profile", JSON.stringify(form));
    router.push("/buyer/results");
  };

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <StepIndicator current={step} total={STEPS.length} />

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
            <CardDescription>
              {step === 0 && "Tell us about your situation so we can find the right fit."}
              {step === 1 && "Help us narrow down what kind of business matches your goals."}
              {step === 2 && "Review your answers, then generate your personalized matches and DD report."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-7">
            {/* ── Step 1 ── */}
            {step === 0 && (
              <>
                <div className="space-y-3">
                  <Label>
                    Budget Range:{" "}
                    <span className="text-[#185FA5] font-semibold">{formatCurrency(form.budget)}</span>
                  </Label>
                  <Slider
                    min={50000}
                    max={1000000}
                    step={25000}
                    value={[form.budget]}
                    onValueChange={([v]) => update({ budget: v })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$50K</span>
                    <span>$1M</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>
                    Time Available Per Week:{" "}
                    <span className="text-[#185FA5] font-semibold">{form.timeAvailable} hrs</span>
                  </Label>
                  <Slider
                    min={0}
                    max={60}
                    step={5}
                    value={[form.timeAvailable]}
                    onValueChange={([v]) => update({ timeAvailable: v })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 hrs</span>
                    <span>60 hrs</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Owner Type</Label>
                  <RadioGroup
                    value={form.ownerType}
                    onValueChange={(v) => update({ ownerType: v as BuyerProfile["ownerType"] })}
                    className="space-y-2"
                  >
                    {[
                      { value: "active", label: "Active Owner", desc: "On-site and hands-on daily" },
                      { value: "semi-absentee", label: "Semi-absentee", desc: "Oversee from a distance, part-time" },
                      { value: "absentee", label: "Full Absentee", desc: "Managed investment — minimal involvement" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          form.ownerType === opt.value
                            ? "border-[#185FA5] bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <RadioGroupItem value={opt.value} id={opt.value} className="mt-1 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* ── Step 2 ── */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={form.industry} onValueChange={(v) => update({ industry: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred State</Label>
                  <Select value={form.preferredState} onValueChange={(v) => update({ preferredState: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Top Priority</Label>
                  <RadioGroup
                    value={form.priority}
                    onValueChange={(v) => update({ priority: v as BuyerProfile["priority"] })}
                    className="space-y-2"
                  >
                    {[
                      { value: "cash-flow", label: "Cash Flow", desc: "Maximize immediate owner income" },
                      { value: "growth", label: "Growth Potential", desc: "Scale revenues over time" },
                      { value: "lowest-risk", label: "Lowest Risk", desc: "Stable, proven, minimal surprises" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          form.priority === opt.value
                            ? "border-[#185FA5] bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <RadioGroupItem value={opt.value} id={`p-${opt.value}`} className="mt-1 shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* ── Step 3 — Review ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Budget", value: formatCurrency(form.budget) },
                    { label: "Time Available", value: `${form.timeAvailable} hrs/week` },
                    { label: "Owner Type", value: form.ownerType.replace("-", " ") },
                    { label: "Industry", value: form.industry },
                    { label: "Preferred State", value: form.preferredState },
                    { label: "Priority", value: form.priority.replace("-", " ") },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
                      <div className="text-sm font-medium capitalize">{value}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  We&apos;ll match you to available listings in {form.preferredState} and generate a
                  full AI due diligence report for each — instantly.
                </p>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between pt-2">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)} className="bg-[#185FA5] hover:bg-[#134d87]">
                  Continue →
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-[#185FA5] hover:bg-[#134d87]">
                  Find matches + generate DD report →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
