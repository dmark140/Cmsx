'use client'
import { Button } from '@/components/ui/button'
import { runQuery } from '@/lib/utils'
import React, { useLayoutEffect, useState } from 'react'
import { DataTable } from './data-table'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
type formParam = {
    DocEntry: number
    dataNumber: number
    projectDataId: number
}

type cols = {
    label: number
    Requirements_id: number
    DocNum: number
}


type rows = {
    DocNum: number
    Requirements_id: number
    iValue: string
    LineID: string
}
export default function FormDialogTable({ DocEntry, dataNumber, projectDataId }: formParam) {
    const [cols, setcols] = useState<cols[]>([])
    const [rows, setrows] = useState<rows[]>([])
    const [loading, setloading] = useState(false)

    const getTableHeader = async () => {
        try {
            const cols = await runQuery("getvwproject_table_label", [DocEntry])
            console.log({ cols })
            setcols(cols.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getTableRows = async () => {
        setloading(true)
        try {
            const rows = await runQuery("getprojects_data_c_table", [DocEntry, projectDataId])
            console.log({ rows })
            setrows(rows.data)
        } catch (error) {
            console.log(error)
        }
        setloading(false)

    }

    useLayoutEffect(() => {
        getTableHeader()
        getTableRows()
    }, [projectDataId])

    return (
        <div className='overflow-auto'>
            {/* <DataTable columns={cols} data={cols} /> */}
            <Table>
                {/* <TableCaption>End of List</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        {cols.map((item, i) => (
                            <TableHead key={i}>{item?.label}</TableHead>
                        )
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...new Set(rows.map(row => row.LineID))].map((lineId) => (
                        <TableRow key={lineId}>
                            {cols.map((col, i) => {
                                const matchedRow = rows.find(
                                    row => row.LineID === lineId && row.Requirements_id === col.DocNum
                                )
                                return (
                                    <TableCell key={i}>
                                        {matchedRow?.iValue || ''}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
            {loading ? <p className='text-center text-muted-foreground'>Loading...</p> : ""}

            {/* <Button onClick={() => { console.log({ DocEntry, projectDataId }); getTableRows() }}> test</Button> */}
        </div>
    )
}
