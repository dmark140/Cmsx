
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalContext } from '@/context/GlobalContext'
import { toast } from 'sonner' 
import { useGlobalPush } from '@/lib/router/useGlobalPush'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { ID } = useGlobalContext()
     const { push } = useGlobalPush()

    useEffect(() => {
        if (ID === 0 || ID === undefined) {
            toast.warning('You have been automatically logged out.')
            push('/')
        }
    }, [ID, push])
    return <>{children}</>
}
