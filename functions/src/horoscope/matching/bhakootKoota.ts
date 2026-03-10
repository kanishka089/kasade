import { HoroscopeResult, KootaResult } from "../types";
import { RASHI_LORDS, PLANETARY_FRIENDSHIP, RASHIS } from "../constants";

/**
 * Bhakoot Koota (max 7 points).
 * Calculate rashi distance between bride and groom (1-indexed).
 * Distances 2/12, 5/9, 6/8 = 0 points (with lord-based exceptions: if lords are same or friends, give 7).
 * All other distances = 7.
 */
export function calculateBhakootKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  // Distance from groom rashi to bride rashi (1-indexed)
  const dist = ((bride.rashi - groom.rashi + 12) % 12) + 1;

  // Check if distance falls in inauspicious pairs
  const inauspiciousPairs = [
    [2, 12],
    [5, 9],
    [6, 8],
  ];

  const isInauspicious = inauspiciousPairs.some(
    ([a, b]) => dist === a || dist === b
  );

  let score: number;

  if (!isInauspicious) {
    score = 7;
  } else {
    // Check lord-based exception
    const groomLord = RASHI_LORDS[groom.rashi];
    const brideLord = RASHI_LORDS[bride.rashi];

    if (groomLord === brideLord) {
      score = 7;
    } else {
      const friendship1 = PLANETARY_FRIENDSHIP[groomLord]?.[brideLord];
      const friendship2 = PLANETARY_FRIENDSHIP[brideLord]?.[groomLord];

      if (friendship1 === "F" && friendship2 === "F") {
        score = 7;
      } else {
        score = 0;
      }
    }
  }

  return {
    name: "Bhakoot",
    score,
    maxScore: 7,
    description: `Groom: ${RASHIS[groom.rashi]}, Bride: ${RASHIS[bride.rashi]}. Distance: ${dist}`,
  };
}
