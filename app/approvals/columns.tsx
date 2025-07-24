'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ApprovalDecision } from '@/types/approval-decision'

export const columns: ColumnDef<ApprovalDecision>[] = [
  {
    accessorKey: 'ApprovalNum',
    header: 'Approval #',
  },
  {
    accessorKey: 'DocNum',
    header: 'Doc #',
  },
  {
    id: 'FullName',
    header: 'Full Name',
    cell: ({ row }) => {
      const { FirstName, MiddleName, LastName } = row.original
      return `${FirstName} ${MiddleName} ${LastName}`
    },
  },
  {
    accessorKey: 'Title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'decision',
    header: 'Decision',
    cell: ({ getValue }) => {
      const value = getValue<number>()
      switch (value) {
        case 1:
          return <Badge variant="success">Accepted</Badge>
        case 2:
          return <Badge variant="destructive">Rejected</Badge>
        default:
          return <Badge variant="outline">Pending</Badge>
      }
    },
  },
]
