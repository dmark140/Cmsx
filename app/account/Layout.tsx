
'use client'
import React from 'react'
import UserInfo from './UserInfo'
import AccountInfo from './AccountInfo'
import { Separator } from '@/components/ui/separator'
import { useGlobalContext } from '@/context/GlobalContext'

export default function Layout() {
  const { ID } = useGlobalContext()
  return (
    <div>
      <div className='my-4'>
        <UserInfo userId={ID} hidePassword={false} />
      </div>
      <Separator />
      <div>
        <AccountInfo userId={ID} />
      </div>
    </div>
  )
}
