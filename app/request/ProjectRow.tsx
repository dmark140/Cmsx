// app/request/ProjectRow.tsx (Client Component)
'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { useGlobalContext } from '@/context/GlobalContext'
import { useGlobalPush } from '@/lib/router/useGlobalPush'
import { limitText } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

type Project = {
  DocEntry: number;
  Title: string;
  Disc: string;
  createdDate: string;
  void: number;
};

export default function ProjectRow({ item }: { item: Project }) {
  const { setFormIdRequested } = useGlobalContext();
  const { push } = useGlobalPush();

  return (
    <TableRow suppressHydrationWarning>
      <TableCell>
        <div
          className="mb-2 cursor-pointer"
          onClick={() => {
            setFormIdRequested(item.DocEntry);
            item.DocEntry === 1 ? push("request/create_u") : push("request/create");
          }}
        >
          <p className="font-semibold text-blue-600">{limitText(item.Title, 80)}</p>
          <p className="text-foreground">{limitText(item.Disc, 80)}</p>
          <p className="text-xs text-muted">
            Last updated{" "}
            {formatDistanceToNow(new Date(item.createdDate), { addSuffix: true })}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
