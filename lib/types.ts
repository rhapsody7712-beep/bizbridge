export interface BuyerProfile {
  budget: number;
  timeAvailable: number;
  ownerType: "active" | "semi-absentee" | "absentee";
  industry: string;
  preferredState: string;
  priority: "cash-flow" | "growth" | "lowest-risk";
}

export interface Listing {
  id: string;
  name: string;
  type: string;
  askingPrice: number;
  revenue: number;
  location: string;
  fitScore: number;
  description: string;
}

export interface RiskScore {
  dimension: string;
  score: number;
  rationale: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface StaffingRole {
  title: string;
  fte: number;
  hourly_rate_range: string;
  annual_cost_est: string;
  required: string;
}

export interface DDReport {
  executive_summary: string;
  risk_scores: RiskScore[];
  swot: SWOT;
  watch_out_items: string[];
  staffing_estimate?: {
    roles: StaffingRole[];
    total_annual_est: string;
  };
}

export interface ValuationResult {
  low_estimate: number;
  high_estimate: number;
  sde_estimate: number;
  multiple_used: string;
  methodology_note: string;
}

export interface SellerProfile {
  businessType: string;
  cityState: string;
  annualRevenue: number;
  yearsInOperation: number;
  reasonForSelling: string;
}

export interface FinancialRow {
  year: string;
  grossRevenue: string;
  sde: string;
}

export interface SellerQuestionnaire {
  whySelling: string;
  askingPrice: string;
  financials: FinancialRow[];
  leaseInfo: string;
  ownerPresence: "yes" | "no" | "partially";
  documentNames: string[];
  sellerProfile: SellerProfile;
  valuation?: ValuationResult;
}
