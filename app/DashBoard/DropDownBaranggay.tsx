"use client"

import * as React from "react"

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

export function DropDownBaranggay() {
    const [position, setPosition] = React.useState("Select Baranggay")

    return (
        <>
        
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{position}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Baranggay List</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                        <DropdownMenuRadioItem value="Aplaya">Aplaya</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Bobuntugan">Bobuntugan</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Corrales">Corrales</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Antonio">Antonio</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Solana">Solana</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Upper Jasaan">Upper Jasaan</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            </>
    )
}
