'use client'
import { Button } from '@/components/ui/button'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import React from 'react'

export default function Layout() {
  const { push } = useGlobalPush()
  return (
    <div className='sm:grid grid-cols-3 mt-4'>
      <div className='grid'>
        <h1 className="font-bold mb-4 mx-4">Modules</h1>
        <Button onClick={() => push("/booking")} className=' w-fit' variant={"ghost"}>Appointment</Button>
        <Button onClick={() => push("/booking/apnmt")} className=' w-fit' variant={"ghost"}>Evaluation</Button>
      </div>
      <div className=''>
        <h1 className="font-bold mb-4 mx-4">Reports</h1>
        <Button onClick={() => push("/booking/apnmt/eval/print")} className=' w-fit' variant={"ghost"}>Evaluation</Button>
      </div>
    </div>
  )
}
