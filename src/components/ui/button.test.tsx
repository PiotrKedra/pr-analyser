import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './Button';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  describe('default rendering', () => {
    it('renders a button element with children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('has default variant classes', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('text-primary-foreground');
    });

    it('has default size classes', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('px-6');
    });
  });

  describe('variants', () => {
    it('outline — has border-border and bg-background', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-border');
      expect(button).toHaveClass('bg-background');
    });

    it('secondary — has bg-secondary and text-secondary-foreground', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
      expect(button).toHaveClass('text-secondary-foreground');
    });

    it('ghost — has hover:bg-muted', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-muted');
    });

    it('destructive — has bg-destructive/10 and text-destructive', () => {
      render(<Button variant="destructive">Destructive</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive/10');
      expect(button).toHaveClass('text-destructive');
    });

    it('link — has text-primary and hover:underline', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary');
      expect(button).toHaveClass('hover:underline');
    });
  });

  describe('sizes', () => {
    it('xs — has h-6', () => {
      render(<Button size="xs">Extra Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-6');
    });

    it('sm — has h-auto', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-auto');
    });

    it('lg — has h-15', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-15');
    });

    it('icon — has size-8', () => {
      render(<Button size="icon">Icon</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-8');
    });
  });

  describe('custom className merging', () => {
    it('merges custom className with default classes', () => {
      render(<Button className="mt-4">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mt-4');
      expect(button).toHaveClass('bg-primary');
    });
  });

  describe('disabled state', () => {
    it('renders as disabled when disabled prop is passed', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('data attributes', () => {
    it('sets data-slot, data-variant, and data-size on default render', () => {
      render(<Button>Data</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-slot', 'button');
      expect(button).toHaveAttribute('data-variant', 'default');
      expect(button).toHaveAttribute('data-size', 'default');
    });
  });

  describe('snapshots', () => {
    it('default variant matches snapshot', () => {
      const { container } = render(<Button>Default</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('outline variant matches snapshot', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('secondary variant matches snapshot', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('ghost variant matches snapshot', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('destructive variant matches snapshot', () => {
      const { container } = render(<Button variant="destructive">Destructive</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('link variant matches snapshot', () => {
      const { container } = render(<Button variant="link">Link</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
