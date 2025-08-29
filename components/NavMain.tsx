'use client'

import React from 'react'
import { Button } from './ui/button'
import { BriefcaseBusinessIcon, Calendar, GitPullRequestCreateIcon, HandHeartIcon, HomeIcon, NotebookPen, Settings2Icon } from 'lucide-react'
import { SidebarMenuButton } from './ui/sidebar'
import { useRouter } from 'next/navigation'
import { useGlobalContext } from '@/context/GlobalContext'
import { useGlobalPush } from '@/lib/router/useGlobalPush'


export default function NavMain() {
    // const router = useRouter()
    const { push } = useGlobalPush()

    const { setloading } = useGlobalContext();
    const navItems = [
        { name: "Dashboard", href: "/", icon: HomeIcon },
        // { name: "Finance", href: "/finance", icon: BriefcaseBusinessIcon },
        { name: "User Defiend Objects", href: "/project", icon: HandHeartIcon },
        { name: "Requsts", href: "/request", icon: GitPullRequestCreateIcon },
        { name: "Assessment", href: "/ana", icon: GitPullRequestCreateIcon },
        { name: "Approvals", href: "/approvals", icon: GitPullRequestCreateIcon },
        { name: "qmnger", href: "/qmnger", icon: GitPullRequestCreateIcon },
        // { name: "Appointment", href: "/booking", icon: Calendar },
        // { name: "Evaluation", href: "/booking/apnmt", icon:NotebookPen  },
        { name: "Settings", href: "/settings", icon: Settings2Icon },
    ]


    return (
        <div className=''>
            {navItems.map((item, i) => (
                <SidebarMenuButton asChild key={i}>
                    <Button
                        variant='ghost'
                        onClick={() => {
                            setloading(true)
                            // router.push(item.href)
                            push(item.href)

                        }
                        }
                        className="justify-start text-left w-full px-4 flex gap-2 items-center" >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                    </Button>
                </SidebarMenuButton>
            ))}
        </div>
    )
}
