import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

afterEach(() => {
  cleanup();
});

function renderPopover(
  contentProps?: React.ComponentProps<typeof PopoverContent>,
) {
  return render(
    <Popover>
      <PopoverTrigger asChild>
        <button>Open</button>
      </PopoverTrigger>
      <PopoverContent {...contentProps}>
        <p>Popover body</p>
      </PopoverContent>
    </Popover>,
  );
}

describe('Popover', () => {
  describe('default rendering', () => {
    it('renders the trigger button', () => {
      renderPopover();
      expect(
        screen.getByRole('button', { name: 'Open' }),
      ).toBeInTheDocument();
    });

    it('does not show content by default', () => {
      renderPopover();
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('shows content when trigger is clicked', () => {
      renderPopover();

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByText('Popover body')).toBeInTheDocument();
    });

    it('hides content when trigger is clicked again', () => {
      renderPopover();

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByText('Popover body')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  describe('PopoverContent styling', () => {
    it('has default styling classes when open', () => {
      renderPopover();

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      const content = screen.getByText('Popover body').parentElement!;
      expect(content).toHaveClass('border-border');
      expect(content).toHaveClass('rounded-lg');
      expect(content).toHaveClass('bg-white');
      expect(content).toHaveClass('shadow-md');
    });

    it('merges custom className', () => {
      renderPopover({ className: 'w-80' });

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      const content = screen.getByText('Popover body').parentElement!;
      expect(content).toHaveClass('w-80');
      expect(content).toHaveClass('bg-white');
    });
  });

  describe('snapshots', () => {
    it('open popover content matches snapshot', () => {
      renderPopover();

      fireEvent.click(screen.getByRole('button', { name: 'Open' }));

      const content = screen.getByText('Popover body').parentElement!;
      expect(content).toMatchSnapshot();
    });
  });
});
