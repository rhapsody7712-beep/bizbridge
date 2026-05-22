import type { BuyerProfile, Listing } from "./types";
import { ALL_LISTINGS } from "./mockListings";

/**
 * Compute a 0–100 fit score for a listing against a buyer profile.
 *
 * Scoring breakdown:
 *  - Budget fit        35 pts  — asking price vs. buyer budget
 *  - Industry fit      25 pts  — listing type vs. preferred industry
 *  - Owner type fit    25 pts  — owner hours vs. buyer time / lifestyle
 *  - Priority fit      15 pts  — growth/cash-flow/risk alignment
 */
export function computeFitScore(
  listing: Omit<Listing, "fitScore">,
  profile: BuyerProfile
): number {
  let score = 0;

  // ── Budget fit (35 pts) ──────────────────────────────────────────────────
  const ratio = listing.askingPrice / profile.budget;
  if (ratio <= 0.75) score += 30;           // comfortably within budget
  else if (ratio <= 1.0) score += 35;       // right in budget sweet spot
  else if (ratio <= 1.15) score += 20;      // slightly over — still consider
  else if (ratio <= 1.3) score += 8;        // noticeably over
  else score += 0;                          // out of range

  // ── Industry fit (25 pts) ───────────────────────────────────────────────
  const industry = profile.industry.toLowerCase();
  const type = listing.type.toLowerCase();
  if (industry === "other") {
    score += 15; // buyer is open — partial credit
  } else if (type.includes(industry) || industry.includes(type)) {
    score += 25; // exact or close match
  } else {
    // partial keyword matches (e.g. "cleaning service" vs "cleaning")
    const industryWords = industry.split(" ");
    const typeWords = type.split(" ");
    const hasOverlap = industryWords.some((w) => typeWords.includes(w));
    score += hasOverlap ? 12 : 0;
  }

  // ── Owner type / time fit (25 pts) ──────────────────────────────────────
  const hrs = listing.ownerHoursPerWeek;
  const ownerType = profile.ownerType;

  if (ownerType === "absentee") {
    if (hrs <= 10) score += 25;
    else if (hrs <= 20) score += 15;
    else if (hrs <= 30) score += 5;
    else score += 0;
  } else if (ownerType === "semi-absentee") {
    if (hrs >= 10 && hrs <= 25) score += 25;
    else if (hrs < 10 || (hrs > 25 && hrs <= 35)) score += 15;
    else score += 5;
  } else {
    // active owner
    if (hrs >= 25) score += 25;
    else if (hrs >= 15) score += 18;
    else score += 8;
  }

  // Also factor in buyer's time available
  const timeBuffer = profile.timeAvailable - hrs;
  if (timeBuffer >= 0) score += 0;            // they have enough time
  else if (timeBuffer >= -10) score -= 5;     // slightly short on time
  else score -= 12;                           // significantly under

  // ── Priority fit (15 pts) ───────────────────────────────────────────────
  const priority = profile.priority;
  if (priority === "cash-flow") {
    // reward high SDE margin
    if (listing.sdeMargin >= 35) score += 15;
    else if (listing.sdeMargin >= 20) score += 10;
    else score += 4;
  } else if (priority === "growth") {
    if (listing.growthTrend === "growing") score += 15;
    else if (listing.growthTrend === "stable") score += 7;
    else score += 0;
  } else {
    // lowest-risk: stable trend + established age + employees (built team)
    const age = new Date().getFullYear() - listing.yearEstablished;
    const agePoints = age >= 10 ? 8 : age >= 5 ? 5 : 2;
    const trendPoints = listing.growthTrend === "stable" ? 5 : listing.growthTrend === "growing" ? 3 : 0;
    const teamPoints = listing.employees >= 3 ? 2 : 0;
    score += Math.min(15, agePoints + trendPoints + teamPoints);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoredListings(profile: BuyerProfile): Listing[] {
  return ALL_LISTINGS.map((listing) => ({
    ...listing,
    fitScore: computeFitScore(listing, profile),
  })).sort((a, b) => b.fitScore - a.fitScore);
}
