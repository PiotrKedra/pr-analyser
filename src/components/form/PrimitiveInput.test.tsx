import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PrimitiveInput } from './PrimitiveInput';

afterEach(() => {
  cleanup();
});

describe('PrimitiveInput', () => {
  describe('default rendering', () => {
    it('renders an input element', () => {
      render(<PrimitiveInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('has default base classes', () => {
      render(<PrimitiveInput />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-border');
      expect(input).toHaveClass('rounded-lg');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-3');
    });
  });

  describe('error state', () => {
    it('applies error classes when error is set', () => {
      render(<PrimitiveInput error="Required" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
      expect(input).toHaveClass('focus:border-destructive');
    });

    it('has no error classes when error is null', () => {
      render(<PrimitiveInput error={null} />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveClass('border-destructive');
    });

    it('has no error classes when error is undefined', () => {
      render(<PrimitiveInput />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveClass('border-destructive');
    });
  });

  describe('custom className merging', () => {
    it('merges custom className with base classes', () => {
      render(<PrimitiveInput className="mt-4" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('mt-4');
      expect(input).toHaveClass('border-border');
    });
  });

  describe('HTML attribute forwarding', () => {
    it('forwards placeholder', () => {
      render(<PrimitiveInput placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('forwards disabled', () => {
      render(<PrimitiveInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('forwards type', () => {
      render(<PrimitiveInput type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('snapshots', () => {
    it('default matches snapshot', () => {
      const { container } = render(<PrimitiveInput />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('with error matches snapshot', () => {
      const { container } = render(<PrimitiveInput error="Required field" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
