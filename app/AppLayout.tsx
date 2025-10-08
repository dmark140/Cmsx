'use client'
import React from 'react'
import LayoutDashb from './LayoutDashb'
import { useGlobalContext } from '@/context/GlobalContext';
import LoginPage from './login/LoginForm';

export default function AppLayout() {
    const { ID, setID } = useGlobalContext();

    return (
        <div>
            {/* <button onClick={() => setID(0)}>restart</button> */}
            {ID ?
                <LayoutDashb /> :
                <LoginPage />
            }
        </div>
    )
}
