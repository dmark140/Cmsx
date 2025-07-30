"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, addDays, getMonth, getYear } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"
import FormDialog from "./FormDialog"
import { runQuery } from "@/lib/utils"
import { toast } from "sonner"

interface Schedule {
  id: number
  date: string // yyyy-MM-dd
  title: string
  bookingDate: string;

}

let idCounter = 1

export default function BookingCalendar() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [open, setOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())



  const getBookingPerDay = async () => {
    const Data = await runQuery("getprojects_data_a_headerWhereNotInBookings", [])
    if (Data) {
      setSchedules(Data.data)
    } else {
      toast.error("Failed to fetch bookings for the day")
    }
  }


  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfMonth(currentDate)
    const days: Date[] = []
    let day = start
    while (day <= end || days.length % 7 !== 0) {
      days.push(new Date(day))
      day = addDays(day, 1)
    }
    return days
  }, [currentDate])

  const currentMonth = getMonth(currentDate)
  const currentYear = getYear(currentDate)

  // const addSchedule = (date: string) => {
  //   if (newTitle.trim()) {
  //     setSchedules((prev) => [
  //       ...prev,
  //       { id: idCounter++, date, title: newTitle.trim() },
  //     ])
  //     setNewTitle("")
  //     setOpen(false)
  //   }
  // }

  // const openDialogForDate = (date: string) => {
  //   setSelectedDate(date)
  //   setOpen(true)
  // }

  const goToPreviousMonth = () => {
    const prev = new Date(currentDate)
    prev.setMonth(prev.getMonth() - 1)
    setCurrentDate(prev)
  }

  const goToNextMonth = () => {
    const next = new Date(currentDate)
    next.setMonth(next.getMonth() + 1)
    setCurrentDate(next)
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value)
    const updated = new Date(currentDate)
    updated.setMonth(newMonth)
    setCurrentDate(updated)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value)
    const updated = new Date(currentDate)
    updated.setFullYear(newYear)
    setCurrentDate(updated)
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const years = Array.from({ length: 20 }, (_, i) => 2015 + i)
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]


  useEffect(() => {
    getBookingPerDay()
  }, [currentMonth])

  return (
    <div className="">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-bold">Appointment Calendar</h1> */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {/* <Button
              onClick={() => {
                const todayStr = format(new Date(), "yyyy-MM-dd")
                setSelectedDate(todayStr)
                setOpen(true)
              }}
            >
              + Create Schedule
            </Button> */}
          </DialogTrigger>
          {/* <DialogContent>
            <DialogTitle></DialogTitle>
            <h2 className="text-lg font-medium mb-2">
              Add Schedule for {selectedDate}
            </h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button onClick={() => selectedDate && addSchedule(selectedDate)}>
              Save
            </Button>
          </DialogContent> */}
        </Dialog>
      </div>
      {/* Parameters */}
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" onClick={goToPreviousMonth}><ChevronLeft className="w-4 h-4" /></Button>
        <div className="flex items-center gap-2">
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="border p-1 rounded bg-background"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={handleYearChange}
            className="border p-1 rounded bg-background"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <Button variant="ghost" onClick={goToNextMonth}><ChevronRight className="w-4 h-4" /></Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd")
          console.log({ dateStr })
          const isSameMonth = getMonth(day) === currentMonth
          const count = schedules.filter((s) => format(s.bookingDate, "yyyy-MM-dd") === dateStr).length
          return (

            <Card key={i} className="p-0 m-0 bg-transparent">
              <FormDialog count={count} dateStr={dateStr} day={day} isSameMonth={isSameMonth} onClose={getBookingPerDay} />
              {/* <Card
                key={dateStr}
                className={`min-h-[70px] p-2 cursor-pointer hover:bg-muted-foreground ${!isSameMonth ? 'opacity-40' : ''}`}
              // onClick={() => openDialogForDate(dateStr)}
              >
                <CardContent className="flex flex-col items-center">
                  <span className="text-sm font-bold">{format(day, "d")}</span>
                  {count > 0 && (
                    <span className="text-xs mt-1">({count})scheduled</span>
                  )}
                </CardContent>
              </Card
              > */}
            </Card>)
        })}
      </div>
      <Button onClick={() => console.log({ schedules })}>
        Check
      </Button>

      {/* available project / un */}
      {/* */}
    </div>
  )
}
