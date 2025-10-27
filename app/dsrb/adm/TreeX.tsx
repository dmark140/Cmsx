'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { runQuery } from '@/lib/utils'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

type TreeData = {
    DocEntry: number
    Title: string
    Disc: string
    FinalApprovalStatus: string
    bookingDate: string | null
    EvaluationId: number | null
    acquired_fund: number | null
    confirm_recieveBy: number | null
    Status: string
    CreatedBy: number
    FirstName: string
    LastName: string
    MiddleName: string
}

type ModuleParameter = {
    barangay: string
    endDate: string
    startDate: string
}

export default function TreeX({ barangay, endDate, startDate }: ModuleParameter) {
    const [data, setData] = useState<TreeData[]>([])
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        setLoading(true)
        const result = await runQuery('getTree', [startDate, endDate])
        console.log({ result })
        setData(result.data)
        setLoading(false)
    }

    const steps = [
        { label: 'For booking', key: 'For booking' },
        { label: 'For evaluation', key: 'For evaluation' },
        { label: 'Fund requested to Treasury', key: 'Fund requested to Treasury' },
        { label: 'Fund for entry', key: 'Fund for entry' },
        { label: 'Completed', key: 'Completed' },
    ]

    const getStepIcon = (status: string, step: string) => {
        if (steps.findIndex((s) => s.key === step) < steps.findIndex((s) => s.key === status)) {
            return <CheckCircle className="text-green-500 w-4 h-4" />
        } else if (step === status) {
            return <Clock className="text-blue-500 w-4 h-4" />
        } else {
            return <AlertCircle className="text-gray-400 w-4 h-4" />
        }
    }
    useEffect(() => {
        getData()
    }, [endDate, startDate])


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">Request Relationship Map</div>
                {/* <Button onClick={getData} disabled={loading}>
                    {loading ? 'Loading...' : 'Get Data'}
                </Button> */}
            </div>

            <Accordion type="single" collapsible  className="w-full">
                {data.map((item) => (
                    <AccordionItem
                        key={item.DocEntry}
                        value={`item-${item.DocEntry}`}
                        className="border rounded-lg mb-2"
                    >
                        <AccordionTrigger className="px-4 py-1 hover:bg-primary/10 rounded-t-lg">
                            <div className="flex flex-col items-start w-full">
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-semibold">
                                        {item.Title} #{item.DocEntry}
                                    </span>
                                    <Badge
                                        variant={
                                            item.Status === 'Completed'
                                                ? 'default'
                                                : item.Status === 'Rejected'
                                                    ? 'destructive'
                                                    : 'secondary'
                                        }
                                    >
                                        {item.Status}
                                    </Badge>
                                </div>
                                <span className="text-sm text-gray-500">{item.FinalApprovalStatus}</span>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent>
                            <Card className="p-2 mx-2 space-y-3">
                                {/* Basic Details */}
                                <div className="text-sm text-primary space-y-1.5">
                                    <div>
                                        <strong>Description:</strong> {item.Disc || '—'}
                                    </div>
                                    <div>
                                        <strong>Requested By:</strong>{' '}
                                        {item.FirstName
                                            ? `${item.FirstName} ${item.MiddleName ? item.MiddleName[0] + '.' : ''} ${item.LastName}`
                                            : '—'}
                                    </div>
                                    <div>
                                        <strong>Booking Date:</strong>{' '}
                                        {item.bookingDate
                                            ? new Date(item.bookingDate).toLocaleDateString()
                                            : '—'}
                                    </div>
                                    <div>
                                        <strong>Evaluation ID:</strong> {item.EvaluationId ?? '—'}
                                    </div>
                                    <div>
                                        <strong>Acquired Fund:</strong>{' '}
                                        {item.acquired_fund
                                            ? item.acquired_fund.toLocaleString()
                                            : '—'}
                                    </div>
                                    <div>
                                        <strong>Confirmed Received By:</strong>{' '}
                                        {item.confirm_recieveBy ? 'Yes' : 'No'}
                                    </div>
                                </div>

                                {/* Progress Section */}
                                <div className="border-t pt-3">
                                    <div className="text-sm font-semibold mb-2">Progress:</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {steps.map((step) => (
                                            <div
                                                key={step.key}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${step.key === item.Status
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : steps.findIndex((s) => s.key === step.key) <
                                                        steps.findIndex((s) => s.key === item.Status)
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {getStepIcon(item.Status, step.key)}
                                                {step.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {data.length === 0 && !loading && (
                <div className="text-sm text-gray-500 italic text-center mt-6">
                    No data found.
                </div>
            )}
        </div>
    )
}
