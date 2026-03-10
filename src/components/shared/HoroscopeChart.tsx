import { useTranslation } from 'react-i18next';
import { RASHIS } from './horoscopeData';

const RASHIS_SI = ['මේෂ', 'වෘෂභ', 'මිථුන', 'කටක', 'සිංහ', 'කන්‍යා', 'තුලා', 'වෘශ්චික', 'ධනු', 'මකර', 'කුම්භ', 'මීන'];

interface HoroscopeChartProps {
  lagna: number | string;
  planetPositions: Record<string, { rashi: number | string; rashiIndex?: number; degree: number }>;
}

const PLANET_ABBR_SI: Record<string, string> = {
  sun: 'ඉ', moon: 'ච', mars: 'කු', mercury: 'බු',
  jupiter: 'ගු', venus: 'සි', saturn: 'ශ', rahu: 'රා', ketu: 'කේ',
};

const PLANET_ABBR_EN: Record<string, string> = {
  sun: 'Su', moon: 'Mo', mars: 'Ma', mercury: 'Me',
  jupiter: 'Ju', venus: 'Ve', saturn: 'Sa', rahu: 'Ra', ketu: 'Ke',
};

function toIndex(val: number | string | undefined, list: string[]): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const norm = (s: string) => s.toLowerCase().replace(/\s/g, '').replace(/h/g, '');
    let idx = list.findIndex((s) => s.toLowerCase() === val.toLowerCase());
    if (idx < 0) idx = list.findIndex((s) => norm(s) === norm(val));
    return idx >= 0 ? idx : 0;
  }
  return 0;
}

// North Indian diamond chart
// S = chart size, houses numbered 1-12 counter-clockwise from top
const S = 320;
const H = S / 2; // 160
const Q = S / 4; // 80

// House polygon vertices (12 triangular houses) - kept for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _HOUSE_POLYGONS: string[] = [
  /* 1  top center   */ `${H},0 ${Q},${Q} ${H+Q},${Q}`,
  /* 2  top-left up  */ `0,0 ${H},0 ${Q},${Q}`,
  /* 3  top-left low */ `0,0 ${Q},${Q} 0,${H}`,
  /* 4  left center  */ `0,${H} ${Q},${Q} ${Q},${H+Q}`,
  /* 5  bot-left up  */ `0,${S} 0,${H} ${Q},${H+Q}`,
  /* 6  bot-left low */ `0,${S} ${Q},${H+Q} ${H},${S}`,
  /* 7  bottom center*/ `${H},${S} ${Q},${H+Q} ${H+Q},${H+Q}`,
  /* 8  bot-right lo */ `${S},${S} ${H},${S} ${H+Q},${H+Q}`,
  /* 9  bot-right up */ `${S},${S} ${H+Q},${H+Q} ${S},${H}`,
  /* 10 right center */ `${S},${H} ${H+Q},${H+Q} ${H+Q},${Q}`,
  /* 11 top-right lo */ `${S},0 ${S},${H} ${H+Q},${Q}`,
  /* 12 top-right up */ `${S},0 ${H},0 ${H+Q},${Q}`,
];

// Text centers for each house (approximate centroids)
const HOUSE_CENTERS: [number, number][] = [
  [160, 48],   // 1
  [68, 22],    // 2
  [22, 68],    // 3
  [48, 160],   // 4
  [22, 252],   // 5
  [68, 298],   // 6
  [160, 272],  // 7
  [252, 298],  // 8
  [298, 252],  // 9
  [272, 160],  // 10
  [298, 68],   // 11
  [252, 22],   // 12
];

export function HoroscopeChart({ lagna, planetPositions }: HoroscopeChartProps) {
  const { i18n } = useTranslation();
  const isSi = i18n.language === 'si';
  const lagnaIndex = toIndex(lagna, RASHIS);
  const ABBR = isSi ? PLANET_ABBR_SI : PLANET_ABBR_EN;

  // Group planets by house index (0 = house 1 = lagna sign)
  const planetsByHouse: Record<number, string[]> = {};
  for (const [planet, pos] of Object.entries(planetPositions)) {
    const ri = pos.rashiIndex != null ? pos.rashiIndex : toIndex(pos.rashi, RASHIS);
    const houseIdx = ((ri - lagnaIndex) % 12 + 12) % 12;
    if (!planetsByHouse[houseIdx]) planetsByHouse[houseIdx] = [];
    planetsByHouse[houseIdx].push(ABBR[planet.toLowerCase()] || planet.substring(0, 2));
  }

  const lagnaName = isSi ? RASHIS_SI[lagnaIndex] : RASHIS[lagnaIndex];

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-xs mx-auto">
      {/* Background */}
      <rect x={0} y={0} width={S} height={S} fill="white" stroke="#333" strokeWidth={2} />

      {/* Diagonals (corner to corner) */}
      <line x1={0} y1={0} x2={S} y2={S} stroke="#333" strokeWidth={1} />
      <line x1={S} y1={0} x2={0} y2={S} stroke="#333" strokeWidth={1} />

      {/* Diamond (midpoint to midpoint) */}
      <polygon
        points={`${H},0 ${S},${H} ${H},${S} 0,${H}`}
        fill="none" stroke="#333" strokeWidth={1}
      />

      {/* Center square (covers diagonal intersection) */}
      <rect x={Q} y={Q} width={H} height={H} fill="white" stroke="#333" strokeWidth={1} />

      {/* Lagna name in center */}
      <text x={H} y={H - 6} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#333">
        {lagnaName}
      </text>
      <text x={H} y={H + 18} textAnchor="middle" fontSize={15} fill="#555">
        {isSi ? 'ලග්නය' : 'Lagna'}
      </text>

      {/* House contents */}
      {HOUSE_CENTERS.map(([cx, cy], houseIdx) => {
        const planets = planetsByHouse[houseIdx] || [];
        const isCorner = [1, 2, 4, 5, 7, 8, 10, 11].includes(houseIdx);
        const fontSize = isCorner ? 13 : 15;

        return (
          <g key={houseIdx}>
            {/* House number (small, gray) */}
            <text
              x={cx}
              y={cy - (planets.length > 0 ? 10 : 2)}
              textAnchor="middle"
              fontSize={12}
              fontWeight="600"
              fill="#888"
            >
              {houseIdx + 1}
            </text>
            {/* Planets */}
            {planets.length > 0 && (
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill="#222"
              >
                {planets.join('  ')}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
