import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Select } from './Select';

afterEach(() => {
  cleanup();
});

describe('Select', () => {
  describe('default rendering', () => {
    it('renders a select element', () => {
      render(<Select aria-label="test" />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has data-slot="select"', () => {
      render(<Select aria-label="test" />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-slot',
        'select',
      );
    });
  });

  describe('default styling', () => {
    it('has border-border class', () => {
      render(<Select aria-label="test" />);
      expect(screen.getByRole('combobox')).toHaveClass('border-border');
    });

    it('has h-10 class', () => {
      render(<Select aria-label="test" />);
      expect(screen.getByRole('combobox')).toHaveClass('h-10');
    });

    it('has rounded-lg class', () => {
      render(<Select aria-label="test" />);
      expect(screen.getByRole('combobox')).toHaveClass('rounded-lg');
    });
  });

  describe('custom className merging', () => {
    it('merges custom className with default classes', () => {
      render(<Select aria-label="test" className="mt-4" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('mt-4');
      expect(select).toHaveClass('border-border');
    });
  });

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is passed', () => {
      render(<Select aria-label="test" disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('children', () => {
    it('renders option elements as children', () => {
      render(
        <Select aria-label="test">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>,
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
      render(<Select aria-label="test" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveStyle({
        backgroundImage: expect.stringContaining('data:image/svg+xml'),
      });
    });
  });

  describe('snapshots', () => {
    it('default select matches snapshot', () => {
      const { container } = render(
        <Select aria-label="test">
          <option value="a">A</option>
        </Select>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
