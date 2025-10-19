'use client'

import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import React, { useLayoutEffect, useState } from 'react'
import { toast } from 'sonner';
import { useGlobalContext } from '@/context/GlobalContext'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { limitText, runQuery } from '@/lib/utils'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
type Project = {
  DocEntry: number;
  Title: string;
  Disc: string;
  createdDate: Date;
  void: number;
};



function normalizeProjectsResponse(data: any): Project[] {
  // Handle structure: { data: [ [ {...} ], {...meta...} ] }
  const raw = data?.data?.[0];

  if (Array.isArray(raw)) {
    // already an array of Project
    return raw as Project[];
  }

  if (raw && typeof raw === "object") {
    // single project object
    return [raw as Project];
  }

  return []; // fallback if no valid data
}

export default function Layout() {
  const { push } = useGlobalPush()

  const { setFormIdRequested, ID } = useGlobalContext();
  const [Loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])



  function NormalizeProjectsResponse(data: any): Project[] {
    const raw = data?.data?.[0];
    if (Array.isArray(raw)) {
      return raw as Project[];
    }
    if (raw && typeof raw === "object") {
      return [raw as Project];
    }
    return [];
  }


  const GetProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryName: "getProjecsVoidwID",
          params: [ID],
        }),
      });
      // const res = await runQuery("getProjecsVoid1", [ID])
      // const data: { data: Project[] } = await res.json();
      const data = await res.json();
      console.log({ data })
      if (res.ok) {
        // setProjects(data.data[0])
        const projects = normalizeProjectsResponse(data);
        console.log({ projects })
        setProjects(projects);


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

  useLayoutEffect(() => {
    setFormIdRequested(0);
    GetProjects();
  }, [])

  return (
    <>
      <Table>
        <TableBody>
          {projects.map((item, index) => (
            <TableRow key={index} suppressHydrationWarning >
              <TableCell>
                <div className='mb-2 cursor-pointer' onClick={() => {
                  setFormIdRequested(item.DocEntry);
                  item.DocEntry === 1 ? push("request/create_u") : push("request/create")
                }
                }>
                  <p className='font-semibold   text-blue-600'> {limitText(item.Title, 80)}</p>
                  {/* <p className='text-foreground'> {limitText(item.Disc, 80)}</p> */}
                  <p className='text-foreground'> {item.Disc}</p>
                  <p className='text-xs text-white/30 '>Last updated {formatDistanceToNow(new Date(item.createdDate), { addSuffix: true })}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className='text-center text-muted-foreground'>
        {projects?.length <= 0 && "*No record found*"}
      </p>

    </>
  )
}
