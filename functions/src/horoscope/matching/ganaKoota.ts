import { HoroscopeResult, KootaResult } from "../types";
import { NAKSHATRA_GANA, GANA_COMPATIBILITY, NAKSHATRAS } from "../constants";

const GANA_NAMES = ["Deva", "Manushya", "Rakshasa"];

/**
 * Gana Koota (max 6 points).
 * Maps both nakshatras to their gana and uses the 3x3 compatibility matrix.
 */
export function calculateGanaKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomGana = NAKSHATRA_GANA[groom.nakshatra];
  const brideGana = NAKSHATRA_GANA[bride.nakshatra];

  const score = GANA_COMPATIBILITY[groomGana][brideGana];

  return {
    name: "Gana",
    score,
    maxScore: 6,
    description: `Groom: ${NAKSHATRAS[groom.nakshatra]} (${GANA_NAMES[groomGana]}), Bride: ${NAKSHATRAS[bride.nakshatra]} (${GANA_NAMES[brideGana]})`,
  };
}
