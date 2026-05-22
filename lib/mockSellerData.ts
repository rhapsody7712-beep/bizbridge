import type { SellerProfile } from "./types";

// ── Sample seller profiles (prefill for demo) ────────────────────────────

export interface SampleSeller {
  label: string;
  emoji: string;
  profile: SellerProfile;
  questionnaire: {
    whySelling: string;
    askingPrice: string;
    financials: { year: string; grossRevenue: string; sde: string }[];
    leaseInfo: string;
    ownerPresence: "yes" | "no" | "partially";
  };
}

const currentYear = new Date().getFullYear();

export const SAMPLE_SELLERS: SampleSeller[] = [
  {
    label: "Pest Control",
    emoji: "🐛",
    profile: {
      businessType: "Pest Control",
      cityState: "Bellevue, WA",
      annualRevenue: 680000,
      yearsInOperation: 14,
      reasonForSelling: "Retirement",
    },
    questionnaire: {
      whySelling:
        "I've built this business from scratch over 14 years and I'm ready to retire. My team is strong, processes are documented, and the business runs well without me being on-site every day. Looking for a buyer who will take care of my team and continue the relationships I've built with clients.",
      askingPrice:
        "$425,000 — includes all equipment (2 service vans, full chemical inventory), customer contracts (340+ recurring), trained technicians, licensing, and goodwill.",
      financials: [
        { year: String(currentYear - 2), grossRevenue: "620000", sde: "128000" },
        { year: String(currentYear - 1), grossRevenue: "655000", sde: "138000" },
        { year: String(currentYear), grossRevenue: "680000", sde: "148000" },
      ],
      leaseInfo: "Office and storage lease: 2 years remaining, 3-year renewal option at $1,800/month. Landlord is cooperative with ownership transfers.",
      ownerPresence: "partially",
    },
  },
  {
    label: "Laundromat",
    emoji: "👕",
    profile: {
      businessType: "Laundromat",
      cityState: "Tacoma, WA",
      annualRevenue: 145000,
      yearsInOperation: 15,
      reasonForSelling: "Relocation",
    },
    questionnaire: {
      whySelling:
        "My family is relocating to Arizona for personal reasons and I'm unable to continue managing this location. The business runs nearly autonomously — I spend about 8 hours per week doing bank drops, restocking supplies, and handling minor maintenance. A manager could replace me on day one.",
      askingPrice:
        "$280,000 — includes all 28 machines (18 washers, 10 dryers), coin collection system, surveillance cameras, folding tables, and all fixtures. Inventory of supplies included.",
      financials: [
        { year: String(currentYear - 2), grossRevenue: "138000", sde: "65000" },
        { year: String(currentYear - 1), grossRevenue: "141000", sde: "68000" },
        { year: String(currentYear), grossRevenue: "145000", sde: "72000" },
      ],
      leaseInfo: "4 years remaining on current lease, 5-year renewal option at $3,200/month. Lease is below market rate for the area.",
      ownerPresence: "no",
    },
  },
  {
    label: "Landscaping",
    emoji: "🌿",
    profile: {
      businessType: "Landscaping",
      cityState: "Kirkland, WA",
      annualRevenue: 890000,
      yearsInOperation: 17,
      reasonForSelling: "Other opportunity",
    },
    questionnaire: {
      whySelling:
        "I'm pursuing a commercial real estate opportunity that requires my full attention. The landscaping business is thriving and I'd hate to let it atrophy. I have two experienced crew leads who are capable of managing operations. The right buyer could scale this significantly by pursuing more commercial HOA contracts.",
      askingPrice:
        "$520,000 — includes 4 service trucks, 2 trailers, full equipment inventory (mowers, trimmers, blowers, irrigation tools), 60+ active contracts, and trained crew of 8.",
      financials: [
        { year: String(currentYear - 2), grossRevenue: "790000", sde: "155000" },
        { year: String(currentYear - 1), grossRevenue: "840000", sde: "170000" },
        { year: String(currentYear), grossRevenue: "890000", sde: "185000" },
      ],
      leaseInfo: "Yard and storage facility lease: 1 year remaining with month-to-month option at $2,400/month. Owner would consider short-term lease extension during transition.",
      ownerPresence: "partially",
    },
  },
  {
    label: "Cleaning Service",
    emoji: "✨",
    profile: {
      businessType: "Cleaning Service",
      cityState: "Redmond, WA",
      annualRevenue: 410000,
      yearsInOperation: 9,
      reasonForSelling: "Burnout",
    },
    questionnaire: {
      whySelling:
        "After 9 years of building this business, I'm experiencing burnout and need a change. The business is in great shape — 85 active clients, a reliable team, and strong online reviews. I just don't have the energy to keep growing it. This is a great opportunity for a buyer who wants to step into a well-run operation.",
      askingPrice:
        "$195,000 — includes all cleaning equipment, supplies inventory, branded uniforms, customer list (85 active accounts), proprietary scheduling system, and full staff transition support for 60 days.",
      financials: [
        { year: String(currentYear - 2), grossRevenue: "360000", sde: "82000" },
        { year: String(currentYear - 1), grossRevenue: "385000", sde: "90000" },
        { year: String(currentYear), grossRevenue: "410000", sde: "98000" },
      ],
      leaseInfo: "Home-based operations — no commercial lease. Cleaning supplies stored in a rented 10x10 storage unit at $120/month (month-to-month).",
      ownerPresence: "partially",
    },
  },
  {
    label: "Restaurant",
    emoji: "🌮",
    profile: {
      businessType: "Restaurant",
      cityState: "Renton, WA",
      annualRevenue: 480000,
      yearsInOperation: 6,
      reasonForSelling: "Health",
    },
    questionnaire: {
      whySelling:
        "Due to health reasons I can no longer manage the demanding hours of restaurant ownership. The concept is strong, the customer base is loyal, and delivery revenue through DoorDash and Uber Eats has grown to 38% of total sales. The right buyer — especially someone with restaurant experience — could take this to the next level.",
      askingPrice:
        "$175,000 — includes all kitchen equipment (hood, fryers, refrigeration, POS system), furniture and fixtures, recipes and supplier relationships, delivery platform accounts, and staff transition.",
      financials: [
        { year: String(currentYear - 2), grossRevenue: "430000", sde: "68000" },
        { year: String(currentYear - 1), grossRevenue: "455000", sde: "74000" },
        { year: String(currentYear), grossRevenue: "480000", sde: "82000" },
      ],
      leaseInfo: "2 years remaining on commercial kitchen lease, 3-year renewal option at $4,800/month. Space is 1,200 sq ft with full commercial kitchen buildout.",
      ownerPresence: "yes",
    },
  },
];

