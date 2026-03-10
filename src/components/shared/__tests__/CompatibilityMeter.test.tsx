import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { CompatibilityMeter } from '../CompatibilityMeter';

describe('CompatibilityMeter', () => {
  it('renders percentage value', () => {
    render(<CompatibilityMeter percentage={85} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('rounds percentage', () => {
    render(<CompatibilityMeter percentage={72.6} />);
    expect(screen.getByText('73%')).toBeInTheDocument();
  });

  it('shows label by default', () => {
    render(<CompatibilityMeter percentage={50} />);
    expect(screen.getByText('Match')).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    render(<CompatibilityMeter percentage={50} showLabel={false} />);
    expect(screen.queryByText('Match')).not.toBeInTheDocument();
  });

  it('uses green color for 75%+', () => {
    render(<CompatibilityMeter percentage={80} />);
    expect(screen.getByText('80%')).toHaveStyle({ color: '#16a34a' });
  });

  it('uses gold color for 50-74%', () => {
    render(<CompatibilityMeter percentage={60} />);
    expect(screen.getByText('60%')).toHaveStyle({ color: '#d4a017' });
  });

  it('uses orange color for 25-49%', () => {
    render(<CompatibilityMeter percentage={30} />);
    expect(screen.getByText('30%')).toHaveStyle({ color: '#ea580c' });
  });

  it('uses red color for below 25%', () => {
    render(<CompatibilityMeter percentage={10} />);
    expect(screen.getByText('10%')).toHaveStyle({ color: '#dc2626' });
  });

  it('renders SVG circles', () => {
    const { container } = render(<CompatibilityMeter percentage={50} />);
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });
});
