'use client'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react' 
import { Input } from '@/components/ui/input'
import { DropDownBaranggay } from './DropDownBaranggay' 

export default function Dahsboard() {
    
    const [ShowAmounts, setShowAmounts] = useState(false)
    const ListOfCards = [
        {
            Title: "Total Fund Release",

            Disc: "Total Approval Request",
            Content: "₱ 5,000,000.00",
            Footer: "View All"
        },
        {
            Title: "Total Fund For-Release",

            Disc: "Total  Request",
            Content: "₱ 1,000,000.00",
            Footer: "View All"
        }
    ]

    return (
        <>
            <div className=' sm:flex grid gap-4 '>
                <Input type='date' className='sm:w-[180px]' />
                <Input type='date' className='sm:w-[180px]' />
                <DropDownBaranggay />
            </div>
            <div className='grid  sm:grid-cols-4  gap-4 '>
                {ListOfCards.map((item, i) => (
                    <div className='sm:max-w-[300px] w-full  flex-1 ' key={i}>
                        <Card className='h-full'>
                            <CardHeader>
                                <CardTitle>{item.Title}</CardTitle>
                                <CardDescription>{item.Disc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>{item.Content}</p>
                            </CardContent>
                            <CardFooter className='mt-auto'>
                                <p>{item.Footer}</p>
                            </CardFooter>
                        </Card>
                    </div>
                ))}

                <div className=' w-full flex-1 col-span-2' >
                    <Card className='h-full'>
                        <CardHeader>
                            <CardTitle>Approvals</CardTitle>
                            <CardDescription>
                                <p className='text-muted-foreground'>Total : 4</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='p-0 justify-center items-center'>

                            <div className='grid grid-cols-3 '>
                                <div className='items-center text-center'>
                                    <p className='text-2xl'>1</p>
                                    <p className='text-muted-foreground'>Approved</p>
                                </div> <div className='items-center text-center'>
                                    <p className='text-2xl'>1</p>
                                    <p className='text-muted-foreground'>Turn-over</p>
                                </div>
                                <div className='items-center text-center'>
                                    <p className='text-2xl'>3</p>
                                    <p className='text-muted-foreground'>Pending</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='mt-auto'>
                            <p>View All</p>
                        </CardFooter>
                    </Card>
                </div>
                {/* <div className=' w-full flex-1 ' >
                    <Card className='h-full'>

                        <CardContent className='p-0 justify-center items-center'>
                         
                        </CardContent>
                    </Card>
                </div> */}
               
            </div></>
    )
}
