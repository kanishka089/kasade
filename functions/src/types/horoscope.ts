export interface HoroscopeData {
  birthDate: string;
  birthTime: string;
  birthPlace: { name: string; latitude: number; longitude: number; timezone: string };
  rashi: number;
  nakshatra: number;
  nakshatraPada: number;
  lagna: number;
  planetPositions: Record<string, { rashi: number; degree: number; nakshatra: number }>;
  horoscopeSource: 'calculated' | 'user_provided' | 'user_confirmed_override';
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
  recommendation: 'excellent' | 'good' | 'average' | 'below_average' | 'not_recommended';
}
