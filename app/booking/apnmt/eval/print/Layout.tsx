'use client'

import Exporter from '@/app/tools/Exporter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { onlyDate, runQuery } from '@/lib/utils';
import React, { useLayoutEffect, useState } from 'react'
import Printables from './Printables';
import { PrintPreview } from '@/lib/PrintPreview';
import ShowPrint from './ShowPrint';

type data = {
  DocEntry: number,
  UID: number,
  CreatedBy: number,
  firstname: string,
  MiddleName: string,
  LastName: string,
  createdDate: string
  requestedDate: string
  Title: string
}

export default function Layout() {
  const [Evaluations, setEvaluations] = useState<data[]>([]);
  const [show, setShow] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState<string>(today);
  const [toDate, setToDate] = useState<string>(today);

  const getEvls = async () => {
    const data = await runQuery("getEvls", [fromDate, toDate])
    if (data) {
      setEvaluations(data.data)
    }
  }

  useLayoutEffect(() => {
    getEvls()
  }, [])

  return (
    <div>
      <div className='mb-4 float-right'>
        <div className='flex gap-2 items-center'>
          <span>Evaluated Date</span>
          <Input
            type="date"
            className='w-fit'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            type="date"
            className='w-fit'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button onClick={getEvls}>Search</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evaluation #</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Evaluated Date</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Option</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Evaluations.length > 0 ? (
            Evaluations.map((evl, idx) => (
              <TableRow key={idx}>
                <TableCell>{evl.DocEntry}</TableCell>
                <TableCell>{evl.firstname} {evl.MiddleName} {evl.LastName}</TableCell>
                <TableCell>{onlyDate(evl.requestedDate)}</TableCell>
                <TableCell>{onlyDate(evl.createdDate)}</TableCell>
                <TableCell>{evl.Title}</TableCell>
                <TableCell>
                  {/* <Exporter fileName="invoice-123" > */}
                  {/* <Printables userId={evl.UID} evaluationId={evl.DocEntry} /> */}
                  {/* </Exporter> */}
                  <ShowPrint DocEntry={evl.DocEntry} UID={evl.UID} setShow={setShow} show={show} />
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
