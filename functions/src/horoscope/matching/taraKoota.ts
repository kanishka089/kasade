import { HoroscopeResult, KootaResult } from "../types";
import { NAKSHATRAS } from "../constants";

/**
 * Tara Koota (max 3 points).
 * Counts nakshatras from groom to bride and bride to groom.
 * Each direction: (distance % 9) - if remainder is 3, 5, or 7 = inauspicious (0), else auspicious (1.5).
 * Sum both directions for max 3.
 */
export function calculateTaraKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomNak = groom.nakshatra;
  const brideNak = bride.nakshatra;

  // Distance from groom to bride (1-indexed)
  const dist1 = ((brideNak - groomNak + 27) % 27) + 1;
  // Distance from bride to groom (1-indexed)
  const dist2 = ((groomNak - brideNak + 27) % 27) + 1;

  const inauspicious = [3, 5, 7];

  const remainder1 = dist1 % 9 === 0 ? 9 : dist1 % 9;
  const remainder2 = dist2 % 9 === 0 ? 9 : dist2 % 9;

  const score1 = inauspicious.includes(remainder1) ? 0 : 1.5;
  const score2 = inauspicious.includes(remainder2) ? 0 : 1.5;

  const score = score1 + score2;

  return {
    name: "Tara",
    score,
    maxScore: 3,
    description: `Groom Nakshatra: ${NAKSHATRAS[groomNak]}, Bride Nakshatra: ${NAKSHATRAS[brideNak]}. Distances: ${dist1}, ${dist2}`,
  };
}
