'use client';

import { Button } from '@/components/ui/button';
import { runQuery } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

type SelectionLists = {
  DocNum: number;
  DocEntry: number;
  Code: string;
  Name: string;
  name: string;
};

interface SelectFieldProps {
  docEntry: number;
  fieldKey: number;
  value: string;
  onChange: (field: number, value: string) => void;
}

export default function SelectField({ docEntry, fieldKey, value, onChange }: SelectFieldProps) {
  const [options, setOptions] = useState<SelectionLists[]>([]);

  useEffect(() => {
    const getOptions = async () => {
      try {
        const res = await runQuery('getselectionlistPerRowDocnum', [docEntry]);
        setOptions(res?.data || []);
      } catch (error) {
        console.log({ error })
      }
    };
    getOptions();
  }, [docEntry]);

  return (
    <>
      <select
        className="w-full border rounded p-2"
        value={value}
        onChange={(e) => onChange(fieldKey, e.target.value)}
      >
        <option value="" className='bg-background'>Select from List</option>
        {options.map((opt) => (
          <option key={opt.DocEntry} value={opt.DocEntry} className='bg-background'>
            {opt.DocEntry} - {opt.name}
          </option>
        ))}
      </select>
      {/* <Button onClick={() => console.log({ options, docEntry })}>Check</Button> */}
    </>
  );
}
