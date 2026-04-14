import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  PageTitle,
  SectionTitle,
  SubsectionTitle,
  SmallTitle,
  Paragraph,
} from './Text';

afterEach(() => {
  cleanup();
});

describe('PageTitle', () => {
  it('renders an h1 element', () => {
    render(<PageTitle>Hello</PageTitle>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<PageTitle className="text-red-500">Custom</PageTitle>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'text-red-500',
    );
  });

  it('matches snapshot', () => {
    const { container } = render(<PageTitle>Page Title</PageTitle>);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('SectionTitle', () => {
  it('renders an h2 element', () => {
    render(<SectionTitle>Hello</SectionTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<SectionTitle className="mt-4">Custom</SectionTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('mt-4');
  });

  it('matches snapshot', () => {
    const { container } = render(<SectionTitle>Section Title</SectionTitle>);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('SubsectionTitle', () => {
  it('renders an h3 element', () => {
    render(<SubsectionTitle>Hello</SubsectionTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<SubsectionTitle className="mb-2">Custom</SubsectionTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('mb-2');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <SubsectionTitle>Subsection Title</SubsectionTitle>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('SmallTitle', () => {
  it('renders an h4 element', () => {
    render(<SmallTitle>Hello</SmallTitle>);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<SmallTitle className="italic">Custom</SmallTitle>);
    expect(screen.getByRole('heading', { level: 4 })).toHaveClass('italic');
  });

  it('matches snapshot', () => {
    const { container } = render(<SmallTitle>Small Title</SmallTitle>);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('Paragraph', () => {
  it('renders a p element', () => {
    render(<Paragraph>Some text</Paragraph>);
    expect(screen.getByText('Some text').tagName).toBe('P');
  });

  it('merges custom className', () => {
    render(<Paragraph className="text-lg">Custom text</Paragraph>);
    expect(screen.getByText('Custom text')).toHaveClass('text-lg');
  });

  it('matches snapshot', () => {
    const { container } = render(<Paragraph>Paragraph text</Paragraph>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
