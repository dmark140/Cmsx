'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import React, { useState } from 'react'
import { format } from "date-fns"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { runQuery } from '@/lib/utils'
import { useGlobalContext } from '@/context/GlobalContext'

interface UnBookedPopOverProps {
    DocEntry: number;
    CreatedBy: number;
    Title: string;
}

const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date.getTime());
    checkDate.setHours(0, 0, 0, 0);

    return checkDate.getTime() < today.getTime();
}

const toast = (message: string) => {
    console.error(`TOAST: ${message}`);
    alert(`TOAST: ${message}`);
}

export default function UnBookedPopOver({ DocEntry, CreatedBy, Title }: UnBookedPopOverProps) {
    const { ID } = useGlobalContext()
    const [open, setOpen] = useState(false)
    const [date, setDate] = React.useState<Date | undefined>()
    const [tempDate, setTempDate] = React.useState<Date | undefined>(date)

    const handleOpenChange = (newOpenState: boolean) => {
        setOpen(newOpenState);
        if (!newOpenState) {
            setTempDate(date);
        } else {
            setTempDate(date);
        }
    }

    const handleConfirm = async () => {
        if (!tempDate) return;

        if (isPastDate(tempDate)) {
            toast("Unable to schedule. Please select a future or current date.");
            return;
        }

        let userChoice = confirm("Do you want to proceed with setting this date?");

        if (userChoice) {
            console.log(`User clicked Yes. Setting date to: ${tempDate.toLocaleDateString()}`);
            setDate(tempDate);
            setOpen(false);

            const result = await runQuery("insertBookings", [DocEntry, '', format(tempDate, "yyyy-MM-dd").toString(), ID])
            if (result) {
                await runQuery("insertNotif", [ID, CreatedBy, "Booking of " + Title, Title + " " + " We are inviting you for an interview at " + format(tempDate, "yyyy-MM-dd").toString() + " please bring essential documents"])
            } else {

            }
        } else {
            console.log("User clicked No. Date will not be set.");
        }
    }

    const isDisabled = !tempDate || isPastDate(tempDate);

    const buttonText = (() => {
        if (!tempDate) {
            return "Select a Date to Confirm";
        }
        if (isPastDate(tempDate)) {
            return "Cannot Schedule Past Date";
        }
        return `Confirm Date: ${tempDate.toLocaleDateString()}`;
    })();

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button onClick={() => setOpen(!open)}>
                    {date ? date.toLocaleDateString() : "Select date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-3'>
                <Calendar
                    mode="single"
                    selected={tempDate}
                    onSelect={setTempDate}
                    initialFocus
                    className="rounded-lg border"
                />
                <Button
                    className='mt-2 w-full'
                    onClick={handleConfirm}
                    disabled={isDisabled}
                >
                    {buttonText}
                </Button>
            </PopoverContent>
        </Popover>
    )
}