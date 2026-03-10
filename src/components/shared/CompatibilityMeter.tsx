import { useTranslation } from 'react-i18next';

interface CompatibilityMeterProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeConfig = {
  sm: { width: 48, stroke: 4, fontSize: 'text-xs' },
  md: { width: 72, stroke: 5, fontSize: 'text-sm' },
  lg: { width: 96, stroke: 6, fontSize: 'text-lg' },
};

function getColor(pct: number) {
  if (pct >= 75) return '#16a34a';
  if (pct >= 50) return '#d4a017';
  if (pct >= 25) return '#ea580c';
  return '#dc2626';
}

export function CompatibilityMeter({ percentage, size = 'md', showLabel = true }: CompatibilityMeterProps) {
  const { t } = useTranslation();
  const config = sizeConfig[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getColor(percentage);

  return (
    <div className="flex flex-col items-center">
      <svg width={config.width} height={config.width} className="-rotate-90">
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={config.stroke}
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className={`${config.fontSize} font-bold mt-1`} style={{ color }}>
        {Math.round(percentage)}%
      </span>
      {showLabel && <span className="text-xs text-gray-500">{t('profile.match')}</span>}
    </div>
  );
}
