import { HoroscopeResult, KootaResult } from "../types";
import { RASHI_LORDS, PLANETARY_FRIENDSHIP, RASHIS } from "../constants";

/**
 * Graha Maitri Koota (max 5 points).
 * Gets the lords of both Moon rashis and looks up planetary friendship.
 * Both friends = 5, one friend one neutral = 4, both neutral = 3,
 * one friend one enemy = 1, one neutral one enemy = 0.5, both enemies = 0.
 */
export function calculateGrahaMaitri(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomLord = RASHI_LORDS[groom.rashi];
  const brideLord = RASHI_LORDS[bride.rashi];

  let score: number;

  if (groomLord === brideLord) {
    // Same lord = maximum compatibility
    score = 5;
  } else {
    const groomToBride = PLANETARY_FRIENDSHIP[groomLord][brideLord];
    const brideToGroom = PLANETARY_FRIENDSHIP[brideLord][groomLord];

    const combo = [groomToBride, brideToGroom].sort().join("");

    if (combo === "FF") {
      score = 5;
    } else if (combo === "FN") {
      score = 4;
    } else if (combo === "NN") {
      score = 3;
    } else if (combo === "EF") {
      score = 1;
    } else if (combo === "EN") {
      score = 0.5;
    } else {
      // EE
      score = 0;
    }
  }

  return {
    name: "Graha Maitri",
    score,
    maxScore: 5,
    description: `Groom: ${RASHIS[groom.rashi]} (Lord: ${groomLord}), Bride: ${RASHIS[bride.rashi]} (Lord: ${brideLord})`,
  };
}
