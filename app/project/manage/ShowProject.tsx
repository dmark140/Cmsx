'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export type Project = {
  DocEntry: number
  AddedBy: number
  Title: string
  Disc: string
  createdDate: string
  void: string
  DocNum: number
  type: string
  title: string
  value: string
  createdBy: number
  createdDateRequirement: string
  voidRequirement: string
}

type ShowProjectProps = {
  projectId: number
  DocEntry?: number
  onClose?: () => void
}

export default function ShowProject({ projectId, DocEntry, onClose }: ShowProjectProps) {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProject = async () => {
    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryName: 'getProjecsInFOrm',
          params: [projectId],
        }),
      })

      const result = await res.json()
      setData(result.data || [])
    } catch (err) {
      toast.error('Failed to fetch project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }

  if (!data.length) return <p>No project found for ID {projectId}.</p>

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-1">{data[0].Title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{data[0].Disc}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Close
            </button>
          )}
        </div>

        {data.map((row, idx) => (
          <div className="mb-4" key={idx}>
            <Label className="block mb-1 font-semibold">{row.title}</Label>
            {row.type === 'text' ? (
              <Input placeholder={row.value} />
            ) : row.type === 'file' ? (
              <Input type="file" />
            ) : row.type === 'approval' ? (
              <div className="text-gray-500 italic">Approval required</div>
            ) : (
              <Input placeholder={row.value} />
            )}
          </div>
        ))}
      </Card>
    </div>
  )
}
