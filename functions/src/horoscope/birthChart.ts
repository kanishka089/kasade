import { BirthData, HoroscopeResult, PlanetPosition } from "./types";
import {
  dateToJulianDay,
  getAllTropicalLongitudes,
  tropicalToSidereal,
  calculateAscendant,
  getTimezoneOffsetHours,
} from "./ephemeris";

/**
 * Derive a PlanetPosition from a sidereal longitude.
 */
function makePlanetPosition(siderealLongitude: number): PlanetPosition {
  const lng = ((siderealLongitude % 360) + 360) % 360;

  const rashi = Math.floor(lng / 30);
  const degree = lng % 30;
  const nakshatraSpan = 360 / 27; // 13.3333...
  const nakshatra = Math.floor(lng / nakshatraSpan);
  const padaSpan = 360 / 108; // 3.3333...
  const nakshatraPada = Math.floor((lng % nakshatraSpan) / padaSpan) + 1;

  return {
    rashi,
    degree: Math.round(degree * 1000) / 1000,
    nakshatra,
    nakshatraPada: Math.min(nakshatraPada, 4),
    longitude: Math.round(lng * 1000) / 1000,
  };
}

/**
 * Generate a complete Vedic horoscope from birth data.
 */
export function generateHoroscope(birthData: BirthData): HoroscopeResult {
  // Parse date
  const [yearStr, monthStr, dayStr] = birthData.date.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Parse time
  const [hourStr, minuteStr] = birthData.time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Convert local time to UT
  const tzOffset = getTimezoneOffsetHours(birthData.place.timezone);
  const utHour = hour - tzOffset;
  const utMinute = minute;

  // Calculate Julian Day in UT
  const jd = dateToJulianDay(year, month, day, utHour, utMinute);

  // Get all tropical longitudes
  const tropicalPositions = getAllTropicalLongitudes(jd);

  // Convert each to sidereal
  const siderealPositions: Record<string, PlanetPosition> = {};
  for (const [planet, tropLong] of Object.entries(tropicalPositions)) {
    const sidLong = tropicalToSidereal(tropLong, jd);
    siderealPositions[planet] = makePlanetPosition(sidLong);
  }

  // Calculate Ascendant (Lagna)
  const tropicalAsc = calculateAscendant(
    jd,
    birthData.place.latitude,
    birthData.place.longitude
  );
  const siderealAsc = tropicalToSidereal(tropicalAsc, jd);
  const lagnaRashi = Math.floor(((siderealAsc % 360) + 360) % 360 / 30);

  // Moon-derived values
  const moonPos = siderealPositions["moon"];

  return {
    rashi: moonPos.rashi,
    nakshatra: moonPos.nakshatra,
    nakshatraPada: moonPos.nakshatraPada,
    lagna: lagnaRashi,
    planetPositions: {
      sun: siderealPositions["sun"],
      moon: siderealPositions["moon"],
      mars: siderealPositions["mars"],
      mercury: siderealPositions["mercury"],
      jupiter: siderealPositions["jupiter"],
      venus: siderealPositions["venus"],
      saturn: siderealPositions["saturn"],
      rahu: siderealPositions["rahu"],
      ketu: siderealPositions["ketu"],
    },
  };
}
