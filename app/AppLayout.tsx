'use client'
import React from 'react'
import LayoutDashb from './LayoutDashb'
import { useGlobalContext } from '@/context/GlobalContext';
import LoginPage from './login/LoginForm';

export default function AppLayout() {
    const { ID } = useGlobalContext();

    return (
        <div>
            {ID ?
                <LayoutDashb /> :
                <LoginPage   />
            }
        </div>
    )
}
