import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { InputError } from './InputError';

afterEach(() => {
  cleanup();
});

describe('InputError', () => {
  describe('renders nothing when error is falsy', () => {
    it('returns null when error is undefined', () => {
      const { container } = render(<InputError />);
      expect(container).toBeEmptyDOMElement();
    });

    it('returns null when error is null', () => {
      const { container } = render(<InputError error={null} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('returns null when error is empty string', () => {
      const { container } = render(<InputError error="" />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('renders error text', () => {
    it('displays the error message', () => {
      render(<InputError error="Something went wrong" />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('has correct classes', () => {
      render(<InputError error="Error" />);
      const span = screen.getByText('Error');
      expect(span).toHaveClass('text-destructive');
      expect(span).toHaveClass('text-xs');
      expect(span).toHaveClass('leading-[14px]');
    });
  });

  describe('snapshots', () => {
    it('with error string matches snapshot', () => {
      const { container } = render(<InputError error="Invalid input" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
