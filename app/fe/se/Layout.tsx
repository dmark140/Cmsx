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
import { PrintPreview } from '@/lib/PrintPreview';
import { Separator } from '@/components/ui/separator';
import FeEntry from './FeEntry';
import { useGlobalContext } from '@/context/GlobalContext';
import ViewFeEntry from './ViewFeEntry';
import Recieve from './Recieve';
type data = {
  DocEntry: number,
  projects_data_a_headerEntry: number,
  UID: number,
  CreatedBy: number,
  firstname: string,
  MiddleName: string,
  LastName: string,
  createdDate: string
  requestedDate: string
  Title: string,
  FunEntry_ID: number,
  confirm_recieveBy: number,
}

export default function Layout() {
  const { ID } = useGlobalContext()
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


  const handleAddEntry = async (entry: {
    project_id: number
    evaluation_id: number
    evaluation: string
    requested: string
    acquired: string
  }) => {
    console.log("Received entry from modal:", entry)
    await runQuery("insertFE", [ID, entry.project_id, entry.requested, entry.acquired])
    getEvls()
  }


  useLayoutEffect(() => {
    getEvls()
  }, [])

  // useEffect(() => {

  // }, [third])


  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='font-semibold text-xl'>
          Select Evaluated Request
        </div>
        <div className='flex gap-2 items-center'>
          <span>Evaluated Date</span>
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
          <Button onClick={getEvls}>Search</Button>
        </div>
      </div>
      <Separator className='my-2' />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evaluation #</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Evaluated Date</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Option</TableHead>
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
                <TableCell> {evl.FunEntry_ID != null ? "Allocated" : "Un-Allocated"}</TableCell>
                <TableCell className='flex gap-2'>
                  {evl.FunEntry_ID == null ?
                    <FeEntry
                      project_id={evl.projects_data_a_headerEntry}
                      evaluation_id={evl.UID}
                      onAdd={handleAddEntry}
                    /> :
                    <>
                      <ViewFeEntry
                        evaluation_id={evl.FunEntry_ID} />

                      {evl.confirm_recieveBy < 1 &&
                        <Recieve evaluation_id={evl.FunEntry_ID} />}
                    </>
                  }

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
