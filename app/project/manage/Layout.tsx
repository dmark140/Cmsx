'use client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Waiting from './Waiting';
import ShowProject from './ShowProject';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { limitText } from '@/lib/utils';
import { useGlobalPush } from '@/lib/router/useGlobalPush';

type Project = {
    DocEntry: number;
    Title: string;
    Disc: string;
    void: number;
};

export default function Layout() {
    const { push } = useGlobalPush()
    const { setFormIdRequested } = useGlobalContext()

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [DocEntryToShow, setDocEntryToShow] = useState<number>(0)
    const [projects, setProjects] = useState<Project[]>([])
    const setVoid = async (docEntry: number, voidStatus: number) => {
        toast(voidStatus + " - " + docEntry)
        try {
            setLoading(true);
            const res = await fetch("/api/sql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    queryName: "setProjectVoid",
                    params: [voidStatus, docEntry],
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast("Project status updated successfully.");
                GetProjects(); // Refresh the project list
            } else {
                console.error("Error updating project status:", data);
                toast("Error updating project status: " + data.message);
            }
        } catch (error) {
            toast("An error occurred while updating project status." + error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    const GetProjects = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/sql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    queryName: "getProjects",
                    params: [],
                }),
            });

            const data: { data: Project[] } = await res.json();
            if (res.ok) {
                setProjects(data.data)
            } else {
                console.error("Error fetching projects:", data);
            }
        } catch (error) {
            toast("An error occurred while fetching projects." + error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetProjects();
    }, [])

    return (
        <div>
            {loading ? <Waiting rows={6} columns={5} /> : <>

                <Table>
                    <TableCaption>A list of all projects</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Option</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.DocEntry}>
                                <TableCell className="font-medium">{project.DocEntry}</TableCell>
                                <TableCell>{project.Title}</TableCell>
                                <TableCell className='text-xs'>{limitText(project.Disc, 50)}</TableCell>
                                <TableCell>{project.void === 1 ? "Active" : "Inactive"}</TableCell>
                                {/* <TableCell className="text-right ">
                                    <Button className='h-fit p-1 m-0 '
                                        onClick={() => setVoid(project.DocEntry, project.void === 1 ? 0 : 1)}
                                        variant={project.void === 1 ? "destructive" : "ghost"}>{project.void !== 1 ? "Active" : "Inactive"}</Button>
                                    <Button onClick={() => {
                                        setOpen(true)
                                        setDocEntryToShow(project.DocEntry)
                                    }} className='h-fit p-1 m-0 mx-2'>Show</Button>
                                    <Button className='h-fit p-1 m-0'>
                                        Manage Approval
                                    </Button>
                                </TableCell> */}


                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setVoid(project.DocEntry, project.void ? 0 : 1)}>
                                                {project.void ? 'Set Inactive' : 'Set Active'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setOpen(true); setDocEntryToShow(project.DocEntry) }}>
                                                Show
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setFormIdRequested(project.DocEntry);
                                                push('manage/approval');
                                            }}
                                            >
                                                Manage Approval
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table></>}

            <Drawer open={open} onOpenChange={setOpen}>
                {/* <DrawerTrigger asChild>
                    <Button variant="outline">Form Preview</Button>
                </DrawerTrigger> */}
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Form Preview</DrawerTitle>
                    </DrawerHeader>
                    <div className='overflow-y-auto mb-4'>
                        <ShowProject projectId={DocEntryToShow} />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
