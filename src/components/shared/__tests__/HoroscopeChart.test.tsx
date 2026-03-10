import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { HoroscopeChart } from '../HoroscopeChart';

const mockPlanets = {
  sun: { rashi: 'Mesha', rashiIndex: 0, degree: 15 },
  moon: { rashi: 'Karka', rashiIndex: 3, degree: 22 },
  mars: { rashi: 'Simha', rashiIndex: 4, degree: 8 },
  jupiter: { rashi: 'Tula', rashiIndex: 6, degree: 12 },
};

describe('HoroscopeChart', () => {
  it('renders lagna name', () => {
    render(<HoroscopeChart lagna={9} planetPositions={mockPlanets} />);
    expect(screen.getByText('Makara')).toBeInTheDocument();
  });

  it('renders Lagna label', () => {
    render(<HoroscopeChart lagna={0} planetPositions={mockPlanets} />);
    expect(screen.getByText('Lagna')).toBeInTheDocument();
  });

  it('renders all 12 house numbers', () => {
    render(<HoroscopeChart lagna={0} planetPositions={{}} />);
    for (let i = 1; i <= 12; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('renders planet abbreviations', () => {
    render(<HoroscopeChart lagna={0} planetPositions={mockPlanets} />);
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
  });

  it('renders SVG element', () => {
    const { container } = render(<HoroscopeChart lagna={0} planetPositions={{}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
