'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button } from './ui/button'
import { SidebarMenuButton } from './ui/sidebar'
import { useGlobalContext } from '@/context/GlobalContext'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import { navItems } from '@/lib/NavigationList'
import { runQuery } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// 👇 Extend type for local state
type NavItemType = (typeof navItems)[number] & {
  hidden?: boolean
  href?: string
}



export default function NavMain() {

  

  const router = useRouter()

  useEffect(() => {
    navItems.forEach(item => {
      if (item.href && item.href !== "/") {
        router.prefetch(item.href)
      }
    })
  }, [router])

  
  const { push } = useGlobalPush()
  const { setloading, UserLevel } = useGlobalContext()
  const [allowedNavs, setAllowedNavs] = useState<NavItemType[]>([])

  const getDashBoard = async () => {
    const res = await runQuery('getDashBoard', [])
    if (res.success) {
      const data = res.data
      const accessField = UserLevel === 1 ? 'admin' : UserLevel === 2 ? 'staff' : 'user'

      const filtered: NavItemType[] = navItems.map((item) => {
        const perm = data.find((d: any) => d.nav_id === item.id)
        let allowed = true

        if (UserLevel !== 1) {
          allowed = perm ? perm[accessField] === 1 : false
        }

        return {
          ...item,
          href: allowed ? item.href : '#',
          hidden: !allowed,
        }
      })

      setAllowedNavs(filtered)
    }
  }

  useLayoutEffect(() => {
    getDashBoard()
  }, [UserLevel])

  return (
    <div>
      {allowedNavs
        .filter((item) => !item.hidden)
        .map((item, i) => (
          <SidebarMenuButton asChild key={i}>
            <a
              href={item.href}
              onClick={() => item.href !== '#' && setloading(true)}
              className={`justify-start text-left w-full px-4 flex gap-2 items-center rounded-md transition-colors ${
                item.href === '#'
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </a>
          </SidebarMenuButton>
        ))}

      {/* <Button onClick={getDashBoard}>Refresh Dashboard</Button> */}
    </div>
  )
}
