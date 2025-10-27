import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { ChartBarLabelCustom } from './BarChartx'
import { runQuery } from '@/lib/utils'


import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'


type dataParams = {
    Total: number
    Title: string
}
type ModuleParameter = {
    barangay: string
    endDate: string
    startDate: string
}


export default function Servicesx({ barangay, endDate, startDate }: ModuleParameter) {
    // const chartData = [
    //     { Title: "January", Total: 186, },
    //     { Title: "February", Total: 305, },
    //     { Title: "March", Total: 237, },
    //     { Title: "April", Total: 73, },
    //     { Title: "May", Total: 209, },
    //     { Title: "June", Total: 214, },
    // ]

    const chartConfig = {
        Total: {
            label: "Total",
            color: "var(--chart-2)",
        },
        mobile: {
            label: "Mobile",
            color: "var(--chart-2)",
        },
        label: {
            color: "var(--background)",
        },
    } satisfies ChartConfig



    const [chartData, setdata] = useState<dataParams[]>([])


    const fetchFundData = async () => {
        try {
            const params = [
                startDate,
                endDate,
            ];
            const result = await runQuery('getCountPerService', params);
            console.log({ params })
            console.log('Fund Summary Result:', result)
            setdata(result.data ?? null)
        } catch (error) {
            console.error('Error fetching fund summary:', error)
        } finally {
        }
    }

    useEffect(() => {
        fetchFundData()
    }, [barangay, endDate, startDate])


    return (
        <div>
            <div className='text-xl font-semibold'>Services</div>
            {/* <Button></Button> */}

            <div className='grid grid-cols-2'>
                <ChartContainer config={chartConfig} >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={true} />
                        <YAxis
                            dataKey="Title"
                            type="category"
                            tickLine={false}
                            tickMargin={4}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 1)}
                            hide
                        />
                        <XAxis dataKey="Total" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="Total"
                            layout="vertical"
                            fill="var(--color-Total)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="Title"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="Total"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>

                <div >
                    <Table>
                        <TableCaption>A list of your used services base on the parameter.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Usage Count</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chartData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.Title}</TableCell>
                                    <TableCell>{item.Total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}



