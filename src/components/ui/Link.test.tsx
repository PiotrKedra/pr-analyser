import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Link } from './Link';

afterEach(() => {
  cleanup();
});

describe('Link', () => {
  it('renders an anchor element', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('has default styling classes', () => {
    render(<Link href="/about">About</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-foreground');
    expect(link).toHaveClass('hover:underline');
    expect(link).toHaveClass('hover:text-foreground/60');
    expect(link).toHaveClass('transition-colors');
  });

  it('merges custom className', () => {
    render(
      <Link href="/about" className="text-lg">
        About
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-lg');
    expect(link).toHaveClass('text-foreground');
  });

  it('passes href correctly', () => {
    render(<Link href="/contact">Contact</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/contact');
  });

  it('matches snapshot', () => {
    const { container } = render(<Link href="/about">About Link</Link>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
