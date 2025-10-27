import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGlobalPush } from '@/lib/router/useGlobalPush'

import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function Layout() {
     const { push } = useGlobalPush()
    const modules = [
        {
            link: "project/create",
            name: "Create Froms",
        }, {
            link: "project/manage",
            name: "Manage Forms",
        },
    ]
   


    const managements = [
        {
            link: "project/listmng",
            name: "Selection List",
        },
    ]


    return (
        <div>
            <div className='grid '>
                <p className='font-bold text-lg'>Modules</p>
                {modules.map((item, index) => (
                    <Button key={index} className='w-fit' variant={"ghost"} onClick={() => {
                        toast(`routing to  ${item.name}`)
                        push(item.link)
                    }

                    }>
                        {item.name}
                    </Button>
                ))}
                <Separator />
                <p className='font-bold text-lg'>Fields</p>
                {managements.map((item, index) => (
                    <Button key={index} className='w-fit' variant={"ghost"} onClick={() => push(item.link)}>
                        {item.name}
                    </Button>
                ))}


                {/* <p className='font-bold text-lg'>Reports</p>
                {reports.map((item, index) => (
                    <Button key={index} className='w-fit' variant={"ghost"} onClick={() => push(item.link)}>
                        {item.name}
                    </Button>
                ))} */}
            </div>

        </div>
    )
}
