import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Input } from './Input';

afterEach(() => {
  cleanup();
});

describe('Input', () => {
  describe('default rendering', () => {
    it('renders an input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has data-slot="input"', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
    });
  });

  describe('default styling', () => {
    it('has border-border class', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('border-border');
    });

    it('has h-10 class', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('h-10');
    });

    it('has rounded-lg class', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('rounded-lg');
    });
  });

  describe('custom className merging', () => {
    it('merges custom className with default classes', () => {
      render(<Input className="mt-4" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('mt-4');
      expect(input).toHaveClass('border-border');
    });
  });

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is passed', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('placeholder', () => {
    it('passes placeholder text', () => {
      render(<Input placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });
  });

  describe('type prop', () => {
    it('passes type="email"', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('snapshots', () => {
    it('default input matches snapshot', () => {
      const { container } = render(<Input placeholder="Placeholder" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
