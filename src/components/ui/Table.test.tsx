import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './Table';

afterEach(() => {
  cleanup();
});

describe('Table', () => {
  describe('default rendering', () => {
    it('renders a table element', () => {
      render(<Table />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has data-slot="table"', () => {
      render(<Table />);
      expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
    });

    it('is wrapped in an overflow div', () => {
      const { container } = render(<Table />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper).toHaveClass('overflow-auto');
    });

    it('has default classes', () => {
      render(<Table />);
      const table = screen.getByRole('table');
      expect(table).toHaveClass('w-full');
      expect(table).toHaveClass('text-sm');
    });

    it('merges custom className', () => {
      render(<Table className="mt-4" />);
      const table = screen.getByRole('table');
      expect(table).toHaveClass('mt-4');
      expect(table).toHaveClass('w-full');
    });
  });
});

describe('TableHeader', () => {
  describe('default rendering', () => {
    it('renders a thead element', () => {
      render(
        <table>
          <TableHeader />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    });

    it('has data-slot="table-header"', () => {
      render(
        <table>
          <TableHeader />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toHaveAttribute(
        'data-slot',
        'table-header',
      );
    });

    it('has [&_tr]:border-b class', () => {
      render(
        <table>
          <TableHeader />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toHaveClass('[&_tr]:border-b');
    });

    it('merges custom className', () => {
      render(
        <table>
          <TableHeader className="bg-gray-100" />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toHaveClass('bg-gray-100');
    });
  });
});

describe('TableBody', () => {
  describe('default rendering', () => {
    it('renders a tbody element', () => {
      render(
        <table>
          <TableBody />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    });

    it('has data-slot="table-body"', () => {
      render(
        <table>
          <TableBody />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toHaveAttribute(
        'data-slot',
        'table-body',
      );
    });

    it('has [&_tr:last-child]:border-0 class', () => {
      render(
        <table>
          <TableBody />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toHaveClass(
        '[&_tr:last-child]:border-0',
      );
    });

    it('merges custom className', () => {
      render(
        <table>
          <TableBody className="custom-body" />
        </table>,
      );
      expect(screen.getByRole('rowgroup')).toHaveClass('custom-body');
    });
  });
});

describe('TableRow', () => {
  describe('default rendering', () => {
    it('renders a tr element', () => {
      render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>,
      );
      expect(screen.getByRole('row')).toBeInTheDocument();
    });

    it('has data-slot="table-row"', () => {
      render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>,
      );
      expect(screen.getByRole('row')).toHaveAttribute('data-slot', 'table-row');
    });

    it('has border-b and hover:bg-muted/50 classes', () => {
      render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>,
      );
      const row = screen.getByRole('row');
      expect(row).toHaveClass('border-b');
      expect(row).toHaveClass('hover:bg-muted/50');
    });

    it('merges custom className', () => {
      render(
        <table>
          <tbody>
            <TableRow className="highlight" />
          </tbody>
        </table>,
      );
      const row = screen.getByRole('row');
      expect(row).toHaveClass('highlight');
      expect(row).toHaveClass('border-b');
    });
  });
});

describe('TableHead', () => {
  describe('default rendering', () => {
    it('renders a th element', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>,
      );
      expect(
        screen.getByRole('columnheader', { name: 'Header' }),
      ).toBeInTheDocument();
    });

    it('has data-slot="table-head"', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>,
      );
      expect(screen.getByRole('columnheader')).toHaveAttribute(
        'data-slot',
        'table-head',
      );
    });

    it('has text-muted-foreground and font-medium classes', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>,
      );
      const th = screen.getByRole('columnheader');
      expect(th).toHaveClass('text-muted-foreground');
      expect(th).toHaveClass('font-medium');
    });

    it('merges custom className', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead className="w-[100px]">Header</TableHead>
            </tr>
          </thead>
        </table>,
      );
      const th = screen.getByRole('columnheader');
      expect(th).toHaveClass('w-[100px]');
      expect(th).toHaveClass('text-muted-foreground');
    });
  });
});

describe('TableCell', () => {
  describe('default rendering', () => {
    it('renders a td element', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      );
      expect(screen.getByRole('cell', { name: 'Cell' })).toBeInTheDocument();
    });

    it('has data-slot="table-cell"', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      );
      expect(screen.getByRole('cell')).toHaveAttribute(
        'data-slot',
        'table-cell',
      );
    });

    it('has p-4 and align-middle classes', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      );
      const td = screen.getByRole('cell');
      expect(td).toHaveClass('p-4');
      expect(td).toHaveClass('align-middle');
    });

    it('merges custom className', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell className="font-bold">Cell</TableCell>
            </tr>
          </tbody>
        </table>,
      );
      const td = screen.getByRole('cell');
      expect(td).toHaveClass('font-bold');
      expect(td).toHaveClass('p-4');
    });
  });
});

describe('composed table snapshot', () => {
  it('matches snapshot with all sub-components', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>PR #1</TableCell>
            <TableCell>85</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PR #2</TableCell>
            <TableCell>72</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
