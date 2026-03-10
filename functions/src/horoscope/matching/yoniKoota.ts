import { HoroscopeResult, KootaResult } from "../types";
import {
  NAKSHATRA_YONI,
  YONI_ANIMALS,
  YONI_COMPATIBILITY,
  NAKSHATRAS,
} from "../constants";

/**
 * Yoni Koota (max 4 points).
 * Maps both nakshatras to their yoni animals and uses the 14x14 compatibility matrix.
 */
export function calculateYoniKoota(
  groom: HoroscopeResult,
  bride: HoroscopeResult
): KootaResult {
  const groomYoni = NAKSHATRA_YONI[groom.nakshatra];
  const brideYoni = NAKSHATRA_YONI[bride.nakshatra];

  const groomAnimalIdx = YONI_ANIMALS.indexOf(groomYoni[0]);
  const brideAnimalIdx = YONI_ANIMALS.indexOf(brideYoni[0]);

  const score = YONI_COMPATIBILITY[groomAnimalIdx][brideAnimalIdx];

  return {
    name: "Yoni",
    score,
    maxScore: 4,
    description: `Groom: ${NAKSHATRAS[groom.nakshatra]} (${groomYoni[0]} ${groomYoni[1]}), Bride: ${NAKSHATRAS[bride.nakshatra]} (${brideYoni[0]} ${brideYoni[1]})`,
  };
}
