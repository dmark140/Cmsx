'use client';

import { Button } from '@/components/ui/button';
import React, { useLayoutEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { runQuery } from '@/lib/utils';
import { useGlobalContext } from '@/context/GlobalContext';

type Account = {
  type: string;
  Code: string;
  Name: string;
  status: boolean;
};

const chartOfAccountsInitial: Account[] = [
  { type: "Assets", Code: "1100000", Name: "Cash in Bank", status: true },
  { type: "Expenses", Code: "5120000", Name: "Emergency Relief Disbursement", status: true },
];

export default function Layout() {
  const { ID ,UserLevel} = useGlobalContext()
  const [selectedType, setSelectedType] = useState<string>("Assets");
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>(chartOfAccountsInitial);
  const [newName, setNewName] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const filteredAccounts = chartOfAccounts.filter(acc => acc.type === selectedType);

  const getNextCode = () => {
    const codes = filteredAccounts.map(acc => parseInt(acc.Code));
    const maxCode = Math.max(...codes);
    return (maxCode + 100).toString().padStart(7, '0');
  };

  const handleAdd = async () => {

    if (newName === "") return toast("[Name] needs to be filled")

    const code = getNextCode();
    const newAccount: Account = {
      type: selectedType,
      Code: code,
      Name: newName || "New Account",
      status: isActive,
    };

    console.log({ newAccount })

    const addChartOfAccount = await runQuery("insert_chart_of_accounts", [newAccount.Code, newAccount.Name, ID, newAccount.type])
    if (addChartOfAccount) getData()



    // setChartOfAccounts(prev => [...prev, newAccount]);
    // setNewName("");
    // setIsActive(true);
    // console.log(`Type: ${newAccount.type}, Code: ${newAccount.code}, Status: ${newAccount.status ? "Active" : "Inactive"}`);
  };

  const getData = async () => {
    const x = await runQuery("SelectAllChartOfAccount", [])
    console.log(x)
    setChartOfAccounts(x.data)
  }
  useLayoutEffect(() => {
    getData()
  }, [])

  const toggleStatus = (code: string) => {
    setChartOfAccounts(prev =>
      prev.map(acc =>
        acc.Code === code
          ? {
            ...acc,
            status: !acc.status,
          }
          : acc
      )
    );

    const updated = chartOfAccounts.find(acc => acc.Code === code);
    if (updated) {
      console.log(`Type: ${updated.type}, Code: ${updated.Code}, Status: ${updated.status ? "Active" : "Inactive"}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>

      <Tabs defaultValue="Assets" className="mb-4">
        <TabsList>
          <TabsTrigger value="Assets" onClick={() => setSelectedType("Assets")}>Assets</TabsTrigger>
          <TabsTrigger value="Expenses" onClick={() => setSelectedType("Expenses")}>Expenses</TabsTrigger>
          <TabsTrigger value="Project - Expense" onClick={() => setSelectedType("Project - Expense")}>Project - Expense</TabsTrigger>
          <TabsTrigger value="Payable" onClick={() => setSelectedType("Payable")}>Payable</TabsTrigger>
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
            <tr key={acc.Code}>
              <td className="border px-2 py-1">
                <Button variant={"ghost"} className='p-0 m-0 py-0'>{acc.Code}</Button>
              </td>
              <td className="border px-2 py-1">{acc.Name}</td>
              <td className="border px-2 py-1">
                <div className='flex items-center gap-2'>
                  <Checkbox
                    checked={acc.status}
                    onCheckedChange={() => toggleStatus(acc.Code)}
                  />
                  <span>{acc.status ? "Active" : "Inactive"}</span>
                </div>
              </td>
            </tr>
          ))}

          {!["Project", "Project - Payable"].includes(selectedType) && (<>
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
          </>)}

        </tbody>
      </table>
    </div>
  );
}