// ── Comparable sales (shown after valuation) ─────────────────────────────

export interface ComparableSale {
  name: string;
  soldPrice: number;
  grossRevenue: number;
  sde: number;
  multiple: number;
  location: string;
  monthYearSold: string;
  daysOnMarket: number;
}

export const COMPARABLE_SALES: Record<string, ComparableSale[]> = {
  "Pest Control": [
    { name: "Pacific NW Pest Pro", soldPrice: 390000, grossRevenue: 620000, sde: 135000, multiple: 2.89, location: "Redmond, WA", monthYearSold: "Feb 2025", daysOnMarket: 68 },
    { name: "Sound Shield Pest Control", soldPrice: 460000, grossRevenue: 710000, sde: 158000, multiple: 2.91, location: "Bellevue, WA", monthYearSold: "Oct 2024", daysOnMarket: 52 },
    { name: "Evergreen Pest Services", soldPrice: 310000, grossRevenue: 490000, sde: 108000, multiple: 2.87, location: "Kirkland, WA", monthYearSold: "Jun 2024", daysOnMarket: 84 },
  ],
  "Laundromat": [
    { name: "Rainier Wash & Fold", soldPrice: 255000, grossRevenue: 130000, sde: 64000, multiple: 3.98, location: "Seattle, WA", monthYearSold: "Mar 2025", daysOnMarket: 45 },
    { name: "Clean Wave Laundromat", soldPrice: 310000, grossRevenue: 160000, sde: 80000, multiple: 3.88, location: "Tacoma, WA", monthYearSold: "Nov 2024", daysOnMarket: 38 },
    { name: "Harbor Suds", soldPrice: 220000, grossRevenue: 112000, sde: 56000, multiple: 3.93, location: "Olympia, WA", monthYearSold: "Aug 2024", daysOnMarket: 61 },
  ],
  "Landscaping": [
    { name: "Cascade Green Services", soldPrice: 480000, grossRevenue: 820000, sde: 165000, multiple: 2.91, location: "Bellevue, WA", monthYearSold: "Jan 2025", daysOnMarket: 72 },
    { name: "Olympic Lawn & Landscape", soldPrice: 545000, grossRevenue: 940000, sde: 192000, multiple: 2.84, location: "Redmond, WA", monthYearSold: "Sep 2024", daysOnMarket: 89 },
    { name: "Emerald Yard Pro", soldPrice: 395000, grossRevenue: 670000, sde: 142000, multiple: 2.78, location: "Kirkland, WA", monthYearSold: "May 2024", daysOnMarket: 103 },
  ],
  "Cleaning Service": [
    { name: "Shine Time Cleaners", soldPrice: 185000, grossRevenue: 390000, sde: 91000, multiple: 2.03, location: "Bellevue, WA", monthYearSold: "Apr 2025", daysOnMarket: 41 },
    { name: "Crystal Clean WA", soldPrice: 210000, grossRevenue: 445000, sde: 104000, multiple: 2.02, location: "Redmond, WA", monthYearSold: "Dec 2024", daysOnMarket: 56 },
    { name: "SpotFree Services", soldPrice: 165000, grossRevenue: 355000, sde: 83000, multiple: 1.99, location: "Kirkland, WA", monthYearSold: "Jul 2024", daysOnMarket: 48 },
  ],
  "Restaurant": [
    { name: "Taco Fuego Express", soldPrice: 160000, grossRevenue: 440000, sde: 72000, multiple: 2.22, location: "Kent, WA", monthYearSold: "Mar 2025", daysOnMarket: 95 },
    { name: "La Mesa Cocina", soldPrice: 195000, grossRevenue: 510000, sde: 88000, multiple: 2.22, location: "Renton, WA", monthYearSold: "Oct 2024", daysOnMarket: 112 },
    { name: "Eastside Grill & Bar", soldPrice: 145000, grossRevenue: 390000, sde: 65000, multiple: 2.23, location: "Auburn, WA", monthYearSold: "Jun 2024", daysOnMarket: 134 },
  ],
  "Retail": [
    { name: "Harbor Gift Co.", soldPrice: 285000, grossRevenue: 510000, sde: 105000, multiple: 2.71, location: "Olympia, WA", monthYearSold: "Feb 2025", daysOnMarket: 78 },
    { name: "Sound Souvenirs", soldPrice: 330000, grossRevenue: 580000, sde: 120000, multiple: 2.75, location: "Tacoma, WA", monthYearSold: "Nov 2024", daysOnMarket: 61 },
    { name: "Pike Place Apparel", soldPrice: 265000, grossRevenue: 475000, sde: 98000, multiple: 2.70, location: "Seattle, WA", monthYearSold: "Aug 2024", daysOnMarket: 90 },
  ],
};

