'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import DynamicTable from '@/lib/DynamicTable'
import { runQuery } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
export default function Layout() {
  const [data, setData] = useState<any[]>([])
  const [dataRows, setDataRows] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const { push } = useGlobalPush()
  const [open, setOpen] = useState(false)
  const [selectedRowData, setselectedRowData] = useState<Record<string, any>>([])

  const handleOpen = async (data: Record<string, any>) => {
    console.log(data)
    if (data?.DocEntry <= 0) return
    setselectedRowData(data)
    const res = await runQuery('getselectionlistPerRow', [data?.DocEntry])
    console.log({ res })
    setDataRows(res?.data || [])
    setOpen(true)
  }
  const columns = [
    { name: 'Code', code: 'Code' },
    { name: 'Name', code: 'Name' },
    { name: 'Created Date', code: 'CreatedDate' },
    { name: 'Void', code: 'Void' },
  ]

  const fetchData = async (newPage = 1) => {
    const res = await runQuery('getselectionlist', [], {
      limit: 9,
      page: newPage,
      paginate: true,
    })
    setData(res?.data || [])
    setMaxPage(res?.pagination?.totalPages || 1)
    setPage(newPage)
  }

  useEffect(() => void fetchData(), [])

  return (
    <div className="p-4 space-y-4">
      <DynamicTable
        columns={columns}
        data={data}
        currentPage={page}
        maxPage={maxPage}
        setPage={setPage}
        onPageChange={fetchData}
        onRowClick={(row) => handleOpen(row)} // 👈 Optional
      />
      <div className="flex gap-2">
        <Button onClick={() => push('listmng/create')}>Create</Button>
        <Button onClick={() => fetchData(page)}>Refresh</Button>
      </div>



      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedRowData?.Code}</SheetTitle>
            <SheetDescription>


              {selectedRowData?.Name}
            </SheetDescription>
          </SheetHeader>
          <div className='p-4 overflow-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-full'>Status</TableHead>
                  <TableHead className='w-10'>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataRows.map((invoice, i) => (
                  <TableRow key={i}>
                    <TableCell>{invoice.name}</TableCell>
                    <TableCell>{invoice.void === 1 ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button>De-Activate List</Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}
