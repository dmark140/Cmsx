import React from 'react'
import UserInfo from './UserInfo'
import AccountInfo from './AccountInfo'
import { Separator } from '@/components/ui/separator'

export default function Layout() {

  // get user info
  // get user GI sheet


  return (
    <div>
      <div className='my-4'><UserInfo /></div>
      <Separator/>
      <div><AccountInfo /></div>
    </div>
  )
}
