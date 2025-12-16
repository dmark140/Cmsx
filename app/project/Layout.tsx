import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import { toast } from 'sonner'
import { 
    FilePlus2, 
    Files, 
    ListChecks
} from "lucide-react"; 

export default function Layout() {
    const { push } = useGlobalPush()

    const modules = [
        {
            link: "project/create",
            name: "Create Forms",
            description: "Start a new project documentation",
            icon: <FilePlus2 className="h-8 w-8 text-blue-500 mb-2" />
        }, 
        {
            link: "project/manage",
            name: "Manage Forms",
            description: "Edit and view existing records",
            icon: <Files className="h-8 w-8 text-orange-500 mb-2" />
        },
    ]

    const managements = [
        {
            link: "project/listmng",
            name: "Selection List",
            description: "Manage dropdown data sources",
            icon: <ListChecks className="h-8 w-8 text-green-500 mb-2" />
        },
    ]

    const NavCard = ({ item, withToast }: { item: any, withToast?: boolean }) => (
        <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 group"
            onClick={() => {
                if(withToast) toast(`Routing to ${item.name}`);
                push(item.link);
            }}
        >
            <CardHeader>
                <div className="flex justify-between items-start">
                    {item.icon}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                    {item.name}
                </CardTitle>
                <CardDescription>
                    {item.description}
                </CardDescription>
            </CardHeader>
        </Card>
    );

    return (
        <div className="p-4 space-y-8">
            
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Modules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {modules.map((item, index) => (
                        <NavCard key={index} item={item} withToast={true} />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Fields & Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {managements.map((item, index) => (
                         <NavCard key={index} item={item} />
                    ))}
                </div>
            </div>

        </div>
    )
}