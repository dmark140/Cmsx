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
    Clock, 
    Users, 
    FileText 
} from "lucide-react"; 

export default function Layout() {
    const { push } = useGlobalPush()

    const navItems = {
        modules: [
            {
                link: "/audit/timeline",
                name: "Audit Timeline",
                description: "View and manage all key audit activities and milestones.",
                icon: <Clock className="h-7 w-7 text-blue-500" />
            },
            {
                link: "/audit/beneficiaries",
                name: "Beneficiaries Register",
                description: "Manage and verify the list of program beneficiaries.",
                icon: <Users className="h-7 w-7 text-orange-500" />
            },
        ],
        reports: [
            {
                link: "#",
                name: "Evaluation Report",
                description: "Generate comprehensive reports on audit findings and data.",
                icon: <FileText className="h-7 w-7 text-green-500" />,
                disabled: true
            },
        ],
    };

    const NavCard = ({ item }: { item: (typeof navItems.modules)[number] & { disabled?: boolean } }) => (
        <Card 
            className={`transition-all duration-200 h-full ${item.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:shadow-lg hover:border-primary/50 group'
            }`}
            onClick={() => !item.disabled && push(item.link)}
        >
            <CardHeader className='flex flex-row items-center space-x-4 p-4'>
                <div className='flex-shrink-0'>
                    {item.icon}
                </div>
                <div>
                    <CardTitle className={`text-base ${!item.disabled && 'group-hover:text-primary transition-colors'}`}>
                        {item.name}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                        {item.description}
                        {item.disabled && <span className="ml-2 text-xs text-red-500 font-semibold">(Coming Soon)</span>}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    );

    return (
        <div className='p-4 space-y-8'>
            
            <div className='space-y-4'>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Audit Modules
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {navItems.modules.map((item, index) => (
                        <NavCard key={index} item={item} />
                    ))}
                </div>
            </div>
{/* 
            <div className='space-y-4'>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Reporting
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {navItems.reports.map((item, index) => (
                        <NavCard key={index} item={item} />
                    ))}
                </div>
            </div> */}
            
        </div>
    )
}