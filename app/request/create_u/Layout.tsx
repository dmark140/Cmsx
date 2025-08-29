'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { runQuery } from '@/lib/utils';
import { useGlobalPush } from '@/lib/router/useGlobalPush';

export type Project = {
    DocEntry: number;
    AddedBy: number;
    Title: string;
    Disc: string;
    createdDate: string;
    void: string;
    DocNum: number;
    type: string;
    title: string;
    value: string;
    createdBy: number;
    createdDateRequirement: string;
    voidRequirement: string;
};

export default function Layout() {
    // const { FormIdRequested } = useGlobalContext();
    const FormIdRequested = 1
    const [data, setData] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({});
    const { push } = useGlobalPush();

    const fetchProject = async () => {
        // if (FormIdRequested === 0) return;
        setLoading(true);
        try {
            const res = await fetch('/api/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryName: 'getProjecsInFOrm',
                    params: [FormIdRequested],
                }),
            });

            const result = await res.json();
            setData(result.data || []);
        } catch (err) {
            toast.error('Failed to fetch project');
        } finally {
            setLoading(false);
        }
    };
    const insertUser = async () => {
        if (FormIdRequested !== 1) return;
        const email = formValues['Email'] || '';
        const fname = formValues['First Name'] || '';
        const mname = formValues['Middle Name'] || '';
        const lname = formValues['Last Name'] || '';
        const uname = formValues['Username'] || '';
        const pass = formValues['Password'] || '';
        if (!email || !fname || !uname || !pass) {
            toast.error('Please fill in all required fields');
            return;
        }
        console.log(email, fname, mname, lname, uname, pass)
        // CheckUserEmail
        try {
            const emailCheckRes = await fetch('/api/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryName: 'CheckUserEmail',
                    params: [email],
                }),
            });
            const result = await emailCheckRes.json();
            if (emailCheckRes.ok) {
                if (result.data && result.data.length > 0) {
                    toast.error('Email already exists');
                    return;
                }
            } else {
                toast.error('Failed Fetch User Email');

            }
        } catch (error) {

        }
        // `email`, `FirstName`, `MiddleName`, `LastName`, `user`, `pass` -> this is the query structure's order
        setLoading(true);
        try {
            const res = await fetch('/api/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryName: 'insertUser',
                    params: [email, fname, mname, lname, uname, pass],
                }),
            });

            const result = await res.json();
            const resId = result?.insertId || 0
            if (res.ok && resId != 0) {
                const x = await runQuery('setApproval', [resId, FormIdRequested])
                toast.success("User created successfully, and it's now for approval");
                push('/')
            } else {
                toast.error('Failed to insert user');
            }
        } catch (err) {
            toast.error('Failed to fetch project');
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        fetchProject();
    }, [FormIdRequested]);

    const handleChange = (field: string, value: string) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field: string) => {
        setShowPasswordFields(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handlePublish = () => {
        console.log('Form Submitted:', formValues);
        insertUser();

    };

    const uniqueFields = data.map((item) => ({
        key: item.title,
        label: item.title,
        type: item.type,
    }));

    const projectInfo = data[0];

    return (
        <div className="max-w-xl mx-auto mt-6 p-4">
            {loading ? (
                <Card className="p-4">
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                </Card>
            ) : data.length === 0 ? (
                <p className="text-center text-gray-500">No data found</p>
            ) : (
                <Card className="p-6 space-y-4">
                    <div>
                        <h1 className="text-xl font-semibold mb-2">{projectInfo?.Title}</h1>
                        <p className="text-gray-600 mb-4">{projectInfo?.Disc}</p>
                    </div>

                    {uniqueFields.map((field, idx) => {
                        const isPassword = field.type.toLowerCase() === 'password';
                        const showPassword = showPasswordFields[field.key] || false;

                        return (
                            <div key={idx}>
                                <Label className="block mb-1">{field.label}</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type={isPassword && !showPassword ? 'password' : 'text'}
                                        placeholder={field.label}
                                        value={formValues[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                    />
                                    {isPassword && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => togglePasswordVisibility(field.key)}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="pt-4">
                        <Button className="w-full" onClick={handlePublish}>
                            Publish
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
