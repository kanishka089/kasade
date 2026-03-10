/**
 * Pure TypeScript astronomical calculations for Vedic astrology.
 * Uses simplified algorithms based on Meeus' "Astronomical Algorithms".
 * Accuracy: Sun ~0.5°, Moon ~1-2°, other planets ~2-5° (sufficient for Vedic rashi/nakshatra).
 */

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/** Normalize angle to 0-360 range */
function normalize360(deg: number): number {
  let result = deg % 360;
  if (result < 0) result += 360;
  return result;
}

/** Convert degrees to radians */
function rad(deg: number): number {
  return deg * DEG_TO_RAD;
}

/**
 * Calculate Julian Day Number from a calendar date and time (UT).
 * Based on Meeus ch. 7.
 */
export function dateToJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
): number {
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFraction +
    B -
    1524.5
  );
}

/**
 * Julian centuries from J2000.0 epoch (JD 2451545.0).
 */
function julianCenturiesFromJ2000(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * Calculate Lahiri Ayanamsa for a given Julian Day.
 * Standard formula: ~23°51' at J2000.0 (year 2000), precessing at ~50.27"/year.
 * More precisely uses the official Lahiri value.
 */
export function lahiriAyanamsa(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);

  // Lahiri ayanamsa at J2000.0 = 23.853 degrees (23°51'10.8")
  // Precession rate: ~50.2788" per year = 0.01396333° per year
  const ayanamsaAtJ2000 = 23.853;
  const precessionPerYear = 50.2788 / 3600; // convert arcseconds to degrees
  const yearsSinceJ2000 = T * 100;

  return ayanamsaAtJ2000 + precessionPerYear * yearsSinceJ2000;
}

/**
 * Calculate tropical longitude of the Sun (simplified, ~0.5° accuracy).
 * Based on Meeus ch. 25 (low accuracy method).
 */
export function solarLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);

  // Geometric mean longitude of the Sun (degrees)
  const L0 = normalize360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

  // Mean anomaly of the Sun (degrees)
  const M = normalize360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);

  // Equation of center
  const C =
    (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(rad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(rad(2 * M)) +
    0.00029 * Math.sin(rad(3 * M));

  // Sun's true longitude
  const sunLong = normalize360(L0 + C);

  // Apparent longitude (nutation correction, simplified)
  const omega = 125.04 - 1934.136 * T;
  const apparent = sunLong - 0.00569 - 0.00478 * Math.sin(rad(omega));

  return normalize360(apparent);
}

/**
 * Calculate tropical longitude of the Moon (simplified Meeus, ~1-2° accuracy).
 * Based on Meeus ch. 47 (reduced terms).
 */
export function lunarLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);

  // Moon's mean longitude (L')
  const Lp = normalize360(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841 -
      (T * T * T * T) / 65194000
  );

  // Moon's mean elongation (D)
  const D = normalize360(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      (T * T * T) / 545868 -
      (T * T * T * T) / 113065000
  );

  // Sun's mean anomaly (M)
  const M = normalize360(
    357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000
  );

  // Moon's mean anomaly (M')
  const Mp = normalize360(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      (T * T * T) / 69699 -
      (T * T * T * T) / 14712000
  );

  // Moon's argument of latitude (F)
  const F = normalize360(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      (T * T * T) / 3526000 +
      (T * T * T * T) / 863310000
  );

  // Longitude correction terms (main terms from Meeus Table 47.A)
  const dL =
    6288774 * Math.sin(rad(Mp)) +
    1274027 * Math.sin(rad(2 * D - Mp)) +
    658314 * Math.sin(rad(2 * D)) +
    213618 * Math.sin(rad(2 * Mp)) +
    -185116 * Math.sin(rad(M)) +
    -114332 * Math.sin(rad(2 * F)) +
    58793 * Math.sin(rad(2 * D - 2 * Mp)) +
    57066 * Math.sin(rad(2 * D - M - Mp)) +
    53322 * Math.sin(rad(2 * D + Mp)) +
    45758 * Math.sin(rad(2 * D - M)) +
    -40923 * Math.sin(rad(M - Mp)) +
    -34720 * Math.sin(rad(D)) +
    -30383 * Math.sin(rad(M + Mp)) +
    15327 * Math.sin(rad(2 * D - 2 * F)) +
    -12528 * Math.sin(rad(Mp + 2 * F)) +
    10980 * Math.sin(rad(Mp - 2 * F)) +
    10675 * Math.sin(rad(4 * D - Mp)) +
    10034 * Math.sin(rad(3 * Mp)) +
    8548 * Math.sin(rad(4 * D - 2 * Mp)) +
    -7888 * Math.sin(rad(2 * D + M - Mp)) +
    -6766 * Math.sin(rad(2 * D + M)) +
    -5163 * Math.sin(rad(D - Mp)) +
    4987 * Math.sin(rad(D + M)) +
    4036 * Math.sin(rad(2 * D - M + Mp));

  const moonLong = Lp + dL / 1000000;

  return normalize360(moonLong);
}

