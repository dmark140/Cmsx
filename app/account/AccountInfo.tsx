'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { runQuery } from '@/lib/utils'
import React, { useLayoutEffect, useState } from 'react'
import FormDialogTable from '../approvals/FormDialogTable'
import { Separator } from '@/components/ui/separator'

type AccountInfoProps = {
  userId: number
}

type Project = {
  DocEntry: number;
  Requirements_id: number;
  Requirements_value: string;
  Disc: string;
  iValue: string;
  dataNumber: number;
  name: string | null;
  projectTitle: string;
  title: string;
  type: string;
}

export default function AccountInfo({ userId }: AccountInfoProps) {
  const [data, setData] = useState<Project[]>([])
  const [DocEntry, setDocEntry] = useState(0)

  const getDocEntry = async () => {
    const getDocEntryUI = await runQuery("getDocEntryUI", [userId])
    console.log({ getDocEntryUI })
    console.log(getDocEntryUI?.data[0].DocEntry)
    setDocEntry(getDocEntryUI?.data[0].DocEntry ?? 0)
  }

  const fetchProject = async () => {
    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryName: 'getProjectDataValue',
          params: [DocEntry],
        }),
      })

      const result = await res.json()
      let projectData = result.data || []

      // Add 'age' before 'Birth Date'
      const birthIndex = projectData.findIndex(d => d.title === 'Birth Date')
      if (birthIndex !== -1) {
        const birthDateStr = projectData[birthIndex].Requirements_value
        const birthDate = new Date(birthDateStr)
        if (!isNaN(birthDate.getTime())) {
          const age = Math.floor(
            (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          )

          const ageRow = {
            ...projectData[birthIndex],
            title: 'Age',
            Requirements_value: birthDateStr,
            iValue: String(age),
          }

          projectData = [
            ...projectData.slice(0, birthIndex),
            ageRow,
            ...projectData.slice(birthIndex),
          ]
        }
      }

      setData(projectData)
    } catch (err) {
      console.error(err)
    }
  }

  useLayoutEffect(() => {
    getDocEntry()
  }, [userId])

  useLayoutEffect(() => {
    fetchProject()
  }, [DocEntry])

  return (
    <div className=' '>
      <div className=''>
        {data.map((row, idx) => (
          <div className='m-0 p-0  overflow-auto max-w-[1200px]' key={idx}>
            <div className='flex '>
              <Label className='font-bold'>
                {row.iValue == "table" ? "" : row.title}
              </Label>
              <div className={`p-0 m-0 px-2   ${row.iValue == "table" ? "invisible" : ""}`}>
                : {row.iValue == "table" ? "" : row.iValue}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.map((row, idx) => (
        row.iValue == "table" && (
          <div key={idx}>
            <div className='my-4'>
              <Separator />
            </div>
            {row.title}
            <FormDialogTable
              DocEntry={row.Requirements_id}
              dataNumber={row.dataNumber}
              projectDataId={DocEntry}
            />
          </div>
        )
      ))}

      {/* <Button onClick={fetchProject}>Test</Button> */}
    </div>
  )
}
