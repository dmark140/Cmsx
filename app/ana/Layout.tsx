'use client'
import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import { 
    CalendarCheck, 
    ClipboardCheck, 
    FileText 
} from "lucide-react"; // Make sure you install lucide-react

export default function Layout() {
    const { push } = useGlobalPush()

    // 1. Group all navigation data into a single, comprehensive structure
    const navItems = {
        modules: [
            {
                link: "/booking",
                name: "Appointment Booking",
                description: "Schedule and manage client appointments.",
                icon: <CalendarCheck className="h-7 w-7 text-blue-500" />
            },
            {
                link: "/booking/apnmt",
                name: "Evaluation Management",
                description: "Record and review assessment data for appointments.",
                icon: <ClipboardCheck className="h-7 w-7 text-orange-500" />
            },
        ],
        reports: [
            {
                link: "/booking/apnmt/eval/print",
                name: "Evaluation Report",
                description: "Generate and print detailed evaluation summaries.",
                icon: <FileText className="h-7 w-7 text-green-500" />
            },
        ],
    };

    // 2. Reusable Card component for clean rendering
    const NavCard = ({ item }: { item: (typeof navItems.modules)[number] }) => (
        <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 group h-full"
            onClick={() => push(item.link)}
        >
            <CardHeader className='flex flex-row items-center space-x-4 p-4'>
                <div className='flex-shrink-0'>
                    {item.icon}
                </div>
                <div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {item.name}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                        {item.description}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    );

    return (
        <div className='p-4 space-y-8 max-w-2xl'>
            
            {/* ------------------- Section: Modules ------------------- */}
            <div className='space-y-4'>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Appointment & Evaluation Modules
                </h2>
                {/* Responsive Grid: 1 column on mobile, 2 on desktop */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {navItems.modules.map((item, index) => (
                        <NavCard key={index} item={item} />
                    ))}
                </div>
            </div>

            {/* ------------------- Section: Reports ------------------- */}
            <div className='space-y-4'>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Reporting
                </h2>
                {/* Reports can be in their own row or follow the same grid pattern */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {navItems.reports.map((item, index) => (
                        <NavCard key={index} item={item} />
                    ))}
                </div>
            </div>
            
        </div>
    )
}