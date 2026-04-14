import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Separator } from './Separator';

afterEach(() => {
  cleanup();
});

describe('Separator', () => {
  describe('default rendering', () => {
    it('renders with data-slot="separator"', () => {
      const { container } = render(<Separator />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveAttribute('data-slot', 'separator');
    });

    it('defaults to horizontal orientation', () => {
      const { container } = render(<Separator />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('has horizontal size classes by default', () => {
      const { container } = render(<Separator />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass('h-[1px]');
      expect(el).toHaveClass('w-full');
    });
  });

  describe('orientation', () => {
    it('vertical — has vertical size classes', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveAttribute('data-orientation', 'vertical');
      expect(el).toHaveClass('h-full');
      expect(el).toHaveClass('w-[1px]');
    });
  });

  describe('custom className merging', () => {
    it('merges custom className with default classes', () => {
      const { container } = render(<Separator className="my-4" />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass('my-4');
      expect(el).toHaveClass('bg-border');
    });
  });

  describe('decorative', () => {
    it('is decorative by default (role=none)', () => {
      const { container } = render(<Separator />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveAttribute('role', 'none');
    });

    it('has separator role when not decorative', () => {
      const { container } = render(<Separator decorative={false} />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveAttribute('role', 'separator');
    });
  });

  describe('snapshots', () => {
    it('horizontal matches snapshot', () => {
      const { container } = render(<Separator />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('vertical matches snapshot', () => {
      const { container } = render(<Separator orientation="vertical" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
