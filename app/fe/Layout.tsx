'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { onlyDate, runQuery } from '@/lib/utils'
import React, { useLayoutEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import FeEntry from './se/FeEntry'
import { useRouter } from 'next/navigation'

type data = {
  DocEntry: number,
  projects_data_a_headerEntry: number,
  UID: number,
  CreatedBy: number,
  firstname: string,
  MiddleName: string,
  LastName: string,
  createdDate: string,
  requestedDate: string,
  Title: string
}

export default function Layout() {
  const [Evaluations, setEvaluations] = useState<data[]>([])
  const today = new Date().toISOString().split("T")[0]
  const [fromDate, setFromDate] = useState<string>(today)
  const [toDate, setToDate] = useState<string>(today)
  const router = useRouter()
  const getEvls = async () => {

  }

  useLayoutEffect(() => {
    router.prefetch("/fe/se")
    getEvls()
  }, [])

  const handleAddEntry = (entry: {
    project_id: number
    evaluation_id: number
    evaluation: string
    requested: string
    acquired: string
  }) => {
    console.log("Received entry from modal:", entry)
  }



  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-semibold text-xl'>
          Fund Entry List
        </div>
        <div className='flex gap-2 items-center'>
          <span>Entry Date</span>
          <Input
            type="date"
            className='w-fit'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />-
          <Input
            type="date"
            className='w-fit'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button onClick={getEvls} variant={"secondary"}>Search</Button>|
          <Button onClick={() => {
            router.push("/fe/se")
          }}>Add New Entry</Button>
        </div>
      </div>
      <Separator className='my-2' />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> #</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Evaluated Date</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Acquired Fund</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Evaluations.length > 0 ? (
            Evaluations.map((evl, idx) => (
              <TableRow key={idx}>
                <TableCell>{evl.UID}</TableCell>
                <TableCell>{evl.firstname} {evl.MiddleName} {evl.LastName}</TableCell>
                <TableCell>{onlyDate(evl.requestedDate)}</TableCell>
                <TableCell>{onlyDate(evl.createdDate)}</TableCell>
                <TableCell>{evl.Title}</TableCell>
                <TableCell>


                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
