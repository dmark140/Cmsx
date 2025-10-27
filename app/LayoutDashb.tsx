'use client'
import { AppSidebar } from '@/components/AppSidebar'
import React, { useEffect } from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from '@/components/ui/SiteHeader'
import { useGlobalContext } from '@/context/GlobalContext'
import { useRouter } from 'next/navigation'

export default function LayoutDashb() {
  const { UserLevel } = useGlobalContext();
  const route = useRouter()
  useEffect(() => {
    if(UserLevel != 1){
      route.push("/dsrb/usr")
    }else{
      route.push("/dsrb/adm")
    }
  }, [UserLevel])
 
useEffect(() => {
  route.prefetch("/dsrb/adm")
  route.prefetch("/notifs")
}, [])

return (
  <div>  <SidebarProvider
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 text-sm">
            {/* <Dahsboard /> */}
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider></div>
)
}
