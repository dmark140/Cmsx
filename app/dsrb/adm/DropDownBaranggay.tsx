"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { runQuery } from "@/lib/utils"

type Barangay = {
  DocNum: number
  name: string
}

type DropDownBarangayProps = {
  onSelect?: (value: string) => void
  defaultValue?: string
}

export function DropDownBaranggay({ onSelect, defaultValue = "Select Barangay" }: DropDownBarangayProps) {
  const [position, setPosition] = useState(defaultValue)
  const [listOfBarangay, setListOfBarangay] = useState<Barangay[]>([])

  const handleOpen = async () => {
    const res = await runQuery("getselectionlistPerRow", [1])
    setListOfBarangay(res?.data || [])
  }

  useEffect(() => {
    handleOpen()
  }, [])

  const handleChange = (value: string) => {
    setPosition(value)
    if (onSelect) onSelect(value)
  }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className="blue px-2 py-1">
        <Button variant="outline">{position}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Barangay List</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={handleChange}>
          {listOfBarangay.length > 0 ? (
            listOfBarangay.map((item) => (
              <DropdownMenuRadioItem key={item.DocNum} value={item.name}>
                {item.name}
              </DropdownMenuRadioItem>
            ))
          ) : (
            <DropdownMenuRadioItem value="Loading...">Loading...</DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
