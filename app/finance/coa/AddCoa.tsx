import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

export default function AddCoa() {
    const objs = [
        {
            type: "text",
            id: "GLType",
            placeholder: "Account Type"
        },
        {
            type: "text",
            id: "GLCode",
            placeholder: "Account Code"
        },
        {
            type: "text",
            id: "GLName",
            placeholder: "Account Name"
        }
    ];
    return (
        <div>
            {objs.map((item, i) => (
                <div key={i} className='mb-4'>
                    <div className="grid w-full max-w-sm items-center gap-3" >
                        <Label htmlFor="email">{item.placeholder}</Label>
                        <Input type={item.type} id={item.id} placeholder={item.placeholder} />
                    </div>
                </div>
            ))}
        </div>
    )
}
