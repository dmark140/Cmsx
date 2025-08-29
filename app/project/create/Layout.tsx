'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useLayoutEffect, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useGlobalContext } from '@/context/GlobalContext'
import { generateFormattedNumber, runQuery } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useGlobalPush } from '@/lib/router/useGlobalPush'

type ColumnType = 'text' | 'date' | 'number' | 'dropdown'

type TableColumn = {
    id: number
    label: string
    type: ColumnType
    valueOptions?: SelectionListHeader[]
    value?: string
}

type FormItem = {
    id: number
    type: 'text' | 'file' | 'approval' | 'selection' | 'table'
    label: string
    title: string
    placeholder?: string
    required: boolean
    value?: string | null
    size?: number
    columns?: TableColumn[]
}

type AdminList = {
    DocEntry: number
    FirstName: string
    MiddleName: string
    LastName: string
}
type SelectionListHeader = {
    DocEntry: number
    Code: string
    Name: string
}

export default function Layout() {
    const { ID } = useGlobalContext();
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [AddedForms, setAddedForms] = useState<FormItem[]>([])
    const [SelectionList, setSelectionList] = useState<SelectionListHeader[]>([])
    const [AdminList, setAdminList] = useState<AdminList[]>([])
    const [SelectionListSources, setSelectionListSources] = useState<SelectionListHeader[]>([])
    const [nextId, setNextId] = useState(1)
    const [nextColId, setNextColId] = useState(1)
    const [Loading, setLoading] = useState(false)
    const { push } = useGlobalPush()

    const addFormField = (type: FormItem['type']) => {
        if (AddedForms.length !== 0) {
            const last = AddedForms[AddedForms.length - 1]
            if (!last.value && last.type !== 'table') {
                toast.error('Please complete the previous item.')
                return
            }
        }

        const newField: FormItem = {
            id: nextId,
            type,
            label: type === 'text' ? 'Text Input'
                : type === 'file' ? 'File Upload'
                    : type === 'approval' ? 'Approval'
                        : type === 'selection' ? 'Selection List'
                            : 'Table',
            title: '',
            placeholder: type === 'text' ? 'Enter text here' : '',
            required: false,
            value: type === 'file' ? '.pdf' : '',
            size: type === 'file' ? 10 : undefined,
            columns: type === 'table' ? [] : undefined,
        }
        setAddedForms(prev => [...prev, newField])
        setNextId(prev => prev + 1)
    }

    const handleValueChange = (id: number, value: string | null) => {
        setAddedForms(prev => prev.map(item => (item.id === id ? { ...item, value } : item)))
    }

    const handleSizeChange = (id: number, size: number) => {
        setAddedForms(prev => prev.map(item => (item.id === id ? { ...item, size } : item)))
    }

    const handleTitleChange = (id: number, title: string) => {
        setAddedForms(prev => prev.map(item => (item.id === id ? { ...item, title } : item)))
    }

    const handleRemove = (id: number) => {
        setAddedForms(prev => prev.filter(item => item.id !== id))
    }

    const addTableColumn = (formId: number) => {
        setAddedForms(prev => prev.map(item =>
            item.id === formId ? {
                ...item,
                columns: [...(item.columns ?? []), {
                    id: nextColId,
                    label: '',
                    type: 'text'
                }]
            } : item
        ))
        setNextColId(prev => prev + 1)
    }

    const updateTableColumns = (formId: number, columns: TableColumn[]) => {
        console.log({ formId, columns })
        setAddedForms(prev => prev.map(item =>
            item.id === formId ? { ...item, columns } : item
        ))
    }

    const removeTableColumn = (formId: number, colId: number) => {
        setAddedForms(prev => prev.map(item =>
            item.id === formId ? {
                ...item,
                columns: item.columns?.filter(c => c.id !== colId)
            } : item
        ))
    }

    const handlePublish = async () => {
        setLoading(true)
        if (AddedForms.length === 0) return toast.error('Please add at least one form item.')
        const last = AddedForms[AddedForms.length - 1]
        if (!last.value && last.type !== 'table') return toast.error('Please complete the last item.')

        try {
            const res = await fetch("/api/sql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    queryName: "insertProject",
                    params: [ID, formTitle, formDescription],
                }),
            });
            const data = await res.json();
            const id = data?.insertId;

            if (res.ok) {
                toast("Module Created");
                for (const item of AddedForms) {
                    const dt = await fetch("/api/sql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            queryName: "insertProjectRequirement",
                            params: [id, item.type, item.title, item.value, ID, item.id],
                        }),
                    });
                    const insertedIDdata = await dt.json();
                    const insertedIDid = insertedIDdata?.insertId;
                    if (item.type === 'table') {
                        for (const col of item.columns ?? []) {
                            await fetch("/api/sql", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    queryName: "insertTableColumn",
                                    params: [insertedIDid, col.id, col.label, col.type],
                                }),
                            });
                        }
                    }
                }
                id
                const number = generateFormattedNumber(3, id, 7)
                const addChartOfAccount = await runQuery("insert_chart_of_accounts", [number, formTitle, ID, "Project - Expenses"])
                push('./manage')
            } else {
                toast(data.message || "Error")
            }
        } catch (err) {
            toast("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const getAdmins = async () => {
        const res2 = await fetch("/api/sql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ queryName: "getAdmins", params: [] }),
        });
        const data2 = await res2.json();
        if (res2.ok) setAdminList(data2.data || [])
    }

    const getSelectionListHeader = async () => {
        try {
            const listOfSelectionHeader = await runQuery("getSelectionHeaderVoid1", [])
            setSelectionList(listOfSelectionHeader?.data ?? [])

            const sourceLists = await runQuery("getselectionlist", [])
            setSelectionListSources(sourceLists?.data ?? [])
        } catch (error) {
            toast("" + error)
        }
    }

    const fileFormats = ['.pdf', '.docx', '.xlsx', '.pptx', '.txt']
    const inputFormats = ['Text', 'Date', 'Yes or No', 'Number', 'Month', 'Year', 'Password', 'Email']

    useLayoutEffect(() => {
        getAdmins()
        getSelectionListHeader()
    }, [])

    return (
        <div className="w-full max-w-[720px] mx-auto grid gap-2">
            <Card className="w-full px-2 py-2">
                <Input placeholder="Untitled form" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
                <Input placeholder="Form Description" className="mt-2" value={formDescription} onChange={e => setFormDescription(e.target.value)} />
            </Card>

            {AddedForms.map(item => (
                <Card className="w-full px-2 py-2" key={item.id}>
                    <div className="flex items-center justify-between ">
                        <label className="font-semibold block ">{item.label}</label>
                        <Button size="icon" variant="outline" onClick={() => handleRemove(item.id)}>
                            <X className="w-2 h-2 text-red-500" />
                        </Button>
                    </div>
                    <Input className="" placeholder="Enter title" value={item.title} onChange={e => handleTitleChange(item.id, e.target.value)} />

                    <div className="flex flex-col gap-1">
                        {item.type === 'text' && (
                            <select className="w-full border rounded p-2" value={item.value ?? ''} onChange={e => handleValueChange(item.id, e.target.value)}>
                                <option className='bg-background' value="">Select Input type</option>
                                {inputFormats.map(format => (
                                    <option className='bg-background' key={format} value={format}>{format}</option>
                                ))}
                            </select>
                        )}

                        {item.type === 'file' && (
                            <>
                                <select className="hidden w-full border rounded p-2" value={item.value ?? ''} onChange={e => handleValueChange(item.id, e.target.value)}>
                                    {fileFormats.map(format => (
                                        <option key={format} value={format}>{format.toUpperCase()}</option>
                                    ))}
                                </select>
                                <Input className='hidden' type="number" placeholder="Max File Size (MB)" value={item.size ?? ''} onChange={e => handleSizeChange(item.id, parseInt(e.target.value) || 0)} />
                                {/* <p className='text-muted-foreground text-xs'>Max File Size (MB)</p> */}
                            </>
                        )}

                        {item.type === 'approval' && (
                            <select className="w-full border rounded p-2" value={item.value ?? ''} onChange={e => handleValueChange(item.id, e.target.value)}>
                                <option value="">Select Admin</option>
                                {AdminList.map((admin, i) => (
                                    <option key={i} value={admin.DocEntry}>{admin.DocEntry} {admin.FirstName} {admin.LastName}</option>
                                ))}
                            </select>
                        )}

                        {item.type === 'selection' && (
                            <select className="w-full border rounded p-2" value={item.value ?? ''} onChange={e => handleValueChange(item.id, e.target.value)}>
                                <option className='bg-background' value="">Select from List</option>
                                {SelectionList.map((sel, i) => (
                                    <option className='bg-background' key={i} value={sel.DocEntry}>{sel.DocEntry} - {sel.Code}</option>
                                ))}
                            </select>
                        )}

                        {item.type === 'table' && (
                            <div className="flex flex-col gap-2">
                                {item.columns?.map(col => (
                                    <div key={col.id} className="flex gap-2 items-center">
                                        {col.type === 'dropdown' ? (
                                            <select value={col.label} onChange={e => {
                                                const newCols = item.columns!.map(c => c.id === col.id ? { ...c, label: e.target.value } : c)
                                                console.log({ col })
                                                updateTableColumns(item.id, newCols)
                                            }}>
                                                <option className='bg-background' value="">Select Dropdown Source</option>
                                                {SelectionListSources.map((source) => (
                                                    <option className='bg-background' key={source.DocEntry} value={source.DocEntry}>{source.Name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <Input placeholder="Column Label" value={col.label} onChange={e => {
                                                const newCols = item.columns!.map(c => c.id === col.id ? { ...c, label: e.target.value } : c)
                                                updateTableColumns(item.id, newCols)
                                            }} />
                                        )}

                                        <select className="ml-auto" value={col.type} onChange={e => {
                                            const newCols = item.columns!.map(c => c.id === col.id ? { ...c, type: e.target.value as ColumnType } : c)
                                            updateTableColumns(item.id, newCols)
                                        }}>
                                            <option className='bg-background' value="text">Text</option>
                                            <option className='bg-background' value="date">Date</option>
                                            <option className='bg-background' value="number">Number</option>
                                            <option className='bg-background' value="dropdown">Dropdown</option>
                                        </select>


                                        <Button variant="destructive" onClick={() => removeTableColumn(item.id, col.id)}>Remove</Button>
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => addTableColumn(item.id)}>Add Column</Button>
                            </div>
                        )}
                    </div>
                </Card>
            ))}
            {/* <Card className="px-2 py-2">
                <div className="grid grid-cols-1 sm:flex gap-2 items-center">
                    <select
                        className="w-full sm:w-fit border rounded px-2 py-2"
                        defaultValue=""
                        onChange={(e) => {
                            const value = e.target.value as FormItem['type']
                            if (value) {
                                addFormField(value)
                                e.target.value = ''  
                            }
                        }}
                    >
                        <option  className='bg-background' value="" disabled>
                            ➕ Add Field Type
                        </option>
                        <option  className='bg-background' value="text">Text Input</option>
                        <option  className='bg-background' value="file">File Upload</option>
                        <option  className='bg-background' value="selection">Selection List</option>
                        <option  className='bg-background' value="approval">Approval</option>  
                        <option  className='bg-background' value="table">Table</option>
                    </select>

                    <div className="flex-1" /> 

                    <Button
                        className="w-full sm:w-fit mt-2 sm:mt-0 float-right"
                        onClick={handlePublish}
                    >
                        Publish
                    </Button>
                </div>
            </Card> */}

            <Card className="px-2 py-2">
                <p> ➕ Add Field Type </p>
                <div className="grid grid-cols-1 sm:flex gap-2">
                    <Button className=" p-0 m-0 px-1 w-full sm:w-fit" variant="outline" onClick={() => addFormField('text')}> Input</Button>
                    <Button className=" p-0 m-0 px-1 w-full sm:w-fit" variant="outline" onClick={() => addFormField('file')}> File Upload</Button>
                    <Button className=" p-0 m-0 px-1 w-full sm:w-fit" variant="outline" onClick={() => addFormField('selection')}> Selection List</Button>
                    {/* <Button className=" p-0 m-0 px-1 w-full sm:w-fit" variant="outline" onClick={() => addFormField('approval')}> Approval</Button> */}
                    <Button className=" p-0 m-0 px-1 w-full sm:w-fit" variant="outline" onClick={() => addFormField('table')}> Table</Button>
                    <Button className="w-full mt-2 sm:mt-0 sm:w-fit float-right ml-auto" onClick={handlePublish} disabled={Loading}>
                        {Loading ? "Loading" : "Publish"}
                    </Button>
                </div>
            </Card>

        </div>
    )
}
