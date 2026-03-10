import { HoroscopeData } from '../types/horoscope';
import { HoroscopeResult, PlanetPosition } from '../horoscope/types';
import { RASHIS, NAKSHATRAS } from '../horoscope/constants';

const PLANET_KEYS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'] as const;

/** Resolve a value that may be a numeric index or a string name to a numeric index */
function toRashiIndex(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const idx = RASHIS.findIndex((r) => r.toLowerCase() === val.toLowerCase());
    return idx >= 0 ? idx : 0;
  }
  return 0;
}

function toNakshatraIndex(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const idx = NAKSHATRAS.findIndex((n) => n.toLowerCase().replace(/\s/g, '') === val.toLowerCase().replace(/\s/g, ''));
    return idx >= 0 ? idx : 0;
  }
  return 0;
}

/**
 * Convert engine HoroscopeResult to controller HoroscopeData.
 */
export function horoscopeResultToData(
  result: HoroscopeResult,
  birthDate: string,
  birthTime: string,
  birthPlace: { name: string; latitude: number; longitude: number; timezone: string },
  source: HoroscopeData['horoscopeSource'],
): HoroscopeData {
  const planetPositions: Record<string, { rashi: number; degree: number; nakshatra: number }> = {};

  for (const planet of PLANET_KEYS) {
    const pos = result.planetPositions[planet];
    planetPositions[planet] = {
      rashi: pos.rashi,
      degree: pos.degree,
      nakshatra: pos.nakshatra,
    };
  }

  return {
    birthDate,
    birthTime,
    birthPlace,
    rashi: result.rashi,
    nakshatra: result.nakshatra,
    nakshatraPada: result.nakshatraPada,
    lagna: result.lagna,
    planetPositions,
    horoscopeSource: source,
  };
}

/**
 * Convert controller HoroscopeData (from DB) to engine HoroscopeResult.
 * Handles both numeric indices and string names for rashi/nakshatra fields,
 * since data may come from the horoscope engine (numbers) or user-provided seed data (strings).
 */
export function horoscopeDataToResult(data: any): HoroscopeResult {
  function toPlanetPosition(pos: any): PlanetPosition {
    if (!pos) {
      return { rashi: 0, degree: 0, nakshatra: 0, nakshatraPada: 1, longitude: 0 };
    }
    const rashi = pos.rashiIndex != null ? pos.rashiIndex : toRashiIndex(pos.rashi);
    const nakshatra = toNakshatraIndex(pos.nakshatra);
    const degree = typeof pos.degree === 'number' ? pos.degree : 0;
    return {
      rashi,
      degree,
      nakshatra,
      nakshatraPada: pos.nakshatraPada || 1,
      longitude: rashi * 30 + degree,
    };
  }

  const rashi = toRashiIndex(data.rashi);
  const nakshatra = toNakshatraIndex(data.nakshatra);
  const lagna = toRashiIndex(data.lagna);

  // Handle both uppercase and lowercase planet keys
  const pp = data.planetPositions || {};
  const getPlanet = (name: string) => pp[name] || pp[name.charAt(0).toUpperCase() + name.slice(1)] || undefined;

  return {
    rashi,
    nakshatra,
    nakshatraPada: data.nakshatraPada || 1,
    lagna,
    planetPositions: {
      sun: toPlanetPosition(getPlanet('sun')),
      moon: toPlanetPosition(getPlanet('moon')),
      mars: toPlanetPosition(getPlanet('mars')),
      mercury: toPlanetPosition(getPlanet('mercury')),
      jupiter: toPlanetPosition(getPlanet('jupiter')),
      venus: toPlanetPosition(getPlanet('venus')),
      saturn: toPlanetPosition(getPlanet('saturn')),
      rahu: toPlanetPosition(getPlanet('rahu')),
      ketu: toPlanetPosition(getPlanet('ketu')),
    },
  };
}
