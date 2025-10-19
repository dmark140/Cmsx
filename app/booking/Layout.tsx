'use client'
import React, { useState } from 'react'
import AppointmentCalendar from './AppointmentCalendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import UnBooked from './UnBooked'
import Booked from './Booked'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const [state, setstate] = useState(1)
  return (
    <>
      {/* <AppointmentCalendar /> */}

      <div className='flex justify-between'>
        <div className='text-xl font-semibold'>Appointment</div>
        <div className='flex gap-4'>
          {/* <div className='flex items-center gap-2'>
            <Input type='radio' className='size-4' name='x' defaultChecked />
            <Label>Un-Booked</Label>
          </div>

          <div className='flex items-center gap-2'>
            <Input type='radio' className='size-4' name='x' />
            <Label>Booked</Label>
          </div> */}

          <div className='flex  items-center  px-0.5 bg-foreground rounded-md'>
            <Button onClick={() => setstate(1)} variant={state == 1 ? "secondary" : "default"}>Un-Booked</Button>
            <Button onClick={() => setstate(2)} variant={state == 2 ? "secondary" : "default"}>Booked</Button>
          </div>
        </div>
      </div>

      <Separator className='my-4' />
      {state == 1 && <UnBooked />}
      {state == 2 && <Booked />}
    </>

  )
}
