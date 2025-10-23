'use client'
import { Button } from '@/components/ui/button'
import { runQuery } from '@/lib/utils'
import React, { useLayoutEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type formParam = {
    DocEntry: number
    dataNumber: number
    projectDataId: number
}

type cols = {
    label: string
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
            const cols = await runQuery('getvwproject_table_label', [DocEntry])
            console.log({ cols })
            setcols(cols.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTableRows = async () => {
        setloading(true)
        try {
            const rows = await runQuery('getprojects_data_c_table', [DocEntry, projectDataId])
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
        <div className="w-full">
            <table className="w-full  text-xs border-collapse">
                <thead>
                    <tr className="">
                        {cols.map((item, i) => (
                            <th key={i} className="p-1 font-semibold text-center">
                                {item?.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...new Set(rows.map(row => row.LineID))].map(lineId => (
                        <tr key={lineId}>
                            {cols.map((col, i) => {
                                const matchedRow = rows.find(
                                    row => row.LineID === lineId && row.Requirements_id === col.DocNum
                                )
                                return (
                                    <td key={i} className="p-1 text-center">
                                        {matchedRow?.iValue || ''}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>


            {loading && (
                <p className="text-center text-muted-foreground mt-2">Loading...</p>
            )}
        </div>
    )
}
