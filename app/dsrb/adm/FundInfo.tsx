'use client'
import { Button } from '@/components/ui/button'
import { runQuery } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type FundSummary = {
    receivedFunds: number
    unreceivedFund: number
    barangay: string
}

type ModuleParameter = {
    barangay: string
    endDate: string
    startDate: string
}

export default function FundInfo({ barangay, endDate, startDate }: ModuleParameter) {
    const route = useRouter()
    const [fundsData, setFundsData] = useState<FundSummary | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchFundData = async () => {
        try {

            const params = [
                barangay,
                barangay,
                barangay,
                startDate,
                endDate,
                barangay,

            ];

            const result = await runQuery('getFundSummary', params);
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
        <div>
            <div className="flex gap-4 border border-primary p-3 rounded-md">
                <div className="p-3">
                    <p className="font-bold text-lg text-primary">Total Released</p>
                    <p className="font-bold">P {fundsData.receivedFunds | 0}</p>
                    {/* <Button onClick={() => route.push("/fe/se")} className="float-right mt-2">View all</Button> */}
                </div>
                <div className="p-3 border-l border-primary">
                    <p className="font-bold text-lg text-primary">Total Un-Released</p>
                    <p className="font-bold">P {fundsData.unreceivedFund | 0}</p>
                    {/* <Button onClick={() => route.push("/fe/se")} className="float-right mt-2">View all</Button> */}
                </div>
            </div>
        </div>
    )
}
