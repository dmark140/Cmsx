'use client'
import React from 'react'
import LayoutDashb from './LayoutDashb'
import { LoginForm } from './login/LoginForm'
import { useGlobalContext } from '@/context/GlobalContext';

export default function AppLayout() {
    const { ID } = useGlobalContext();

    return (
        <div>
            {ID ?
                <LayoutDashb /> :
                <LoginForm className='max-w-[380px] mt-10 mx-auto' />
            }
        </div>
    )
}
