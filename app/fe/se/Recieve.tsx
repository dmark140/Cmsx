'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGlobalContext } from '@/context/GlobalContext'
import { runQuery } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type FeEntryProps = {
    evaluation_id: number
}

export default function Recieve({ evaluation_id }: FeEntryProps) {
    const [open, setopen] = useState(false)
    const [pass, setpass] = useState("")
    const [isReceived, setisReceived] = useState(false)
    const { ID } = useGlobalContext()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const userdata = await runQuery("checkPasswordWithID", [ID, pass])
        if (userdata.data.length == 0) {
            toast.error("wrong password!!")
            return
        }
        await runQuery("updateFund", [ID, evaluation_id])
        toast("Fund Recieved")
        setisReceived(true)
        setopen(false)
    }
    return (
        <div>
            {!isReceived && <Button onClick={() => setopen(true)}>Mark as received</Button>}
            <Dialog open={open} onOpenChange={setopen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Fund Entry  #{evaluation_id}</DialogTitle>
                    </DialogHeader>
                    Are you sure you that the fund was received by the client?
                    <form onSubmit={handleSubmit}>
                        <Label className='text-foreground/50'>Please input Current Admin/Staff Password</Label>
                        <Input className='border-red-500 border-2 mb-2' required type='password' onChange={(e) => setpass(e.target.value)} />
                        <div>
                            <Button type='button' onClick={() => setopen(false)} variant="destructive" >Cancel</Button>
                            <Button type='submit'  >Confirm</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
