'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";

type Account = {
  type: string;
  code: string;
  name: string;
  status: boolean;
};

const chartOfAccountsInitial: Account[] = [
  { type: "Assets", code: "1100000", name: "Cash in Bank", status: true },
  { type: "Assets", code: "1100100", name: "Cash on Hand", status: true },
  { type: "Assets", code: "1100200", name: "Petty Cash", status: true },
  { type: "Expenses", code: "5100000", name: "Financial Assistance Expense", status: true },
  { type: "Expenses", code: "5110000", name: "Livelihood Support Grants", status: true },
  { type: "Expenses", code: "5120000", name: "Emergency Relief Disbursement", status: true },
];

export default function Layout() {
  const [selectedType, setSelectedType] = useState<string>("Assets");
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>(chartOfAccountsInitial);
  const [newName, setNewName] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const filteredAccounts = chartOfAccounts.filter(acc => acc.type === selectedType);

  const getNextCode = () => {
    const codes = filteredAccounts.map(acc => parseInt(acc.code));
    const maxCode = Math.max(...codes);
    return (maxCode + 100).toString().padStart(7, '0');
  };

  const handleAdd = () => {
    const code = getNextCode();
    const newAccount: Account = {
      type: selectedType,
      code,
      name: newName || "New Account",
      status: isActive,
    };

    setChartOfAccounts(prev => [...prev, newAccount]);
    setNewName("");
    setIsActive(true);
    console.log(`Type: ${newAccount.type}, Code: ${newAccount.code}, Status: ${newAccount.status ? "Active" : "Inactive"}`);
  };

  const toggleStatus = (code: string) => {
    setChartOfAccounts(prev =>
      prev.map(acc =>
        acc.code === code
          ? {
              ...acc,
              status: !acc.status,
            }
          : acc
      )
    );

    const updated = chartOfAccounts.find(acc => acc.code === code);
    if (updated) {
      console.log(`Type: ${updated.type}, Code: ${updated.code}, Status: ${updated.status ? "Active" : "Inactive"}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>

      <Tabs defaultValue="Assets" className="mb-4">
        <TabsList>
          <TabsTrigger value="Assets" onClick={() => setSelectedType("Assets")}>Assets</TabsTrigger>
          <TabsTrigger value="Expenses" onClick={() => setSelectedType("Expenses")}>Expenses</TabsTrigger>
        </TabsList>
      </Tabs>

      <table className="w-full border text-sm">
        <thead className="bg-background">
          <tr>
            <th className="border px-2 py-1 text-left">Code</th>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map(acc => (
            <tr key={acc.code}>
              <td className="border px-2 py-1">
                <Button variant={"ghost"} className='p-0 m-0 py-0'>{acc.code}</Button>
              </td>
              <td className="border px-2 py-1">{acc.name}</td>
              <td className="border px-2 py-1">
                <div className='flex items-center gap-2'>
                  <Checkbox
                    checked={acc.status}
                    onCheckedChange={() => toggleStatus(acc.code)}
                  />
                  <span>{acc.status ? "Active" : "Inactive"}</span>
                </div>
              </td>
            </tr>
          ))}

          <tr>
            <td className="border px-2 py-1">{getNextCode()}</td>
            <td className="border px-2 py-1 flex gap-2 items-center">
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Enter name" />
              <Button onClick={handleAdd}>Add</Button>
            </td>
            <td className="border px-2 py-1">
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={isActive}
                  onCheckedChange={(checked: boolean) => setIsActive(checked)}
                />
                <span>{isActive ? "Active" : "Inactive"}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
