'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useGlobalContext } from '@/context/GlobalContext'
import { runQuery } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import FormDialogTable from '../approvals/FormDialogTable'
import { Separator } from '@/components/ui/separator'
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
export default function AccountInfo() {
    const { ID } = useGlobalContext()
    const [data, setData] = useState<Project[]>([])
    const [DocEntry, setDocEntry] = useState(0)

    const getDocEntry = async () => {
        const getDocEntryUI = await runQuery("getDocEntryUI", [ID])
        setDocEntry(getDocEntryUI?.data[0].DocEntry ?? 0)
    }

    const fetchProject = async () => {
        try {
            const res = await fetch('/api/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryName: 'getProjectDataValue',
                    params: [ID],
                }),
            })

            const result = await res.json()
            console.log({ result })
            setData(result.data || [])
        } catch (err) {
        } finally {
        }
    }
    useEffect(() => {
        getDocEntry()
    }, [])

    useEffect(() => {
        fetchProject()
    }, [DocEntry])
    return (
        <div className='mt-4'>
            <div className='grid sm:grid-cols-3 gap-4'>
                {data.map((row, idx) => (
                    <div className='m-0 p-0  mb-4 overflow-auto max-w-[1200px]' key={idx}>
                        <div>
                            <Label> 
                                {row.iValue == "table" ? "" : row.title}
                            </Label>
                            <Card className={`p-0 m-0 px-2 py-1 ${row.iValue == "table" ? "invisible" : ""}`}>
                                {row.iValue == "table" ? "" : row.iValue}
                            </Card>
                        </div>
                    </div>
                ))}
            </div>

            {data.map((row, idx) => (

                row.iValue == "table" ?
                    <div key={idx}>
                        <div className='my-4'>
                            <Separator />
                        </div>
                        {row.iValue == "table" ? row.title : ""}
                        < FormDialogTable
                            key={idx}
                            DocEntry={row.Requirements_id}
                            dataNumber={row.dataNumber}
                            projectDataId={DocEntry}
                        />
                    </div> : ""

            ))}


            {/* <Button onClick={() => console.log(DocEntry)}>Test</Button> */}
        </div >
    )
}


