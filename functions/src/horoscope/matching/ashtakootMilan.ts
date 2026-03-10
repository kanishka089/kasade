import { HoroscopeResult, MatchResult } from "../types";
import { calculateVarnaKoota } from "./varnaKoota";
import { calculateVashyaKoota } from "./vashyaKoota";
import { calculateTaraKoota } from "./taraKoota";
import { calculateYoniKoota } from "./yoniKoota";
import { calculateGrahaMaitri } from "./grahaMaitri";
import { calculateGanaKoota } from "./ganaKoota";
import { calculateBhakootKoota } from "./bhakootKoota";
import { calculateNadiKoota } from "./nadiKoota";

/**
 * Calculate Ashtakoota compatibility between two horoscopes.
 * Groom = horoscope1, Bride = horoscope2.
 * Max score: 36 points.
 */
export function calculateCompatibility(
  horoscope1: HoroscopeResult,
  horoscope2: HoroscopeResult
): MatchResult {
  const breakdown = [
    calculateVarnaKoota(horoscope1, horoscope2),
    calculateVashyaKoota(horoscope1, horoscope2),
    calculateTaraKoota(horoscope1, horoscope2),
    calculateYoniKoota(horoscope1, horoscope2),
    calculateGrahaMaitri(horoscope1, horoscope2),
    calculateGanaKoota(horoscope1, horoscope2),
    calculateBhakootKoota(horoscope1, horoscope2),
    calculateNadiKoota(horoscope1, horoscope2),
  ];

  const totalScore = breakdown.reduce((sum, k) => sum + k.score, 0);
  const maxScore = 36;
  const percentage = Math.round((totalScore / maxScore) * 100 * 10) / 10;

  let recommendation: MatchResult["recommendation"];
  if (totalScore >= 28) {
    recommendation = "excellent";
  } else if (totalScore >= 21) {
    recommendation = "good";
  } else if (totalScore >= 18) {
    recommendation = "average";
  } else if (totalScore >= 14) {
    recommendation = "below_average";
  } else {
    recommendation = "not_recommended";
  }

  return {
    totalScore,
    maxScore,
    percentage,
    breakdown,
    recommendation,
  };
}
