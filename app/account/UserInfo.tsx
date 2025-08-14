'use client'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { runQuery } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

type UserInfoProps = {
  userId: number
  hidePassword?: boolean // optional
}

export default function UserInfo({ userId, hidePassword = false }: UserInfoProps) {
  const [email, setEmail] = useState("")
  const [fullname, setFullname] = useState("")

  const getUserInfo = async () => {
    try {
      if (userId <= 0) return
      const ret = await runQuery("getUserByEmail", [userId])
      setEmail(ret.data[0].email)
      setFullname(
        ret.data[0].FirstName +
          " " +
          ret.data[0].MiddleName +
          " " +
          ret.data[0].LastName
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [userId])

  return (
    <div className='grid sm:grid-cols-3 gap-4'>
      <div>
        <Label>Full Name</Label>
        <Card className='p-0 m-0 px-2 py-1'>
          {fullname || "****"}
        </Card>
      </div>

      <div>
        <Label>Email</Label>
        <Card className='p-0 m-0 px-2 py-1'>
          {email || "****"}
        </Card>
      </div>

      {!hidePassword && (
        <div>
          <Label>Password</Label>
          <Card className='p-0 m-0 px-2 py-1 flex'>
            <div className='flex justify-between w-full'>
              <span>*******</span>
              <span className='text-blue-700 p-0 m-0 cursor-pointer'>Change</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
