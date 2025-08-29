'use client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGlobalContext } from '@/context/GlobalContext'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import { getDatePart, runQuery } from '@/lib/utils'
import React, { useLayoutEffect, useState } from 'react'
import { toast } from 'sonner'

interface Schedule {
  id: number
  date: string // yyyy-MM-dd
  title: string
  bookingDate: string;

}
export default function Layout() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const { push } = useGlobalPush()
  const { setEvaluationId } = useGlobalContext()
  const getBookingPerDay = async () => {
    const Data = await runQuery("getprojects_data_a_headerWhereNotInBookings", [])
    if (Data) {
      setSchedules(Data.data)
    } else {
      toast.error("Failed to fetch bookings for the day")
    }
  }

  useLayoutEffect(() => {
    getBookingPerDay()
  }, []) 
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="">Applicant</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className='bg-amber-600 text-center w-[60px]  rounded-md text-bold '>
                  <div>{getDatePart(item.bookingDate, "dayOfWeek")}</div>
                  <div>{getDatePart(item.bookingDate, "day")}/{getDatePart(item.bookingDate, "month")} </div>
                </div></TableCell>
              <TableCell>Acme Corp</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell >$2,500.00</TableCell>
              <TableCell className="text-right"><Button variant="link" onClick={() => {
                setEvaluationId(item.id)
                push("apnmt/eval")
              }
              }>Evaluate</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  )
}
