'use client'

import React, { useLayoutEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useGlobalContext } from '@/context/GlobalContext'
import { limitText, runQuery } from '@/lib/utils'
import { toast } from 'sonner'

type Project = { DocEntry: number; Title: string; Disc: string; void: number }
type Admin = { DocEntry: number; FirstName: string; MiddleName: string; LastName: string }
type Approval = { ApprovalDocEntry: number; Title: string; description: string; type: string; void: number }
type Approver = { ApproverDocEntry: number; FullName: string }
type ApprovalWithApprovers = Approval & { approvals_approvers: Approver[] }

export default function Layout() {
    const { FormIdRequested, ID } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [admins, setAdmins] = useState<Admin[]>([])
    const [approvers, setApprovers] = useState<Admin[]>([])
    const [approvals, setApprovals] = useState<ApprovalWithApprovers[]>([])

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [approvalType, setApprovalType] = useState<'1' | '2'>('1')
    const [selectedApprover, setSelectedApprover] = useState('')

    const fetchSQL = async (queryName: string, params: any[] = []) => {
        const res = await fetch('/api/sql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ queryName, params })
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Unknown error')
        return json.data || []
    }

    const loadData = async () => {
        try {
            setLoading(true)
            const [projects, admins] = await Promise.all([
                fetchSQL('getProjectsById', [FormIdRequested]),
                fetchSQL('getAdmins')
            ])
            setProjects(projects)
            setAdmins(admins)
        } catch (err: any) {
            toast(`Error loading data: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }
    const getApprovals = async () => {
        try {
            const d = await runQuery('getApprovalWithApprovers', [FormIdRequested])
            const data = d.data
            // ✅ Ensure we always set an array
            const normalized = Array.isArray(data) ? data : data ? [data] : []
            setApprovals(normalized)
            console.log(normalized)
        } catch (err: any) {
            toast(err.message)
            setApprovals([]) // fallback on error
        }
    }



    const setVoidApproval = async (id: number, val: string) => {
        try {
            await runQuery('setVoidApproval', [val, id])
            toast(`Approval is now ${val !== '1' ? "Inactive" : "Active"}`)
        } catch (err: any) {
            getApprovals()
            toast(err.message)
        }
    }

    const handleAddApprover = () => {
        const found = admins.find(a => a.DocEntry.toString() === selectedApprover)
        if (found && !approvers.some(a => a.DocEntry === found.DocEntry)) {
            setApprovers([...approvers, found])
        }
    }

    // const handleAddApproval = async () => {
    //     if (!FormIdRequested) return
    //     const payload = {
    //         title,
    //         description: desc,
    //         type: approvalType,
    //         approvers: approvers.map(a => ({
    //             DocEntry: a.DocEntry,
    //             FullName: `${a.FirstName} ${a.MiddleName} ${a.LastName}`
    //         }))
    //     }

    //     try {
    //         const res = await fetch('/api/sql', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 queryName: 'insert_approval',
    //                 params: [FormIdRequested, payload.title, payload.description, payload.type, ID]
    //             })
    //         })

    //         const data = await res.json()
    //         if (!res.ok) return toast(data.message)

    //         const insertId = data?.insertId
    //         if (!insertId) return toast('Failed to insert approval.')

    //         for (const approver of payload.approvers) {
    //             const res = await fetch('/api/sql', {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({
    //                     queryName: 'insert_approval_approvers',
    //                     params: [insertId, approver.DocEntry]
    //                 })
    //             })
    //             const data = await res.json()
    //             if (!res.ok) toast(data.message)
    //         }

    //         toast('Added! Note: you need to activate it ')
    //         getApprovals()
    //     } catch (err) {
    //         toast('Error adding approval.')
    //     }
    // }
    const handleAddApproval = async () => {
        const isInvalid = (value: any) =>
            value === null || value === '' || value === 0;

        if (
            isInvalid(FormIdRequested) ||
            isInvalid(title) ||
            isInvalid(desc) ||
            isInvalid(approvalType) ||
            isInvalid(ID)
        ) {
            toast('Please fill in all required fields.');
            return;
        }

        if (!approvers || approvers.length === 0) {
            toast('Please add at least one approver.');
            return;
        }


        const payload = {
            title,
            description: desc,
            type: approvalType,
            approvers: approvers.map(a => ({
                DocEntry: a.DocEntry,
                FullName: `${a.FirstName} ${a.MiddleName} ${a.LastName}`
            }))
        };
        console.log({ payload })
        // return
        try {
            const res = await fetch('/api/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryName: 'insert_approval',
                    params: [FormIdRequested, payload.title, payload.description, payload.type, ID]
                })
            });

            const data = await res.json();
            if (!res.ok) return toast(data.message);

            const insertId = data?.insertId;
            if (!insertId) return toast('Failed to insert approval.');

            for (const approver of payload.approvers) {
                const res = await fetch('/api/sql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        queryName: 'insert_approval_approvers',
                        params: [insertId, approver.DocEntry]
                    })
                });
                const data = await res.json();
                if (!res.ok) toast(data.message);
            }

            toast('Added! Note: you need to activate it');
            getApprovals();
        } catch (err) {
            toast('Error adding approval.');
        }
    };

    useLayoutEffect(() => {
        loadData()
        getApprovals()
    }, [])

    return (
        <div className="max-w-[720px] mx-auto w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map(p => (
                        <TableRow key={p.DocEntry}>
                            <TableCell>{p.DocEntry}</TableCell>
                            <TableCell>{p.Title}</TableCell>
                            <TableCell className="text-xs">{limitText(p.Disc, 30)}</TableCell>
                            <TableCell>{p.void === 1 ? 'Active' : 'Inactive'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {loading && <div className="text-center">Loading...</div>}


            <Tabs defaultValue="A" className="w-full mt-4">
                <TabsList>
                    <TabsTrigger value="A" onClick={getApprovals}>Approval List</TabsTrigger>
                    <TabsTrigger value="B">Approval Creation</TabsTrigger>
                </TabsList>

                <TabsContent value="A">
                    {approvals.length === 0 ? (
                        <p className="text-center text-muted-foreground">...No Record available...</p>
                    ) : (
                        approvals.map((approval, index) => (
                            <div key={approval.ApprovalDocEntry} className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
                                <div>
                                    <p className="font-bold">Title</p>
                                    <p className="text-muted-foreground">{approval.Title}</p>

                                    <p className="font-bold mt-2">Description</p>
                                    <p className="text-muted-foreground">{approval.description}</p>

                                    <p className="font-bold mt-2">Type</p>
                                    <p className="text-muted-foreground">{`${approval.type === '1' ? "All" : "Any"}`}</p>

                                    <div className="mt-2">
                                        <p className="font-bold">Status</p>
                                        <RadioGroup
                                            defaultValue={approval.void?.toString()}
                                            onValueChange={(val) => setVoidApproval(approval.ApprovalDocEntry, val)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="0" id={`inactive-${index}`} />
                                                <Label htmlFor={`inactive-${index}`}>Inactive</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="1" id={`active-${index}`} />
                                                <Label htmlFor={`active-${index}`}>Active</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold">Approvers</p>
                                    <ul className="list-disc list-inside text-sm">
                                        {approval.approvals_approvers?.map((a, i) => (
                                            <li key={i}>{a.FullName}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    )}
                </TabsContent>
                <TabsContent value="B">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Add Approval</h2>

                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Input value={desc} onChange={e => setDesc(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="w-full border rounded px-2 py-2 text-sm bg-card"
                                value={approvalType}
                                onChange={(e) => setApprovalType(e.target.value as 'all' | 'any')}
                            >
                                <option value="1">All Approvers</option>
                                <option value="2">Any Approver</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Add Approver</label>
                            <div className="flex gap-2">
                                <select
                                    className="w-full border rounded px-2 py-2 text-sm bg-card"
                                    value={selectedApprover}
                                    onChange={e => setSelectedApprover(e.target.value)}
                                >
                                    <option value="">Select admin</option>
                                    {admins.map(a => (
                                        <option key={a.DocEntry} value={a.DocEntry.toString()}>
                                            {a.FirstName} {a.LastName}
                                        </option>
                                    ))}
                                </select>
                                <Button onClick={handleAddApprover}>Add</Button>
                            </div>
                        </div>

                        {approvers.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold">Selected Approvers</p>
                                <ul className="list-disc list-inside text-sm">
                                    {approvers.map(a => (
                                        <li key={a.DocEntry}>{a.FirstName} {a.MiddleName} {a.LastName}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Button className="w-full mt-2" onClick={handleAddApproval}>Add Approval</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}


