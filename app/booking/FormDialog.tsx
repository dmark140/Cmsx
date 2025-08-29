'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { runQuery } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useLayoutEffect, useState } from 'react'
import { toast } from 'sonner'
import { format } from "date-fns"
import { useGlobalContext } from '@/context/GlobalContext'
import { useLoadingStore } from '@/lib/router/useLoadingStore'

type ShowProjectProps = {
    day: any
    dateStr: string,
    isSameMonth: boolean,
    count: number
    onClose: () => void
}

type Project = {
    DocEntry: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Title: string;
    Disc: string;
}

type BookingInfo = {
    DocEntry: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Title: string;
    Disc: string;
    bookingDate: string;
    istatus: string;
}

export default function FormDialog({ day, dateStr, isSameMonth, count, onClose }: ShowProjectProps) {
    const { ID } = useGlobalContext()
    const { isLoading, setLoading } = useLoadingStore()
    const [bookings, setbookings] = useState<Project[]>([])
    const [DayBooked, setDayBooked] = useState<BookingInfo[]>([])
    const [selectedBookings, setSelectedBookings] = useState<number[]>([])
    const [selectedDayBookings, setSelectedDayBookings] = useState<number[]>([])
    const [open, setOpen] = useState(false)

    const toggleBookingSelection = (id: number) => {
        setSelectedBookings(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        )
    }

    const toggleDayBookingSelection = (id: number) => {
        setSelectedDayBookings(prev =>
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        )
    }

    const getbookingsData = async () => {
        setSelectedBookings([])
        setbookings([])
        const data = await runQuery("getprojects_data_a_headerWhereNotInBooking", [])
        if (data) {
            setbookings(data.data)
        } else {
            toast.error("Failed to fetch data")
        }
    }

    const getBookingPerDays = async () => {
        setSelectedDayBookings([])
        const Data = await runQuery("getprojects_data_a_headerWhereNotInBookingPerDay", [format(day, "yyyy-MM-dd").toString()])
        if (Data) {
            setDayBooked(Data.data)
        } else {
            toast.error("Failed to fetch bookings for the day")
        }
    }

    const transferBookings = async () => {
        for (const bookingId of selectedBookings) {
            const booking = bookings.find(b => b.DocEntry === bookingId)
            if (booking) {
                const result = await runQuery("insertBookings", [booking.DocEntry, '', format(day, "yyyy-MM-dd").toString(), ID])
                if (result) {
                    toast.success(`Booking for ${booking.FirstName} ${booking.LastName} transferred.`)
                } else {
                    toast.error(`Failed to transfer ${booking.FirstName} ${booking.LastName}.`)
                }
            }
        }
        await getbookingsData()
        await getBookingPerDays()
        setSelectedBookings([])
    }

    const revokeBookings = async () => {
        for (const bookingId of selectedDayBookings) {
            const booking = DayBooked.find(b => b.DocEntry === bookingId)
            if (booking) {
                const result = await runQuery("setbookingsVoid0", [booking.DocEntry])
                if (result) {
                    toast.success(`Revoked: ${booking.FirstName} ${booking.LastName}`)
                } else {
                    toast.error(`Failed to revoke ${booking.FirstName} ${booking.LastName}`)
                }
            }
        }
        await getBookingPerDays()
        await getbookingsData()
        setSelectedDayBookings([])
    }

    useLayoutEffect(() => {
        onClose()
    }, [open])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger onClick={async () => {
                setLoading(true)
                await getbookingsData()
                await getBookingPerDays()
                setLoading(false)
            }}>
                <Card
                    key={dateStr}
                    className={`min-h-[60px] p-1 cursor-pointer hover:bg-muted-foreground rounded-none ${!isSameMonth ? 'opacity-40' : ''}`}  >
                    <CardContent className="flex flex-col items-center">
                        <span className="text-sm font-bold">{format(day, "d")}</span>
                        {count > 0 && (
                            <span className="text-xs mt-1 bg-green-700  rounded-md px-2">({count})scheduled</span>
                        )}
                    </CardContent>
                </Card>
            </AlertDialogTrigger>

            <AlertDialogContent className='min-w-[730px] overflow-auto justify-center'>
                <AlertDialogHeader>
                    <AlertDialogAction className='w-fit float-right ml-auto'>Close</AlertDialogAction>
                    <AlertDialogTitle>
                        <div className="text-sm mt-4 p-4 flex gap-2 min-w-[680px] w-full border rounded-card">
                            {/* Unappointed */}
                            <div className="w-full max-h-[80vh] overflow-auto border-r px-2">
                                <h1 className="text-xl font-bold mb-2">Unappointed Requests</h1>

                                {isLoading ? (
                                    <div className="flex justify-center items-center h-40">
                                        {/* <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" /> */}
                                    </div>
                                ) : (
                                    <>
                                        {bookings.map((booking, i) => {
                                            const isSelected = selectedBookings.includes(booking.DocEntry)
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => toggleBookingSelection(booking.DocEntry)}
                                                    className={`cursor-pointer ${isSelected ? 'bg-blue-100 border border-blue-400' : ''} border px-2 rounded-md`}
                                                >
                                                    <Card className="max-w-[290px] w-full px-2 m-0 gap-0 py-1">
                                                        <div className="flex gap-2">
                                                            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
                                                                {booking.FirstName[0]}{booking.LastName[0]}
                                                            </div>
                                                            <div className="overflow-auto max-w-[200px] w-full whitespace-nowrap">
                                                                <p>{booking.FirstName} {booking.LastName}</p>
                                                                <p className="text-muted">{booking.Title}</p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )
                                        })}
                                        <div className="flex justify-between gap-2 mt-2">
                                            <Button variant={"ghost"} className='invisible'> Clear</Button>
                                            <Button className={`${bookings.length < 1 ? "invisible" : ""}`} variant="ghost" onClick={transferBookings}><ChevronRight /> Transfer</Button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Appointed */}
                            <div className="w-full max-h-[80vh] overflow-auto px-2">
                                <h1 className="text-xl font-bold mb-2">Appointed on {format(day, "MM-dd")}</h1>

                                {isLoading ? (
                                    <div className="flex justify-center items-center h-40">
                                        {/* <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" /> */}
                                    </div>
                                ) : (
                                    <>
                                        {DayBooked.map((item, i) => {
                                            const isSelected = selectedDayBookings.includes(item.DocEntry)
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        if (item.istatus === "Evaluated") return
                                                        toggleDayBookingSelection(item.DocEntry)

                                                    }
                                                    }
                                                    className={`cursor-pointer ${isSelected ? 'bg-red-100 border border-red-400' : ''} border px-2 rounded-md`}
                                                >
                                                    <Card className="max-w-[290px] w-full px-2 m-0 gap-0 py-1">
                                                        <div className="flex gap-2">
                                                            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
                                                                {item.FirstName[0]}{item.LastName[0]}{item.DocEntry}
                                                            </div>
                                                            <div className="overflow-auto max-w-[200px] w-full whitespace-nowrap">
                                                                <p>{item.FirstName} {item.LastName}</p>
                                                                <p className="text-muted px-1">{item.Title}</p>
                                                                <p className={`text-foreground px-1  w-fit rounded-md ${item.istatus === "Evaluated" ? "bg-green-600" : "bg-orange-600"} `}>{item.istatus}</p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )
                                        })}
                                        <div className="flex justify-between gap-2 mt-2">
                                            <Button variant="ghost" onClick={revokeBookings}><ChevronLeft /> Revoke </Button>
                                            <Button variant={"default"} onClick={() => console.log("Selected Bookings:", selectedBookings)}>Update</Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </AlertDialogTitle>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}
