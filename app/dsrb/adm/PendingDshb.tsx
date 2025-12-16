'use client'
import { Button } from '@/components/ui/button'
import { runQuery } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type FundSummary = {
    Pending: number
    overAll: number
    barangay: string
}

type ModuleParameter = {
    barangay: string
    endDate: string
    startDate: string
}

export default function PendingDshb({ barangay, endDate, startDate }: ModuleParameter) {
    const route = useRouter()
    const [fundsData, setFundsData] = useState<FundSummary | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchFundData = async () => {
        try {
            const params = [
                startDate,
                endDate,
            ];
            const result = await runQuery('getApprovalForDashBoard', params);
            console.log({ params })
            console.log('Fund Summary Result:', result)
            setFundsData(result.data[0] ?? null)
        } catch (error) {
            console.error('Error fetching fund summary:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        fetchFundData()
    }, [barangay, endDate, startDate])

    useEffect(() => {

        route.prefetch("/fe/se")
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (!fundsData) {
        return <>
            {/* <Button onClick={fetchFundData}>check fetchFundData</Button> */}
            <p>No fund data available.</p>
        </>
    }

    return (
        <div className='shadow'>
            <div className="flex gap-4 border border-primary p-3 rounded-md">
                <div className="p-3">
                    <p className="font-bold text-lg text-primary">Total OverAll Request</p>
                    <p className="font-bold">P {fundsData.overAll | 0}</p>
                    {/* <Button onClick={() => route.push("/fe/se")} className="float-right mt-2">View all</Button> */}
                </div>
                <div className="p-3 border-l border-primary">
                    <p className="font-bold text-lg text-primary">Total Pending</p>
                    <p className="font-bold">P {fundsData.Pending | 0}</p>
                    {/* <Button onClick={() => route.push("/fe/se")} className="float-right mt-2">View all</Button> */}
                </div>
            </div>
        </div>
    )
}
