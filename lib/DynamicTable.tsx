'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from './pagination'

interface Column {
  name: string
  code: string
}

interface DynamicTableProps {
  columns: Column[]
  data: Record<string, any>[]
  currentPage: number
  maxPage: number
  setPage: (page: number) => void
  onPageChange?: (page: number) => void
  onRowClick?: (row: Record<string, any>) => void // 👈 Optional click handler
}

export default function DynamicTable({
  columns,
  data,
  currentPage,
  maxPage,
  setPage,
  onPageChange,
  onRowClick,
}: DynamicTableProps) {
  return (
    <div className="w-full space-y-4 overflow-x-auto rounded-lg border p-2">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.code}>{col.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <TableCell key={col.code}>{row[col.code]}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {maxPage > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            setPage={setPage}
            maxPage={maxPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
