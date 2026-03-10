import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-gray-100');
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Approved</Badge>);
    expect(screen.getByText('Approved')).toHaveClass('bg-green-100');
  });

  it('applies danger variant', () => {
    render(<Badge variant="danger">Rejected</Badge>);
    expect(screen.getByText('Rejected')).toHaveClass('bg-red-100');
  });

  it('accepts custom className', () => {
    render(<Badge className="mt-2">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('mt-2');
  });
});
