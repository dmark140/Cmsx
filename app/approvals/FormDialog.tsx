'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { runQuery } from '@/lib/utils'
import { ArrowBigRightDash, Disc, LoaderIcon } from 'lucide-react'
import React, { useLayoutEffect, useState } from 'react'
import { toast } from 'sonner'
import FormDialogTable from './FormDialogTable'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
type ShowProjectProps = {
    DocEntry: number
    onClose: () => void
}
type UserAccount = {
    DocEntry: number
    type: number
    email: string
    FirstName: string
    MiddleName: string
    LastName: string
    user: string
    pass: string
    void: number
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

export default function FormDialog({ DocEntry, onClose }: ShowProjectProps) {

    const [data, setData] = useState<Project[]>([])
    const [userData, setuserData] = useState<UserAccount[]>([])
    const [loading, setLoading] = useState(true)

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
            console.log({ result })
            setData(result.data || [])
        } catch (err) {
            toast.error('Failed to fetch project')
        } finally {
            setLoading(false)
        }
    }
    // const getUser = async () => {
    //     if (projectId != 1) return
    //     const data = await runQuery('getUserForApproval', [DocEntry])
    //     console.log(data)
    //     setuserData(data)

    // }
    useLayoutEffect(() => {
        setLoading(false)
    }, [DocEntry])


    return (

        <AlertDialog>
            <AlertDialogTrigger onClick={async () => {
                setLoading(true)
                await fetchProject()
                setLoading(false)
            }}> <div className='flex gap-2 items-center'><ArrowBigRightDash />{DocEntry} </div></AlertDialogTrigger>
            <AlertDialogContent className=' min-w-[1200px] overflow-auto'>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <div>
                            <span className="text-xl font-bold mb-1">{data[0]?.projectTitle}</span>
                            <span className="text-sm text-muted-foreground mb-4">{data[0]?.Disc}</span>
                        </div>
                    </AlertDialogTitle>
                    <div className='max-h-[80vh] overflow-auto'>
                        {loading ? <>
                            <LoaderIcon className='animate-spin' />
                            Loading ...
                        </> : <div className=" mx-auto space-y-6">
                            <div className="flex justify-between items-start">

                            </div>
                            {data.map((row, idx) => (
                                <div className='m-0 p-0  mb-4 overflow-auto max-w-[1200px]' key={idx}>
                                    <span className="block mb-1 font-semibold">{row.title}</span>
                                    {row.iValue == "table" ? <FormDialogTable DocEntry={row.Requirements_id} dataNumber={row.dataNumber} projectDataId={DocEntry} /> : row.iValue}
                                    <Separator />
                                </div>
                            ))}
                        </div>
                        }
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                    {/* <Button onClick={() => console.log({ data, DocEntry })}>Check</Button> */}
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
