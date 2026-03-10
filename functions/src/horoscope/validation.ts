import { HoroscopeResult, ValidationResult } from "./types";
import { RASHIS, NAKSHATRAS } from "./constants";

/**
 * Compare a calculated horoscope against provided (user-supplied) values.
 * Returns whether they match and a list of differences.
 */
export function validateHoroscope(
  calculated: HoroscopeResult,
  provided: Partial<HoroscopeResult>
): ValidationResult {
  const differences: ValidationResult["differences"] = [];

  if (provided.rashi !== undefined && provided.rashi !== calculated.rashi) {
    differences.push({
      field: "rashi",
      calculated: `${calculated.rashi} (${RASHIS[calculated.rashi]})`,
      provided: `${provided.rashi} (${RASHIS[provided.rashi]})`,
    });
  }

  if (
    provided.nakshatra !== undefined &&
    provided.nakshatra !== calculated.nakshatra
  ) {
    differences.push({
      field: "nakshatra",
      calculated: `${calculated.nakshatra} (${NAKSHATRAS[calculated.nakshatra]})`,
      provided: `${provided.nakshatra} (${NAKSHATRAS[provided.nakshatra]})`,
    });
  }

  if (
    provided.nakshatraPada !== undefined &&
    provided.nakshatraPada !== calculated.nakshatraPada
  ) {
    differences.push({
      field: "nakshatraPada",
      calculated: calculated.nakshatraPada,
      provided: provided.nakshatraPada,
    });
  }

  if (provided.lagna !== undefined && provided.lagna !== calculated.lagna) {
    differences.push({
      field: "lagna",
      calculated: `${calculated.lagna} (${RASHIS[calculated.lagna]})`,
      provided: `${provided.lagna} (${RASHIS[provided.lagna]})`,
    });
  }

  return {
    isMatch: differences.length === 0,
    differences,
  };
}
