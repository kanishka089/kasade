import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(<Card header={<h3>Title</h3>}>Body</Card>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button>Save</button>}>Body</Card>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });
});
