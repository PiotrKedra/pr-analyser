import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SectionSpace } from './SectionSpace';

afterEach(() => {
  cleanup();
});

describe('SectionSpace', () => {
  it('renders a div element', () => {
    const { container } = render(<SectionSpace />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it('has responsive height classes', () => {
    const { container } = render(<SectionSpace />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('h-16');
    expect(div).toHaveClass('sm:h-[6.5rem]');
  });

  describe('snapshots', () => {
    it('matches snapshot', () => {
      const { container } = render(<SectionSpace />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
