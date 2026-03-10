import { HoroscopeResult, KootaResult } from "../types";
import {
  RASHI_VASHYA,
  VASHYA_CATEGORIES,
  VASHYA_COMPATIBILITY,
  RASHIS,
} from "../constants";

/**
 * Vashya Koota (max 2 points).
 * Maps both rashis to vashya categories and uses the 5x5 compatibility matrix.
 */
export function calculateVashyaKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomVashya = RASHI_VASHYA[groom.rashi];
  const brideVashya = RASHI_VASHYA[bride.rashi];

  const groomIdx = VASHYA_CATEGORIES.indexOf(groomVashya);
  const brideIdx = VASHYA_CATEGORIES.indexOf(brideVashya);

  const score = VASHYA_COMPATIBILITY[groomIdx][brideIdx];

  return {
    name: "Vashya",
    score,
    maxScore: 2,
    description: `Groom: ${RASHIS[groom.rashi]} (${groomVashya}), Bride: ${RASHIS[bride.rashi]} (${brideVashya})`,
  };
}
