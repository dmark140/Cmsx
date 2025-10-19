'use client'
import { runQuery } from '@/lib/utils';
import React, { useEffect, useState } from 'react'


interface ApprovalId {
    docEntry: number;
}
type names = {
    FirstName?: string,
    MiddleName?: string,
    LastName?: string
}
export default function Approvers({ docEntry }: ApprovalId) {

    const [approvers, setapprovers] = useState<names[]>([])
    const getApprovers = async () => {
        const data = await runQuery("getApprovers", [docEntry])
        setapprovers(data.data)
    }

    useEffect(() => {
        getApprovers()
    }, [])

    return (
        <div>
            <p className="font-bold">Approvers</p>
            <ul className="list-disc list-inside text-sm">
                {approvers.map((a, i) => (
                    <li key={i}>{`${a.FirstName} ${a.LastName}`}</li>
                ))}
            </ul>
            {/* <button onClick={() => console.log({ approvers })}>test</button> */}
        </div>
    )
}
