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
import SelectField from './Selection';
import UploadField from './UploadField';
import TableField from './TableField';
import { useRouter } from 'next/navigation';
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
    const { FormIdRequested, ID } = useGlobalContext();
    const router = useRouter()
    const { push } = useGlobalPush()

    const [data, setData] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({});
    const [publishing, setPublishing] = useState<boolean>(false); // ⬅️ added

    const fetchProject = async () => {
        if (FormIdRequested === 0) return;
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

    useLayoutEffect(() => {
        fetchProject();
    }, [FormIdRequested]);

    const handleChange = (field: number, value: any) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field: number) => {
        setShowPasswordFields(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validateForm = (): boolean => {
        for (const field of uniqueFields) {
            const value = formValues[field.DocEntry];

            if (
                field.type !== 'table' &&
                (value === undefined || value === null || String(value).trim() === '')
            ) {
                toast.error(`"${field.label}" is required.`);
                return false;
            }

            if (field.type === 'table') {
                const rows = formValues[field.DocEntry] || [];
                for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    const row = rows[rowIndex];
                    const isRowIncomplete = Object.entries(row).some(([_, v]) => {
                        return v === undefined || v === null || String(v).trim() === '';
                    });
                    if (isRowIncomplete) {
                        toast.error(`All fields in "${field.label}" row ${rowIndex + 1} are required.`);
                        return false;
                    }
                }
            }
        }

        return true;
    };

    const handlePublish = async () => {
        if (!validateForm()) return;

        setPublishing(true); // ⬅️ Start loading
        try {
            const q1 = await runQuery("insert_projects_data_a_header", [ID, FormIdRequested]);
            if ((q1?.insertId ?? 0) <= 0) return;

            for (const [key, value] of Object.entries(formValues)) {
                if (Array.isArray(value)) {
                    let i = 0;
                    for (const row of value) {
                        i++;
                        const q2 = await runQuery("insert_projects_data_b_lines", [q1?.insertId, key, "table"]);
                        for (const [colKey, colValue] of Object.entries(row)) {
                            await runQuery("insert_projects_data_c_table", [q2?.insertId, colKey, colValue, i]);
                        }
                    }
                } else {
                    await runQuery("insert_projects_data_b_lines", [q1?.insertId, key, value]);
                }
            }
            try {
                const x = await runQuery('setApproval', [q1?.insertId, FormIdRequested])
                toast.success("Successfully published , awaiting for approval");
                console.log({ x })
                if (FormIdRequested > 25) return
                const y = await runQuery('setApproval', [q1?.insertId, FormIdRequested])
                console.log({ x })

            } catch (error) {

            }
        } catch (error) {
            console.error("Publish error:", error);
            toast.error("Failed to publish data.");
        } finally {
            setPublishing(false);
            push("./")
        }
    };

    const uniqueFields = data.map((item) => ({
        key: item.title,
        label: item.title,
        type: item.type,
        DocEntry: item.DocNum,
        value: item.value,
    }));

    const projectInfo = data[0];

    return (
        <div className="mx-auto mt-6 p-4 w-full">
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
                        const isSelection = field.type.toLowerCase() === 'selection';
                        const isTable = field.type.toLowerCase() === 'table';
                        const showPassword = showPasswordFields[field.DocEntry] || false;

                        return (
                            <div key={idx} className="w-full space-y-1">
                                <Label className="block mb-1">{field.label}</Label>

                                {isTable ? (
                                    <TableField
                                        docEntry={field.DocEntry}
                                        fieldKey={field.DocEntry}
                                        value={formValues[field.DocEntry] || []}
                                        onChange={handleChange}
                                    />
                                ) : isSelection ? (
                                    <div className="flex items-center gap-2">
                                        <SelectField
                                            docEntry={field.DocEntry}
                                            fieldKey={field.DocEntry}
                                            value={formValues[field.DocEntry] || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : field.type.toLowerCase() === 'file' ? (
                                    <div className="flex items-center gap-2">
                                        <UploadField
                                            fieldKey={field.DocEntry}
                                            value={formValues[field.DocEntry] || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type={isPassword && !showPassword ? 'password' : field.value}
                                            placeholder={field.label}
                                            value={formValues[field.DocEntry] || ''}
                                            onChange={(e) => handleChange(field.DocEntry, e.target.value)}
                                        />
                                        {isPassword && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => togglePasswordVisibility(field.DocEntry)}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-4">
                        <Button className="w-full" onClick={handlePublish} disabled={publishing}>
                            {publishing ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