/**
 * Mean longitude of Mars (tropical, approximate).
 */
export function marsLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);
  const L = 355.433275 + 19141.6964746 * T + 0.00031097 * T * T;
  const M = 19.3730 + 19139.8585 * T + 0.0001 * T * T;

  // Equation of center (simplified)
  const C =
    10.6912 * Math.sin(rad(M)) +
    0.6228 * Math.sin(rad(2 * M)) +
    0.0503 * Math.sin(rad(3 * M));

  return normalize360(L + C);
}

/**
 * Mean longitude of Mercury (tropical, approximate).
 */
export function mercuryLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);
  const L = 252.250906 + 149474.0722491 * T + 0.00030397 * T * T;
  const M = 174.7948 + 149472.5153 * T + 0.0002 * T * T;

  // Equation of center
  const C =
    23.4400 * Math.sin(rad(M)) +
    2.9818 * Math.sin(rad(2 * M)) +
    0.5255 * Math.sin(rad(3 * M));

  return normalize360(L + C);
}

/**
 * Mean longitude of Jupiter (tropical, approximate).
 */
export function jupiterLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);
  const L = 34.351484 + 3036.3027889 * T + 0.0002233 * T * T;
  const M = 20.0202 + 3034.6957 * T - 0.0001 * T * T;

  const C =
    5.5549 * Math.sin(rad(M)) +
    0.1683 * Math.sin(rad(2 * M)) +
    0.0071 * Math.sin(rad(3 * M));

  return normalize360(L + C);
}

/**
 * Mean longitude of Venus (tropical, approximate).
 */
export function venusLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);
  const L = 181.979801 + 58519.2130302 * T + 0.00031014 * T * T;
  const M = 50.4161 + 58517.8039 * T + 0.0001 * T * T;

  const C =
    0.7758 * Math.sin(rad(M)) +
    0.0033 * Math.sin(rad(2 * M));

  return normalize360(L + C);
}

/**
 * Mean longitude of Saturn (tropical, approximate).
 */
export function saturnLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);
  const L = 50.077471 + 1223.5110141 * T + 0.0002136 * T * T;
  const M = 317.0207 + 1222.1138 * T - 0.0001 * T * T;

  const C =
    6.3642 * Math.sin(rad(M)) +
    0.2139 * Math.sin(rad(2 * M)) +
    0.0100 * Math.sin(rad(3 * M));

  return normalize360(L + C);
}

/**
 * Mean longitude of Rahu (Moon's mean ascending node).
 * Rahu moves retrograde, ~19.355° per year.
 */
export function rahuLongitude(jd: number): number {
  const T = julianCenturiesFromJ2000(jd);

  // Mean longitude of ascending node (Omega)
  const omega =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441 -
    (T * T * T * T) / 60616000;

  return normalize360(omega);
}

