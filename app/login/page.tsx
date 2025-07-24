import React from 'react'
import { LoginForm } from './LoginForm'

export default function page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center ">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}
