'use client'
import React, { useEffect, useState } from 'react'
import { DropDownBaranggay } from './DropDownBaranggay'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import FundInfo from './FundInfo'
import PendingDshb from './PendingDshb'
import Servicesx from './Servicesx'
import { useGlobalContext } from '@/context/GlobalContext'
import TreeX from './TreeX'

export default function Dashboard() {
  // 🗓️ Initialize dates
  const today = new Date()
  const monthAgo = new Date()
  monthAgo.setMonth(today.getMonth() - 1)
  const { UserLevel } = useGlobalContext()

  // 🧠 States
  const [startDate, setStartDate] = useState(monthAgo.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0])
  const [barangay, setBarangay] = useState("")
  useEffect(() => {
      
    
  }, [UserLevel])
  
  return (
    <div>

      <div className='flex items-center justify-between'>
        <div className='font-semibold text-xl '>Dashboard</div>
        <div className="sm:flex gap-4 items-center">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-fit border border-white/50" />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-fit border border-white/50" />
          <div className="border w-fit rounded-md border-white/50 items-center">
            <div className="mt-1">
              <DropDownBaranggay onSelect={(val) => setBarangay(val)} />
            </div>
          </div>
        </div>
      </div>

      <Separator className='my-2' />

      <div className='grid sm:grid-cols-2 gap-4'>
        <FundInfo barangay={barangay} startDate={startDate} endDate={endDate} />
        <PendingDshb barangay={barangay} startDate={startDate} endDate={endDate} />
      </div>
      <Separator className='my-4' />
      <Servicesx barangay={barangay} startDate={startDate} endDate={endDate} />
      <TreeX barangay={barangay} startDate={startDate} endDate={endDate} />

    </div>

  )
}
