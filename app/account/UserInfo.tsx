'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useGlobalContext } from '@/context/GlobalContext'
import { runQuery } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type userinfo = {
    email: string
    FirstName: string
    LastName: string
    MiddleName: string
}
export default function UserInfo() {
    const { ID } = useGlobalContext()
    const [email, setemail] = useState("")
    const [fullname, setfullname] = useState("")
    const getuserinfo = async () => {
        try {
            if (ID <= 0) return
            const ret = await runQuery("getUserByEmail", [ID])
            setemail(ret.data[0].email)
            setfullname(ret.data[0].FirstName + " " + ret.data[0].MiddleName + " " + ret.data[0].LastName)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getuserinfo()
    }, [])

    return (
        <div>
            <div className='grid sm:grid-cols-3 gap-4'>
                <div>
                    <Label>Full Name</Label>
                    <Card className='p-0 m-0 px-2 py-1'>
                        {fullname ? fullname : "****"}

                    </Card>
                </div>

                <div>
                    <Label>Email</Label>
                    <Card className='p-0 m-0 px-2 py-1'>
                        {email ? email : "****"}
                    </Card>
                </div>
                <div>
                    <Label>Password</Label>
                    <Card className='p-0 m-0 px-2 py-1 flex'>
                        <div className='flex justify-between'> <span>*******</span>
                            <span className='text-blue-700 p-0 m-0 cursor-pointer'>Change</span></div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
