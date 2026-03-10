import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal isOpen={false} onClose={vi.fn()}>Content</Modal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="My Modal">Body</Modal>);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test">Body</Modal>);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);
    rerender(<Modal isOpen={false} onClose={vi.fn()}>Content</Modal>);
    expect(document.body.style.overflow).toBe('');
  });
});
