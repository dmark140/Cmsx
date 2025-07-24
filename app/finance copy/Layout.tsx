import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Layout() {
    return (
        <div className='grid '>
            <p className='font-bold'>Modules</p>
            <Button className='w-fit' variant={"ghost"}><Link href={"finance/coa"}>Chart of Accounts</Link>   <Link2 /></Button>
            <Button className='w-fit' variant={"ghost"}><Link href={"finance/je"}>Chart of Accounts</Link>   <Link2 /></Button>
            <Button className='w-fit' variant={"ghost"}><Link href={"finance/coa"}>Chart of Accounts</Link>   <Link2 /></Button>
            <Button className='w-fit' variant={"ghost"}>Edit Chart of Accounts <Link2 /></Button>
            <Button className='w-fit' variant={"ghost"}>Journal Entry <Link2 /></Button>
            <Separator />
            <p className='font-bold'>Reports</p>
            <Button className='w-fit' variant={"ghost"}>Journal Entry Transacton Report <Link2 /></Button>
        </div>
    )
}
