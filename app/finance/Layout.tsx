'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGlobalPush } from '@/lib/router/useGlobalPush'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function Layout() {
    const { push } = useGlobalPush()
    const modules = [
        {
            link: "finance/coa",
            name: "Chart of Accounts",
        }, {
            link: "finance/je",
            name: "Journal Entry ",
        },
    ]
    const reports = [
        {
            link: "",
            name: "Chart of Accounts",
        },
    ]
    return (
        <div>
            <div className='grid '>
                <p className='font-bold text-lg'>Modules</p>
                {modules.map((item, index) => (

                    <Button key={index} className='w-fit' variant={"ghost"} onClick={() => push(item.link)}>
                        {item.name}
                    </Button>
                ))}
                <Separator />
                <p className='font-bold text-lg'>Reports</p>
                {reports.map((item, index) => (

                    <Button key={index} className='w-fit' variant={"ghost"} onClick={() => push(item.link)}>
                        {item.name}
                    </Button>
                ))}
            </div>

        </div>
    )
}
