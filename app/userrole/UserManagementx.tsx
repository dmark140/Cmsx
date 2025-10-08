'use client'

import { useEffect, useState } from 'react'
import { runQuery } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

type User = {
    DocEntry: number
    email: string
    FirstName: string
    LastName: string
    MiddleName: string
    pass: string
    type: number
    user: string
    void: number // 1 = active, 0 = inactive
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        try {
            const res = await runQuery('getAllUsers', [])
            if (res.success) {
                setUsers(res.data)
            } else {
                console.error('Error fetching users:', res)
            }
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleLevelChange = async (docEntry: number, newLevel: string) => {
        console.log(`User ${docEntry} new level:`, newLevel)
        await runQuery('updateUserlevel', [newLevel, docEntry])
    }

    const handleStatusChange = async (docEntry: number, checked: boolean) => {
        console.log(`User ${docEntry} status:`, checked)
        await runQuery('updateUserVoid', [checked ? 1 : 0, docEntry])

        setUsers(prev =>
            prev.map(u =>
                u.DocEntry === docEntry ? { ...u, void: checked ? 1 : 0 } : u
            )
        )

    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                <span>Loading users...</span>
            </div>
        )
    }

    return (

        <Table className='px-2 mt-2'>
            <TableHeader>
                <TableRow>
                    <TableHead>DocEntry</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User Level</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(u => (
                    <TableRow key={u.DocEntry}>
                        <TableCell>{u.DocEntry}</TableCell>
                        <TableCell>
                            {u.FirstName} {u.MiddleName} {u.LastName}
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                            <Select
                                defaultValue={String(u.type)}
                                onValueChange={val => handleLevelChange(u.DocEntry, val)}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Admin</SelectItem>
                                    <SelectItem value="2">Staff</SelectItem>
                                    <SelectItem value="3">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-center">
                            <Checkbox
                                checked={u.void === 1}
                                onCheckedChange={e => handleStatusChange(u.DocEntry, e === true)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
