'use client';

import React, { useLayoutEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { runQuery } from '@/lib/utils';
import { toast } from 'sonner';

interface Column {
  DocNum: number;
  label: string;
  type: string;
  tablename: string;
  code: string;
}

interface TableFieldProps {
  docEntry: number;
  fieldKey: number;
  value: any[];
  onChange: (key: number, value: any[]) => void;
}

export default function TableField({ docEntry, fieldKey, value, onChange }: TableFieldProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, { code: string; name: string; DocNum: string }[]>>({});

  useLayoutEffect(() => {
    const fetchColumns = async () => {
      const res = await runQuery('getTableFieldColumns', [docEntry]);
      const cols = res.data || [];
      setColumns(cols);

      for (const col of cols) {
        if (col.type === 'dropdown') {
          const optionsRes = await runQuery('getselectionlistPerRow', [col.label]);
          setDropdownOptions(prev => ({ ...prev, [col.label]: optionsRes.data || [] }));
        }
      }
    };

    fetchColumns();
  }, [docEntry]);

  const handleInputChange = (rowIndex: number, columnKey: number, val: string) => {
    const updated = [...value];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [columnKey]: val,
    };
    onChange(fieldKey, updated);
  };

  const handleAddRow = () => {
    if (!validateRequired()) {
      toast("you need to fiilup all previews field first")
      return
    }
    const newRow: Record<string, string> = {};
    columns.forEach(col => {
      newRow[col.DocNum] = '';
    });
    onChange(fieldKey, [...value, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(fieldKey, updated);
  };

  const validateRequired = (): boolean => {
    return value.every(row =>
      columns.every(col => {
        const val = row[col.DocNum];
        return val !== undefined && val !== null && String(val).trim() !== '';
      })
    );
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border text-sm">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="border px-2 py-1 text-left whitespace-nowrap">
                <span className="mr-8">{col.tablename}</span>
              </th>
            ))}
            <th className="border px-2 py-1 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {value.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => {
                const cellVal = row[col.DocNum] || '';
                if (col.type === 'dropdown') {
                  const opts = dropdownOptions[col.label] || [];
                  return (
                    <td key={colIndex} className="border px-2 py-1">
                      <select
                        className="w-full border rounded p-1 text-sm"
                        value={cellVal}
                        onChange={(e) => handleInputChange(rowIndex, col.DocNum, e.target.value)}
                      >
                        <option value="" className="bg-background">Select</option>
                        {opts.map((opt, i) => (
                          <option key={i} value={opt.DocNum} className="bg-background">
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                } else {
                  return (
                    <td key={colIndex} className="border px-2 py-1">
                      <Input
                        type={col.type === 'number' ? 'number' : 'text'}
                        value={cellVal}
                        onChange={(e) => handleInputChange(rowIndex, col.DocNum, e.target.value)}
                      />
                    </td>
                  );
                }
              })}
              <td className="border px-2 py-1 text-center">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveRow(rowIndex)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex gap-2">
        <Button
          type="button"
          onClick={handleAddRow}
          size="sm"
        // disabled={!validateRequired()}
        >
          Add Row
        </Button>
        {/* <Button
          type="button"
          size="sm"
          onClick={() => console.log({ valid: validateRequired(), value })}
        >
          Check
        </Button> */}
      </div>
    </div>
  );
}
