import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Home from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

afterEach(cleanup);

test('renders PR Analyser heading', () => {
  render(<Home />);
  expect(screen.getByText('Piotr PR Analyser')).toBeDefined();
});

test('renders input and submit button', () => {
  render(<Home />);
  expect(
    screen.getByPlaceholderText('https://github.com/owner/repo'),
  ).toBeDefined();
  expect(screen.getByRole('button', { name: 'Analyse' })).toBeDefined();
});
