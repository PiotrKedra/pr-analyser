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
import type {
  SortingState,
  ColumnFiltersState,
  FilterFn,
} from '@tanstack/react-table';
import type { PRScore } from '@/lib/schemas';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { PrimitiveInput } from '@/components/form/PrimitiveInput';
import { PrimitiveSelect } from '@/components/form/PrimitiveSelect';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/Popover';

type ScoreTier = 'high' | 'mid' | 'low' | '';

const scoreTierFilter: FilterFn<PRScore> = (
  row,
  columnId,
  filterValue: ScoreTier,
) => {
  if (!filterValue) return true;
  const value = row.getValue<number>(columnId);
  switch (filterValue) {
    case 'high':
      return value >= 80;
    case 'mid':
      return value >= 50 && value < 80;
    case 'low':
      return value < 50;
    default:
      return true;
  }
};

type SizeTier = 'small' | 'medium' | 'large' | '';

const sizeTierFilter: FilterFn<PRScore> = (
  row,
  columnId,
  filterValue: SizeTier,
) => {
  if (!filterValue) return true;
  const value = row.getValue<number>(columnId);
  switch (filterValue) {
    case 'small':
      return value <= 3;
    case 'medium':
      return value >= 4 && value <= 10;
    case 'large':
      return value > 10;
    default:
      return true;
  }
};

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
    enableColumnFilter: false,
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
  columnHelper.accessor('changedFiles', {
    header: () => <span className="block text-right">Size</span>,
    size: 120,
    filterFn: sizeTierFilter,
    cell: (info) => (
      <span className="block text-right">
        <span>{info.getValue()} files</span>
        <span className="text-muted-foreground block text-xs">
          +{info.row.original.additions} / -{info.row.original.deletions}
        </span>
      </span>
    ),
  }),
  columnHelper.accessor('impact', {
    header: () => <span className="block text-right">Impact</span>,
    size: 90,
    filterFn: scoreTierFilter,
    cell: (info) => (
      <span className={`block text-right ${scoreColorClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('aiLeverage', {
    header: () => <span className="block text-right">AI Leverage</span>,
    size: 110,
    filterFn: scoreTierFilter,
    cell: (info) => (
      <span className={`block text-right ${scoreColorClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('quality', {
    header: () => <span className="block text-right">Quality</span>,
    size: 90,
    filterFn: scoreTierFilter,
    cell: (info) => (
      <span className={`block text-right ${scoreColorClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('totalScore', {
    header: () => <span className="block text-right">Score</span>,
    size: 80,
    filterFn: scoreTierFilter,
    cell: (info) => (
      <span className="block text-right font-bold">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('diffUrl', {
    header: () => <span className="block text-center">Diff</span>,
    size: 70,
    enableSorting: false,
    enableColumnFilter: false,
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

  const scoreFilterColumns = [
    { column: table.getColumn('impact'), label: 'Impact' },
    { column: table.getColumn('aiLeverage'), label: 'AI Leverage' },
    { column: table.getColumn('quality'), label: 'Quality' },
    { column: table.getColumn('totalScore'), label: 'Score' },
  ];

  const sizeColumn = table.getColumn('changedFiles');
  const titleColumn = table.getColumn('title');
  const authorColumn = table.getColumn('author');

  const advancedFilterIds = new Set([
    'changedFiles',
    'impact',
    'aiLeverage',
    'quality',
    'totalScore',
  ]);
  const advancedFilterCount = columnFilters.filter((f) =>
    advancedFilterIds.has(f.id),
  ).length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2 pt-2 pr-2">
        <PrimitiveInput
          type="text"
          placeholder="Search PRs..."
          value={(titleColumn?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            titleColumn?.setFilterValue(e.target.value || undefined)
          }
          className="h-8 w-44 text-xs"
        />
        <PrimitiveSelect
          value={(authorColumn?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            authorColumn?.setFilterValue(e.target.value || undefined)
          }
          className="h-8 w-auto text-xs"
        >
          <option value="">All authors</option>
          {uniqueAuthors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </PrimitiveSelect>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="xs"
              className="h-8 rounded-lg bg-white px-3 text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters{advancedFilterCount > 0 && ` (${advancedFilterCount})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">
                  Size
                </label>
                <PrimitiveSelect
                  value={(sizeColumn?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    sizeColumn?.setFilterValue(e.target.value || undefined)
                  }
                  className="h-8 w-full text-xs"
                >
                  <option value="">All sizes</option>
                  <option value="small">Small (1-3)</option>
                  <option value="medium">Medium (4-10)</option>
                  <option value="large">Large (11+)</option>
                </PrimitiveSelect>
              </div>
              {scoreFilterColumns.map(({ column, label }) => (
                <div key={label}>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">
                    {label}
                  </label>
                  <PrimitiveSelect
                    value={(column?.getFilterValue() as string) ?? ''}
                    onChange={(e) =>
                      column?.setFilterValue(e.target.value || undefined)
                    }
                    className="h-8 w-full text-xs"
                  >
                    <option value="">All {label}</option>
                    <option value="high">High (80+)</option>
                    <option value="mid">Mid (50-79)</option>
                    <option value="low">Low (0-49)</option>
                  </PrimitiveSelect>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {columnFilters.length > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setColumnFilters([])}
          >
            Clear
          </Button>
        )}
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
                className="text-muted-foreground h-24 text-center"
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