// ── Market context (shown on seller preview) ─────────────────────────────

export interface MarketContext {
  activeListings: number;
  avgDaysToClose: number;
  avgMultiple: string;
  buyerDemandLevel: "High" | "Medium" | "Low";
  pricePositionNote: string;
}

export const MARKET_CONTEXT: Record<string, MarketContext> = {
  "Pest Control": {
    activeListings: 7,
    avgDaysToClose: 68,
    avgMultiple: "2.8x – 3.1x SDE",
    buyerDemandLevel: "High",
    pricePositionNote: "Pest control businesses in WA are in high demand. Recurring contract revenue commands a premium. Your pricing is well within market range.",
  },
  "Laundromat": {
    activeListings: 4,
    avgDaysToClose: 48,
    avgMultiple: "3.7x – 4.2x SDE",
    buyerDemandLevel: "High",
    pricePositionNote: "Laundromats are among the fastest-selling businesses in WA due to low owner hours and strong cash flow. Expect strong interest from absentee-owner buyers.",
  },
  "Landscaping": {
    activeListings: 11,
    avgDaysToClose: 88,
    avgMultiple: "2.7x – 3.0x SDE",
    buyerDemandLevel: "Medium",
    pricePositionNote: "Landscaping businesses with HOA contracts and established crews sell well. Buyers pay more for documented processes and crew independence from the owner.",
  },
  "Cleaning Service": {
    activeListings: 9,
    avgDaysToClose: 49,
    avgMultiple: "1.9x – 2.2x SDE",
    buyerDemandLevel: "High",
    pricePositionNote: "Cleaning services with recurring residential accounts close quickly. Your strong online reputation and low asking multiple relative to SDE make this attractive.",
  },
  "Restaurant": {
    activeListings: 18,
    avgDaysToClose: 114,
    avgMultiple: "1.8x – 2.3x SDE",
    buyerDemandLevel: "Medium",
    pricePositionNote: "Restaurants take longer to sell due to higher buyer scrutiny. Delivery revenue diversification and below-average asking multiple will help attract faster offers.",
  },
  "Retail": {
    activeListings: 14,
    avgDaysToClose: 76,
    avgMultiple: "2.5x – 3.0x SDE",
    buyerDemandLevel: "Medium",
    pricePositionNote: "Retail businesses with below-market leases and destination traffic sell well. Seasonal revenue concentration is a common buyer concern — be prepared to address it.",
  },
};

export function getMarketContext(businessType: string): MarketContext {
  return (
    MARKET_CONTEXT[businessType] ?? {
      activeListings: 8,
      avgDaysToClose: 75,
      avgMultiple: "2.0x – 3.0x SDE",
      buyerDemandLevel: "Medium",
      pricePositionNote: "Market data for this business type is limited in WA. We recommend pricing competitively based on your SDE multiple and highlighting recurring revenue.",
    }
  );
}

export function getComparables(businessType: string): ComparableSale[] {
  return COMPARABLE_SALES[businessType] ?? [];
}
