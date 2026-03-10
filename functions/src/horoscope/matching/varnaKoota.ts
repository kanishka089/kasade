import { HoroscopeResult, KootaResult } from "../types";
import { RASHI_VARNA, RASHIS } from "../constants";

/**
 * Varna Koota (max 1 point).
 * Compares the Varna of groom's and bride's Moon rashi.
 * Groom's varna >= bride's varna = 1 point, else 0.
 */
export function calculateVarnaKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomVarna = RASHI_VARNA[groom.rashi];
  const brideVarna = RASHI_VARNA[bride.rashi];

  const score = groomVarna >= brideVarna ? 1 : 0;

  return {
    name: "Varna",
    score,
    maxScore: 1,
    description: `Groom: ${RASHIS[groom.rashi]} (Varna ${groomVarna}), Bride: ${RASHIS[bride.rashi]} (Varna ${brideVarna})`,
  };
}