/**
 * Ketu is always 180° opposite to Rahu.
 */
export function ketuLongitude(jd: number): number {
  return normalize360(rahuLongitude(jd) + 180);
}

/**
 * Convert tropical longitude to sidereal by subtracting Lahiri ayanamsa.
 */
export function tropicalToSidereal(
  tropicalLongitude: number,
  jd: number
): number {
  const ayanamsa = lahiriAyanamsa(jd);
  return normalize360(tropicalLongitude - ayanamsa);
}

/**
 * Get all tropical planetary longitudes for a given Julian Day.
 */
export function getAllTropicalLongitudes(jd: number): Record<string, number> {
  return {
    sun: solarLongitude(jd),
    moon: lunarLongitude(jd),
    mars: marsLongitude(jd),
    mercury: mercuryLongitude(jd),
    jupiter: jupiterLongitude(jd),
    venus: venusLongitude(jd),
    saturn: saturnLongitude(jd),
    rahu: rahuLongitude(jd),
    ketu: ketuLongitude(jd),
  };
}

/**
 * Calculate Local Sidereal Time (LST) in degrees.
 * Used for Lagna (Ascendant) calculation.
 */
export function localSiderealTime(jd: number, longitude: number): number {
  const T = julianCenturiesFromJ2000(jd);

  // Greenwich Mean Sidereal Time (in degrees)
  const GMST =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;

  // Local Sidereal Time = GMST + observer's longitude (east positive)
  return normalize360(GMST + longitude);
}

/**
 * Calculate the Ascendant (Lagna) tropical longitude.
 * Uses the standard formula based on LST and obliquity of the ecliptic.
 */
export function calculateAscendant(
  jd: number,
  latitude: number,
  longitude: number
): number {
  const LST = localSiderealTime(jd, longitude);
  const T = julianCenturiesFromJ2000(jd);

  // Mean obliquity of the ecliptic (Meeus ch. 22)
  const epsilon =
    23.4392911 - 0.0130042 * T - 0.00000164 * T * T + 0.000000503 * T * T * T;

  const RAMC = rad(LST); // Right Ascension of MC in radians
  const eps = rad(epsilon);
  const lat = rad(latitude);

  // Ascendant formula
  const y = -Math.cos(RAMC);
  const x =
    Math.sin(eps) * Math.tan(lat) + Math.cos(eps) * Math.sin(RAMC);

  let asc = Math.atan2(y, x) * RAD_TO_DEG;
  asc = normalize360(asc);

  return asc;
}

/**
 * Get timezone offset in hours from timezone name.
 * Handles common South Asian timezones; for others, falls back to a lookup.
 */
export function getTimezoneOffsetHours(timezone: string): number {
  const offsets: Record<string, number> = {
    "Asia/Colombo": 5.5,
    "Asia/Kolkata": 5.5,
    "Asia/Calcutta": 5.5,
    "Asia/Kathmandu": 5.75,
    "Asia/Dhaka": 6,
    "Asia/Karachi": 5,
    "Asia/Dubai": 4,
    "Asia/Singapore": 8,
    "Asia/Tokyo": 9,
    "Asia/Shanghai": 8,
    "Asia/Bangkok": 7,
    "Asia/Yangon": 6.5,
    "Europe/London": 0,
    "Europe/Paris": 1,
    "Europe/Berlin": 1,
    "America/New_York": -5,
    "America/Chicago": -6,
    "America/Denver": -7,
    "America/Los_Angeles": -8,
    "Pacific/Auckland": 12,
    "Australia/Sydney": 10,
    UTC: 0,
  };

  if (offsets[timezone] !== undefined) {
    return offsets[timezone];
  }

  // Try to parse offset format like "+5:30" or "-4:00"
  const match = timezone.match(/^([+-]?)(\d{1,2}):?(\d{2})?$/);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3] || "0", 10);
    return sign * (hours + minutes / 60);
  }

  // Default to UTC if unknown
  return 0;
}
