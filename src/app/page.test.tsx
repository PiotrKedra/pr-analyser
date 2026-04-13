import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

test('Home page renders successfully', () => {
  render(<Home />);
  expect(screen.getByAltText('Next.js logo')).toBeDefined();
});
