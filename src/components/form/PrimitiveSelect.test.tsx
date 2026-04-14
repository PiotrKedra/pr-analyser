import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PrimitiveSelect } from './PrimitiveSelect';

afterEach(() => {
  cleanup();
});

describe('PrimitiveSelect', () => {
  describe('default rendering', () => {
    it('renders a select element', () => {
      render(<PrimitiveSelect aria-label="test" />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has default base classes', () => {
      render(<PrimitiveSelect aria-label="test" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-border');
      expect(select).toHaveClass('rounded-lg');
      expect(select).toHaveClass('appearance-none');
    });
  });

  describe('error state', () => {
    it('applies error classes when error is set', () => {
      render(<PrimitiveSelect aria-label="test" error="Required" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-destructive');
      expect(select).toHaveClass('focus:border-destructive');
    });

    it('has no error classes when error is null', () => {
      render(<PrimitiveSelect aria-label="test" error={null} />);
      const select = screen.getByRole('combobox');
      expect(select).not.toHaveClass('border-destructive');
    });

    it('has no error classes when error is undefined', () => {
      render(<PrimitiveSelect aria-label="test" />);
      const select = screen.getByRole('combobox');
      expect(select).not.toHaveClass('border-destructive');
    });
  });

  describe('custom className merging', () => {
    it('merges custom className with default classes', () => {
      render(<PrimitiveSelect aria-label="test" className="mt-4" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('mt-4');
      expect(select).toHaveClass('border-border');
    });
  });

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is passed', () => {
      render(<PrimitiveSelect aria-label="test" disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('children', () => {
    it('renders option elements as children', () => {
      render(
        <PrimitiveSelect aria-label="test">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </PrimitiveSelect>,
      );
      expect(
        screen.getByRole('option', { name: 'Option A' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option B' }),
      ).toBeInTheDocument();
    });
  });

  describe('inline style', () => {
    it('has background-image style for dropdown arrow', () => {
      render(<PrimitiveSelect aria-label="test" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveStyle({
        backgroundImage: expect.stringContaining('data:image/svg+xml'),
      });
    });
  });

  describe('snapshots', () => {
    it('default select matches snapshot', () => {
      const { container } = render(
        <PrimitiveSelect aria-label="test">
          <option value="a">A</option>
        </PrimitiveSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('with error matches snapshot', () => {
      const { container } = render(
        <PrimitiveSelect aria-label="test" error="Required field">
          <option value="a">A</option>
        </PrimitiveSelect>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
