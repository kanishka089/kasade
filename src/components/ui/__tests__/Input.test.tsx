import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('applies error styling when error exists', () => {
    render(<Input error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('accepts user input', async () => {
    render(<Input placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    await userEvent.type(input, 'John');
    expect(input).toHaveValue('John');
  });
});
