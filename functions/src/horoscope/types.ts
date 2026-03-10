export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  place: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string; // e.g. "Asia/Colombo" (+5:30)
  };
}

export interface PlanetPosition {
  rashi: number; // 0-11
  degree: number; // degree within rashi (0-30)
  nakshatra: number; // 0-26
  nakshatraPada: number; // 1-4
  longitude: number; // absolute sidereal longitude 0-360
}

export interface HoroscopeResult {
  rashi: number; // Moon sign 0-11
  nakshatra: number; // Moon's nakshatra 0-26
  nakshatraPada: number; // 1-4
  lagna: number; // Ascendant rashi 0-11
  planetPositions: {
    sun: PlanetPosition;
    moon: PlanetPosition;
    mars: PlanetPosition;
    mercury: PlanetPosition;
    jupiter: PlanetPosition;
    venus: PlanetPosition;
    saturn: PlanetPosition;
    rahu: PlanetPosition;
    ketu: PlanetPosition;
  };
}

export interface KootaResult {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface MatchResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: KootaResult[];
  recommendation:
    | "excellent"
    | "good"
    | "average"
    | "below_average"
    | "not_recommended";
}

export interface ValidationResult {
  isMatch: boolean;
  differences: {
    field: string;
    calculated: string | number;
    provided: string | number;
  }[];
}
