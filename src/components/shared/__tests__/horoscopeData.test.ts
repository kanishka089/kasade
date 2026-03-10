import { describe, it, expect } from 'vitest';
import { RASHIS, NAKSHATRAS } from '../horoscopeData';

describe('Horoscope Data', () => {
  it('has exactly 12 rashis', () => {
    expect(RASHIS).toHaveLength(12);
  });

  it('has exactly 27 nakshatras', () => {
    expect(NAKSHATRAS).toHaveLength(27);
  });

  it('starts with Mesha (Aries)', () => {
    expect(RASHIS[0]).toBe('Mesha');
  });

  it('ends with Meena (Pisces)', () => {
    expect(RASHIS[11]).toBe('Meena');
  });

  it('starts with Ashwini nakshatra', () => {
    expect(NAKSHATRAS[0]).toBe('Ashwini');
  });

  it('ends with Revati nakshatra', () => {
    expect(NAKSHATRAS[26]).toBe('Revati');
  });

  it('contains all zodiac signs', () => {
    const expected = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
      'Tula', 'Vrischika', 'Dhanus', 'Makara', 'Kumbha', 'Meena'];
    expect(RASHIS).toEqual(expected);
  });
});
