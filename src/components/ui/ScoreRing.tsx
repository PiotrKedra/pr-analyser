'use client';

import { useState, useEffect } from 'react';

type ScoreRingProps = {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function getStrokeColor(score: number): string {
  if (score >= 80) return 'var(--success)';
  if (score >= 50) return 'var(--foreground)';
  return 'var(--destructive)';
}

function getLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  className,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimated(true));
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = circumference - (score / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getStrokeColor(score)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{
          strokeDashoffset: animated ? target : circumference,
          transition: 'stroke-dashoffset 1s ease-out',
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={size * 0.25}
        fontWeight="bold"
      >
        {score}
      </text>
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--muted-foreground)"
        fontSize={size * 0.1}
      >
        {getLabel(score)}
      </text>
    </svg>
  );
}

export { ScoreRing };
