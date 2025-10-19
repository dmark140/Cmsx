'use client'
import React from 'react'
import LayoutDashb from './LayoutDashb'
import { useGlobalContext } from '@/context/GlobalContext';
import LoginPage from './login/LoginForm';
import { getGlobalUserName } from '@/lib/globalUser';

export default function AppLayout() {
    const { ID, setID , userName } = useGlobalContext();

    return (
        <div>
            {/* <button onClick={() => setID(0)}>restart</button> */}
            {/* {getGlobalUserName()} */}
            {ID ?
                <LayoutDashb /> :
                <LoginPage />
            }
        </div>
    )
}
