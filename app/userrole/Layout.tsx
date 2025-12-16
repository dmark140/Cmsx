'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { navItems } from '@/lib/NavigationList'
import { runQuery } from '@/lib/utils'
import UserManagementx from './UserManagementx'

export default function Layout() {
  const [tab, settab] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [permissions, setPermissions] = useState<
    Record<number, { admin: boolean; staff: boolean; user: boolean }>
  >({})

  const togglePermission = async (id: number, role: 'admin' | 'staff' | 'user', checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [role]: checked,
      },
    }))

    await runQuery(
      role === 'staff' ? 'insertRole_managerStaff' : 'insertRole_managerUser',
      [id, checked ? 1 : 0],
    )
  }

  const getDashBoard = async () => {
    const res = await runQuery('getDashBoard', [])
    if (!res?.success) return

    const newPermissions: Record<number, { admin: boolean; staff: boolean; user: boolean }> = {}

    res.data.forEach((row: any) => {
      newPermissions[row.nav_id] = {
        admin: false,
        staff: row.staff === 1,
        user: row.user === 1,
      }
    })

    setPermissions(newPermissions)
  }

  useEffect(() => {
    setIsMounted(true)
    getDashBoard()
  }, [])

  if (!isMounted) {
    return (
      <div className='flex justify-center items-center h-40 text-lg text-gray-500'>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <div className='flex gap-2 text-black bg-white w-fit rounded-md'>
        <div className='p-0.5 px-1'>
          <button onClick={() => settab(0)} className={`${tab === 0 ? "rounded-md px-2 bg-black/85 text-white" : ""} rounded-md px-2`}>Role Management</button>
          <button onClick={() => settab(1)} className={`${tab === 1 ? "rounded-md px-2 bg-black/85 text-white" : ""} rounded-md px-2`}>User Management</button>
        </div>
      </div>

      {tab === 0 &&
        <div className="pt-4">
          <Table className="border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nav</TableHead>
                <TableHead className="text-center">Staff</TableHead>
                <TableHead className="text-center">User</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {navItems.map(item => {
                const roles = permissions[item.id] || { admin: false, staff: false, user: false }

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <item.icon className="w-4 h-4" /> {item.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={roles.staff}
                        onCheckedChange={e => togglePermission(item.id, 'staff', e === true)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={roles.user}
                        onCheckedChange={e => togglePermission(item.id, 'user', e === true)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      }

      {tab === 1 && <UserManagementx />}
    </div >
  )
}