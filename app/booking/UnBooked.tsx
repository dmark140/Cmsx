'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { runQuery } from '@/lib/utils'
import { formatDate } from 'date-fns'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import UnBookedPopOver from './UnBookedPopOver'
import RandomLoading from './Loading'


type ProjectApproval = {
    DocEntry: number;
    FirstName: string | null;
    MiddleName: string | null;
    LastName: string | null;
    Title: string | null;
    Disc: string | null;
    FinalApprovalStatus: string | null;
    projectID: number | null;
    createdDate: string;
    CreatedBy: number;
};



export default function UnBooked() {

    const [data, setdata] = useState<ProjectApproval[]>([])
    const getData = async () => {
        const getUnBooked = await runQuery("getUnBooked")
        setdata(getUnBooked.data)
    }
    useLayoutEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Document #</TableHead>
                        <TableHead>Requested Date</TableHead>
                        <TableHead>Approval Status</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Requested Form</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((e, index) => (
                        <TableRow key={index} >
                            <TableCell>{e.DocEntry}</TableCell>
                            <TableCell>{e.createdDate}</TableCell>
                            <TableCell>{e.FinalApprovalStatus}</TableCell>
                            <TableCell>{e.FirstName} {e.MiddleName} {e.LastName} </TableCell>
                            <TableCell>{e.Title}</TableCell>
                            <TableCell>
                                {/* <Button>Book An Appointment</Button> */}
                                {/* <Popover>
                                    <PopoverTrigger>Open</PopoverTrigger>
                                    <PopoverContent>Place content for the popover here.</PopoverContent>
                                </Popover> */}

                                <UnBookedPopOver DocEntry={e.DocEntry} CreatedBy={e.CreatedBy} Title={e.Title || ""} BookingId={0} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* <Button onClick={getData}> log getData</Button> */}

            {/* <RandomLoading /> */}
        </div >
    )
}
