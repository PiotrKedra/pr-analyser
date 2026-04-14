'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import type { PRScore } from '@/lib/schemas';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';

const columnHelper = createColumnHelper<PRScore>();

function scoreColorClass(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-foreground';
  return 'text-destructive';
}

const columns = [
  columnHelper.accessor('id', {
    header: '#',
    size: 60,
    cell: (info) => (
      <span className="text-muted-foreground">#{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    size: 240,
    cell: (info) => (
      <span className="block max-w-[200px] truncate" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('author', {
    header: 'Author',
    size: 120,
  }),
  columnHelper.accessor('impact', {
    header: () => <span className="block text-right">Impact</span>,
    size: 90,
    cell: (info) => (
      <span className={`block text-right ${scoreColorClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('aiLeverage', {
    header: () => <span className="block text-right">AI Leverage</span>,
    size: 110,
    cell: (info) => (
      <span className={`block text-right ${scoreColorClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('quality', {
    header: () => <span className="block text-right">Quality</span>,
    size: 90,
    cell: (info) => (
      <span className={`block text-right ${scoreColorClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('totalScore', {
    header: () => <span className="block text-right">Score</span>,
    size: 80,
    cell: (info) => (
      <span className="block text-right font-bold">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('diffUrl', {
    header: () => <span className="block text-center">Diff</span>,
    size: 70,
    enableSorting: false,
    cell: (info) => (
      <span className="block text-center">
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View
        </a>
      </span>
    ),
  }),
];

function PrTable({ prs }: { prs: PRScore[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const uniqueAuthors = useMemo(
    () => [...new Set(prs.map((pr) => pr.author))].sort(),
    [prs],
  );

  const table = useReactTable({
    data: prs,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const titleColumn = table.getColumn('title');
  const authorColumn = table.getColumn('author');

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <input
          type="text"
          placeholder="Search PRs..."
          value={(titleColumn?.getFilterValue() as string) ?? ''}
          onChange={(e) => titleColumn?.setFilterValue(e.target.value || undefined)}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground h-8 w-44 rounded-md border px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={(authorColumn?.getFilterValue() as string) ?? ''}
          onChange={(e) => authorColumn?.setFilterValue(e.target.value || undefined)}
          className="border-border bg-background text-foreground h-8 rounded-md border px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All authors</option>
          {uniqueAuthors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>
      <Table className="table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={
                    header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : undefined
                  }
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="inline-flex items-center gap-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getIsSorted() === 'asc' && (
                      <span aria-hidden="true">▲</span>
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <span aria-hidden="true">▼</span>
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No PRs match your filters
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { PrTable };
