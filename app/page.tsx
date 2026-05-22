import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d3a6a] to-[#185FA5] text-white py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Powered by AI Due Diligence
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Buy or sell a traditional business — with AI-powered due diligence
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-12">
              BizBridge matches buyers with vetted, cash-flowing businesses and gives sellers a
              professional listing and instant valuation estimate — all in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buyer/intake">
                <Button
                  size="lg"
                  className="bg-white text-[#185FA5] hover:bg-blue-50 font-semibold px-8 py-6 text-base w-full sm:w-auto"
                >
                  I want to buy a business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/seller/intake">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-base w-full sm:w-auto"
                >
                  I want to sell my business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
              Why brokers and buyers trust BizBridge
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-7 w-7 text-[#185FA5]" />,
                  title: "AI Due Diligence",
                  desc: "Claude-powered DD reports cover financials, risk, SWOT, and staffing — in seconds, not weeks.",
                },
                {
                  icon: <TrendingUp className="h-7 w-7 text-[#185FA5]" />,
                  title: "Instant Valuation",
                  desc: "Sellers get a data-backed SDE multiple range the moment they submit basic financials.",
                },
                {
                  icon: <Users className="h-7 w-7 text-[#185FA5]" />,
                  title: "Smart Matching",
                  desc: "Buyers are matched to listings based on budget, lifestyle, and growth goals — not just industry.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-0 shadow-sm bg-blue-50/40">
                  <CardContent className="pt-6">
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-gray-50 border-y py-12 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
            {[
              { stat: "340+", label: "Listings in WA State" },
              { stat: "$2.1M", label: "Avg deal size" },
              { stat: "< 5 min", label: "To your DD report" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-bold text-[#185FA5]">{item.stat}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA footer */}
        <section className="py-16 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join hundreds of buyers and sellers who have used BizBridge to close deals confidently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/buyer/intake">
              <Button className="bg-[#185FA5] hover:bg-[#134d87] px-8">
                Start as a buyer
              </Button>
            </Link>
            <Link href="/seller/intake">
              <Button variant="outline" className="px-8">
                Get my business valued
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
