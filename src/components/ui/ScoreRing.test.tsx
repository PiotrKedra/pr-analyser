import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ScoreRing } from './ScoreRing';

afterEach(() => {
  cleanup();
});

describe('ScoreRing', () => {
  describe('default rendering', () => {
    it('renders an SVG element with default size 160', () => {
      const { container } = render(<ScoreRing score={75} />);
      const svg = container.querySelector('svg') as SVGElement;
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '160');
      expect(svg).toHaveAttribute('height', '160');
    });

    it('displays the score text', () => {
      render(<ScoreRing score={75} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  describe('label thresholds', () => {
    it('shows "Excellent" for score >= 80', () => {
      render(<ScoreRing score={80} />);
      expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('shows "Good" for score >= 60 and < 80', () => {
      render(<ScoreRing score={65} />);
      expect(screen.getByText('Good')).toBeInTheDocument();
    });

    it('shows "Fair" for score >= 40 and < 60', () => {
      render(<ScoreRing score={45} />);
      expect(screen.getByText('Fair')).toBeInTheDocument();
    });

    it('shows "Poor" for score < 40', () => {
      render(<ScoreRing score={30} />);
      expect(screen.getByText('Poor')).toBeInTheDocument();
    });
  });

  describe('stroke color thresholds', () => {
    it('uses var(--success) for score >= 80', () => {
      const { container } = render(<ScoreRing score={90} />);
      const circles = container.querySelectorAll('circle');
      const foregroundCircle = circles[1];
      expect(foregroundCircle).toHaveAttribute('stroke', 'var(--success)');
    });

    it('uses var(--foreground) for score >= 50 and < 80', () => {
      const { container } = render(<ScoreRing score={65} />);
      const circles = container.querySelectorAll('circle');
      const foregroundCircle = circles[1];
      expect(foregroundCircle).toHaveAttribute('stroke', 'var(--foreground)');
    });

    it('uses var(--destructive) for score < 50', () => {
      const { container } = render(<ScoreRing score={30} />);
      const circles = container.querySelectorAll('circle');
      const foregroundCircle = circles[1];
      expect(foregroundCircle).toHaveAttribute('stroke', 'var(--destructive)');
    });
  });

  describe('custom size', () => {
    it('applies custom size to SVG dimensions', () => {
      const { container } = render(<ScoreRing score={50} size={200} />);
      const svg = container.querySelector('svg') as SVGElement;
      expect(svg).toHaveAttribute('width', '200');
      expect(svg).toHaveAttribute('height', '200');
    });
  });

  describe('custom className', () => {
    it('applies className to SVG element', () => {
      const { container } = render(<ScoreRing score={50} className="mt-4" />);
      const svg = container.querySelector('svg') as SVGElement;
      expect(svg).toHaveClass('mt-4');
    });
  });

  describe('background circle', () => {
    it('uses var(--muted) stroke for background circle', () => {
      const { container } = render(<ScoreRing score={50} />);
      const circles = container.querySelectorAll('circle');
      const backgroundCircle = circles[0];
      expect(backgroundCircle).toHaveAttribute('stroke', 'var(--muted)');
    });
  });

  describe('snapshots', () => {
    it('high score (90) matches snapshot', () => {
      const { container } = render(<ScoreRing score={90} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('medium score (65) matches snapshot', () => {
      const { container } = render(<ScoreRing score={65} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('low score (30) matches snapshot', () => {
      const { container } = render(<ScoreRing score={30} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
