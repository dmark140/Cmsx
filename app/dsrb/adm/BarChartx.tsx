"use client"


import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"


type dataParams = {
    countx: number
    Title: number
}

export const description = "A bar chart with a custom label"

const chartData = [
    { month: "January", desktop: 186, },
    { month: "February", desktop: 305, },
    { month: "March", desktop: 237, },
    { month: "April", desktop: 73, },
    { month: "May", desktop: 209, },
    { month: "June", desktop: 214, },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
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

export function ChartBarLabelCustom() {

    const [data, setdata] = useState<dataParams[]>([])
    
    useEffect(() => {
    }, [])
    
    return (

        <ChartContainer config={chartConfig} className="w-[75%]">
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
                    dataKey="month"
                    type="category"
                    tickLine={false}
                    tickMargin={4}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 1)}
                    hide
                />
                <XAxis dataKey="desktop" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                    dataKey="desktop"
                    layout="vertical"
                    fill="var(--color-desktop)"
                    radius={4}
                >
                    <LabelList
                        dataKey="month"
                        position="insideLeft"
                        offset={8}
                        className="fill-(--color-label)"
                        fontSize={12}
                    />
                    <LabelList
                        dataKey="desktop"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}
