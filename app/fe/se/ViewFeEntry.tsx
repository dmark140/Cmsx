'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { runQuery } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type FeEntryProps = {
    evaluation_id: number
}
type feEntry = {
    DocEntry: number
    created_by: number
    acquired_fund: number
    requested_fund: number
}

export default function ViewFeEntry({ evaluation_id }: FeEntryProps) {
    const [open, setopen] = useState(false)
    const [data, setdata] = useState<feEntry[]>([
        {
            created_by: 0,
            DocEntry: 0,
            acquired_fund: 0,
            requested_fund: 0
        }
    ])

    const getdat = async () => {
        const data = await runQuery("getFundEntryPerID", [evaluation_id])
        console.log({ data })
        setdata(data.data)
    }
    useEffect(() => {
        getdat()
    }, [evaluation_id])


    return (
        <div>
            <Button variant="secondary" onClick={() => setopen(true)}>View Entry</Button>
            <Dialog open={open} onOpenChange={setopen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Fund Entry  #{evaluation_id}</DialogTitle>
                    </DialogHeader>
                    <Label>Requested Fund : Php{data[0].requested_fund}</Label>
                    <Label>Acquired Fund : Php{data[0].acquired_fund}</Label>
                    <Button onClick={getdat}>getdat</Button>

                </DialogContent>
            </Dialog>
        </div>
    )
}
