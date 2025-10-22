'use client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGlobalContext } from '@/context/GlobalContext'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import { runQuery } from '@/lib/utils'
import { format, subDays } from 'date-fns'
import React, { useEffect, useState, useCallback } from 'react'

type ProjectApproval = {
    DocEntry: number;
    FirstName: string | null;
    MiddleName: string | null;
    LastName: string | null;
    Title: string | null;
    Disc: string | null;
    bookingDate: string | null;
    CreatedBy: number;
    BookingId: number;
};

const QUERY_DATE_FORMAT = 'yyyy-MM-dd';

export default function Booked() {
    const { setEvaluationId } = useGlobalContext()
    const { push } = useGlobalPush()
    const [data, setdata] = useState<ProjectApproval[]>([])
    const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 7), QUERY_DATE_FORMAT));
    const [dateTo, setDateTo] = useState(format(new Date(), QUERY_DATE_FORMAT));
    const [isLoading, setIsLoading] = useState(false);

    const getData = useCallback(async () => {
        setIsLoading(true);
        try {
            const getBookedResult = await runQuery("getBooked", [dateFrom, dateTo]);
            setdata(getBookedResult.data || []);
        } catch (error) {
            console.error("Error fetching booked data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dateFrom, dateTo]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleDateFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(event.target.value);
    };

    const handleDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(event.target.value);
    };

    const today = format(new Date(), QUERY_DATE_FORMAT);

    return (
        <div>
            <div className="flex space-x-4 p-4 items-center">
                <label htmlFor="dateFrom" className="font-medium text-sm">Date From:</label>
                <input
                    type="date"
                    id="dateFrom"
                    value={dateFrom}
                    onChange={handleDateFromChange}
                    className="border p-2 rounded-md"
                />

                <label htmlFor="dateTo" className="font-medium text-sm">Date To:</label>
                <input
                    type="date"
                    id="dateTo"
                    value={dateTo}
                    onChange={handleDateToChange}
                    className="border p-2 rounded-md"
                />

                <Button onClick={getData} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Refresh Data'}
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Document #</TableHead>
                        <TableHead>Booking Date</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Requested Form</TableHead>
                        <TableHead>Booked Date</TableHead>
                        <TableHead>Evaluate</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">Loading data...</TableCell>
                        </TableRow>
                    )}
                    {!isLoading && data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">No booked approvals found for the selected date range.</TableCell>
                        </TableRow>
                    )}
                    {!isLoading && data.map((e, index) => {
                        const bookingDateFormatted = e.bookingDate
                            ? format(new Date(e.bookingDate), QUERY_DATE_FORMAT)
                            : null;
                        const isToday = bookingDateFormatted === today;

                        return (
                            <TableRow key={index} className={isToday ? '' : ''}>
                                <TableCell>{e.DocEntry}</TableCell>
                                <TableCell>
                                    {e.bookingDate
                                        ? format(new Date(e.bookingDate), 'MMM dd, yyyy')
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>{e.FirstName} {e.MiddleName} {e.LastName}</TableCell>
                                <TableCell>{e.Title}</TableCell>
                                <TableCell>
                                    {e.bookingDate
                                        ? format(new Date(e.bookingDate), "yyyy-MM-dd")
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {/* <UnBookedPopOver DocEntry={e.DocEntry} CreatedBy={e.CreatedBy} Title={e.Title || ""} /> */}
                                    <Button onClick={() => {
                                        // console.log({ e })
                                        setEvaluationId(e.BookingId)
                                        push("apnmt/eval")
                                    }
                                    }>Evaluate</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
