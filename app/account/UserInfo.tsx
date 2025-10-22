'use client'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { runQuery } from '@/lib/utils'
import React, { useLayoutEffect, useState } from 'react'

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

  useLayoutEffect(() => {
    console.log({ userId } , "asd")
    getUserInfo()
  }, [userId])

  return (
    <div className='  sm:grid-cols-3 gap-2'>
      <div className='flex '>
        <Label className='font-bold'>Full Name : </Label>
        {fullname || "****"}
      </div>

      <div className='flex '>
        <Label className='font-bold'>Email : </Label>
        {email || "****"}
      </div>

      {!hidePassword && (
        <div className='flex items-center '>
          <Label>Password</Label>
          <span className='mt-2'>*******</span>
          {/* <Card className='p-0 m-0 px-2 py-1 flex'>
            <div className='flex justify-between w-full'>
              <span>*******</span>
              <span className='text-blue-700 p-0 m-0 cursor-pointer'>Change</span>
            </div>
          </Card> */}
        </div>
      )}
    </div>
  )
}
