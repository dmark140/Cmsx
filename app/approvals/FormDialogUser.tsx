'use client'

import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { runQuery } from '@/lib/utils'
import { ArrowBigRightDash, LoaderIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
type ShowProjectProps = {
    projectId: number
    DocEntry?: number
    onClose?: () => void
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
    DocEntry: number
    AddedBy: number
    Title: string
    Disc: string
    createdDate: string
    void: string
    DocNum: number
    type: string
    title: string
    value: string
    createdBy: number
    createdDateRequirement: string
    voidRequirement: string
}

export default function FormDialogUser({ projectId, DocEntry, onClose }: ShowProjectProps) {

    const [data, setData] = useState<Project[]>([])
    const [userData, setuserData] = useState<UserAccount[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProject = async () => {
        try {
            const res = await fetch('/api/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryName: 'getProjecsInFOrm',
                    params: [projectId],
                }),
            })

            const result = await res.json()
            setData(result.data || [])
        } catch (err) {
            toast.error('Failed to fetch project')
        } finally {
            setLoading(false)
        }
    }
    const getUser = async () => {
        if (projectId != 1) return
        const data = await runQuery('getUserForApproval', [DocEntry])
        console.log(data)
        setuserData(data)

    }
    useEffect(() => {
        setLoading(false)
    }, [projectId])

    // if (loading) {
    //     return (
    //         <div className="space-y-4">
    //             <LoaderIcon className='animate-spin' />
    //         </div>
    //     )
    // }


    return (
        <div>

            <Dialog>
                <DialogTrigger className='flex items-center gap-1 cursor-pointer ' onClick={async () => {
                    setLoading(true)
                    await fetchProject()
                    await getUser()
                    setLoading(false)

                }}> <ArrowBigRightDash className='text-primary' /> {DocEntry}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='mt-4'></DialogTitle>
                        <div className='overflow-auto max-h-[80vh]'>
                            {loading ? <>
                                <LoaderIcon className='animate-spin' />
                                Loading ...
                            </> : <div className="max-w-xl mx-auto space-y-6">
                                <Card className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xl font-bold mb-1">{data[0]?.Title}</span>
                                            <span className="text-sm text-muted-foreground mb-4">{data[0]?.Disc}</span>
                                        </div>
                                        {onClose && (
                                            <button
                                                onClick={onClose}
                                                className="text-sm text-gray-500 hover:text-red-500"
                                            >
                                                Close
                                            </button>
                                        )}
                                    </div>
                                    {data.map((row, idx) => (
                                        <div className="mb-4" key={idx}>
                                            <Label className="block mb-1 font-semibold">{row.title}</Label>
                                            {
                                                row.type != 'file' && (
                                                    <Input placeholder={row.value} type={row.type}
                                                        defaultValue={
                                                            projectId === 1 ?
                                                                row.title === "First Name" && userData.length > 0 ? userData[0].FirstName :
                                                                    row.title === "Middle Name" && userData.length > 0 ? userData[0].MiddleName :
                                                                        row.title === "Last Name" && userData.length > 0 ? userData[0].LastName :
                                                                            row.title === "Username" && userData.length > 0 ? userData[0].user :
                                                                                row.title === "Email" && userData.length > 0 ? userData[0].email :
                                                                                    row.title === "Password" && userData.length > 0 ? userData[0].pass : ""

                                                                : ""
                                                        }
                                                    />
                                                )}
                                        </div>
                                    ))}
                                </Card>
                            </div>
                            }

                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}
