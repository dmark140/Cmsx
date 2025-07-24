import LayoutDashb from '@/app/LayoutDashb'
import { LoginForm } from '@/app/login/LoginForm'
import React from 'react'

export default function Layout() {
    return (
        <div>

            <LayoutDashb />
            <LoginForm className='max-w-[380px] mt-10 mx-auto' />
        </div>
    )
}
