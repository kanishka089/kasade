import { HoroscopeResult, KootaResult } from "../types";
import { NAKSHATRA_NADI, NAKSHATRAS } from "../constants";

const NADI_NAMES = ["Aadi", "Madhya", "Antya"];

/**
 * Nadi Koota (max 8 points).
 * Maps both nakshatras to their nadi.
 * Same nadi = 0 points, different nadi = 8 points.
 */
export function calculateNadiKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomNadi = NAKSHATRA_NADI[groom.nakshatra];
  const brideNadi = NAKSHATRA_NADI[bride.nakshatra];

  const score = groomNadi === brideNadi ? 0 : 8;

  return {
    name: "Nadi",
    score,
    maxScore: 8,
    description: `Groom: ${NAKSHATRAS[groom.nakshatra]} (${NADI_NAMES[groomNadi]}), Bride: ${NAKSHATRAS[bride.nakshatra]} (${NADI_NAMES[brideNadi]})`,
  };
}
