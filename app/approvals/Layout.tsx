'use client'

import { useLayoutEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { canProceed, onlyDate, runQuery } from '@/lib/utils'
import FormDialog from './FormDialog'
import { useGlobalContext } from '@/context/GlobalContext'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowBigLeft, ArrowBigRight, ArrowLeft, ArrowLeftRight, ArrowRight } from 'lucide-react'
import { Pagination } from '@/lib/pagination'
import FormDialogUser from './FormDialogUser'

type ApprovalDecision = {
  ApprovalNum: number
  DocNum: number
  ApprovalApproverID: number
  FirstName: string
  LastName: string
  MiddleName: string
  Title: string
  description: string
  decision: number
  project_id: number
  createdDate: Date
  FinalApprovalStatus: string
  CreatedBy?: number
}

export default function Layout() {
  const [page, setPage] = useState(1);
  const [MaxPage, setMaxPage] = useState(1);
  const { ID } = useGlobalContext()
  const [data, setData] = useState<ApprovalDecision[]>([])
  const [fromDate, setfromDate] = useState('');
  const [ToDate, setToDate] = useState('');
  const [paramMyPending, setparamApproved] = useState(true)
  const [StatusParam, setStatusParam] = useState("Pending")
  const [checkedItems, setCheckedItems] = useState<{ ApprovalNum: number, DocNum: number }[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const getData = async (iPage?: number) => {
    const valid = canProceed(StatusParam, fromDate, ToDate);
    if (!valid) return

    try {
      const paramMyPendingx = paramMyPending ? 1 : 0
      const res = await runQuery('getForApproval',
        [paramMyPendingx, paramMyPendingx, StatusParam, StatusParam, fromDate, ToDate],
        {
          paginate: true,
          page: page,
          limit: 9
        }
      )
      console.log({ res })
      if (res.data?.length > 0) {
        setPage(res.pagination?.page ?? 1);
        setMaxPage(res.pagination?.totalPages ?? 1);
        setData(res.data);
      } else {
        toast('No Record Found');
      }

    } catch (error) {
      console.error(error)
      toast('Failed to load data')
    }
  }

  const getDatawithPage = async (iPage?: number) => {
    const valid = canProceed(StatusParam, fromDate, ToDate);
    if (!valid) return

    try {
      const paramMyPendingx = paramMyPending ? 1 : 0
      const res = await runQuery('getForApproval',
        [paramMyPendingx, paramMyPendingx, StatusParam, StatusParam, fromDate, ToDate],
        {
          paginate: true,
          page: iPage,
          limit: 9
        }
      )
      if (res.data?.length > 0) {
        setPage(res.pagination?.page ?? 1);
        setMaxPage(res.pagination?.totalPages ?? 1);
        setData(res.data);
      } else {
        toast('No Record Found');
      }

    } catch (error) {
      console.error(error)
      toast('Failed to load data')
    }
  }

  const globalUpdate = async (state: number) => {
    if (checkedItems.length === 0 || isUpdating) return;
    setIsUpdating(true)
    try {
      await Promise.all(
        checkedItems.map(item =>
          setApprovalState(state, item.ApprovalNum)
        )
      );
      setCheckedItems([]);
      await getData();
      toast.success(`Successfully updated ${checkedItems.length} item(s)`);
    } catch (error) {
      toast.error('Global update failed');
      console.error(error);
    } finally {
      setIsUpdating(false)
    }
  };

  const setApprovalState = async (state: Number, iDocEntry: number, project_id?: number, DocNum?: number, Title?: string, requestedBy?: number) => {
    try {

      console.log({ state, iDocEntry, project_id, DocNum })
      await runQuery("setApprovalState", [state, iDocEntry])
      let msg =
        state == 1 ? "Approved please wait for you appointment, thank you" :
          state == 2 ? "Rejected" :
            state == 3 ? "Pending" : ""

      if (project_id == 1) await runQuery("setOusrVoid1", [DocNum])
      if (requestedBy != null)
        await runQuery("insertNotif", [ID, requestedBy, Title, Title + " " + msg])

    } catch (erro) {
      console.error(erro)
    }
  }

  const setDatesToTodayAndEndOfMonth = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate() - 1).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const lastDay = new Date(yyyy, today.getMonth() + 1, 0);
    const lastDD = String(lastDay.getDate()).padStart(2, '0');
    const formattedEndOfMonth = `${yyyy}-${mm}-${lastDD}`;
    setfromDate(formattedToday);
    setToDate(formattedEndOfMonth);
  };

  const setDatas = async () => {
    await setDatesToTodayAndEndOfMonth();
    await getData()
  }

  useLayoutEffect(() => {
    setDatas()
  }, [])

  useLayoutEffect(() => {
    setData([])
    setMaxPage(1)
    setPage(1)
    getData()
  }, [paramMyPending, StatusParam, fromDate, ToDate])

  return (
    <div className="">
      {/* parameters */}
      <div className='sm:flex gap-4 mb-2'>
        <div className=' flex gap-4 items-center'>
          <Checkbox onCheckedChange={(checked) => setparamApproved(!!checked)} checked={paramMyPending} />
          <p>My Approvals</p>
        </div>
        <div className='flex gap-4 sm:border-l  mt-4 sm:mt-0 sm:pl-4'>
          <RadioGroup defaultValue="Pending" className='flex'>
            <div className="flex items-center gap-3">
              <RadioGroupItem onClick={() => setStatusParam("all")} value="all" id="r1" />
              <Label htmlFor="r1">All</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem onClick={() => setStatusParam("Pending")} value="Pending" id="r2" />
              <Label htmlFor="r2">Pending</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem onClick={() => setStatusParam("Approved")} value="Approved" id="r3" />
              <Label htmlFor="r3">Approved</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem onClick={() => setStatusParam("Rejected")} value="Rejected" id="r4" />
              <Label htmlFor="r4">Rejected</Label>
            </div>
          </RadioGroup>
        </div>
        <div className='flex  items-center gap-2 sm:ml-auto mt-4 sm:mt-0'>
          <Input type='date' value={fromDate} onChange={(e) => setfromDate(e.target.value)} /> <span>To </span>
          <Input type='date' value={ToDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>#</TableHead>
            <TableHead>Doc #</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approver</TableHead>
            <TableHead>Title</TableHead>
            {/* <TableHead>Decision</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const isEditable = ID === item.ApprovalApproverID && item.FinalApprovalStatus === "Pending"
            const isChecked = checkedItems.some(ci => ci.ApprovalNum === item.ApprovalNum)

            return (
              <TableRow key={index} className={isEditable ? "" : "bg-muted"}>
                <TableCell>
                  {/* {isEditable} 
                  {ID} */}
                  {/* <Checkbox
                    disabled={!isEditable}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      setCheckedItems((prev) => {
                        if (checked) {
                          return [...prev, { ApprovalNum: item.ApprovalNum, DocNum: item.DocNum }]
                        } else {
                          return prev.filter(ci => ci.ApprovalNum !== item.ApprovalNum)
                        }
                      })
                    }}
                  /> */}
                </TableCell>
                <TableCell>{item.ApprovalNum}</TableCell>
                <TableCell>
                  {item.project_id === 1 ?
                    <FormDialogUser projectId={item.project_id} DocEntry={item.DocNum} /> :
                    <FormDialog DocEntry={item.DocNum} onClose={() => { }} />
                  }
                </TableCell>
                <TableCell>{onlyDate(item.createdDate.toString())}</TableCell>
                <TableCell
                  className={
                    item.FinalApprovalStatus === "Pending"
                      ? "text-yellow-500"
                      : item.FinalApprovalStatus === "Approved"
                        ? "text-green-600"
                        : item.FinalApprovalStatus === "Rejected"
                          ? "text-red-500"
                          : ""
                  }
                >
                  {isEditable ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2">
                        {item.FinalApprovalStatus} <IconDotsVertical className="w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={async () => {
                          console.log({ item })
                          // return
                          await setApprovalState(1, item.ApprovalNum, item.project_id, item.DocNum, item.Title, item.CreatedBy)
                          await getData()
                        }}>Approve</DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {

                          await setApprovalState(2, item.ApprovalNum, item.project_id, item.DocNum, item.Title, item.CreatedBy)
                          await getData()
                        }}
                        >Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    item.FinalApprovalStatus
                  )}
                </TableCell>
                <TableCell>{item.FirstName}, {item.LastName}</TableCell>
                <TableCell>{item.Title}</TableCell>
                {/* <TableCell>{item.description}</TableCell> */}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <div className="mt-4" />
      <div className='flex justify-between'>
        <div>
          <Pagination currentPage={page} setPage={setPage} maxPage={MaxPage} onPageChange={getDatawithPage} />
        </div>
        <div className=''>
          {/* <DropdownMenu>
            <DropdownMenuTrigger type="button" className="bg-primary text-primary-foreground px-4 py-1.5 disabled:opacity-50" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Global Update'}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Decision</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => await globalUpdate(1)}
              >
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => await globalUpdate(2)}
              >
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  )
}
