'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddCoa from './AddCoa';
import { Separator } from '@/components/ui/separator';
const chartOfAccounts = [
  { type: "Assets", code: "1100000", name: "Cash in Bank" },
  { type: "Assets", code: "1100100", name: "Cash on Hand" },
  { type: "Assets", code: "1100200", name: "Petty Cash" },
  { type: "Assets", code: "1200000", name: "Accounts Receivable - Grants Receivable" },
  { type: "Assets", code: "1300000", name: "Advances to Employees (Disbursement)" },
  { type: "Assets", code: "1400000", name: "Due from National Treasury" },
  { type: "Assets", code: "1500000", name: "Other Current Assets" },
  { type: "Assets", code: "1600000", name: "Office Supplies Inventory" },
  { type: "Assets", code: "1700000", name: "Property, Plant, and Equipment" },
  { type: "Liabilities", code: "2100000", name: "Accounts Payable - Suppliers" },
  { type: "Liabilities", code: "2200000", name: "Unearned Revenue (Deferred Funds)" },
  { type: "Liabilities", code: "2300000", name: "Withholding Tax Payable" },
  { type: "Liabilities", code: "2400000", name: "Government Remittances Payable (GSIS, PhilHealth, Pag-IBIG)" },
  { type: "Equity", code: "3100000", name: "Government Equity / Fund Balance" },
  { type: "Equity", code: "3200000", name: "Retained Earnings / Prior Year Surplus" },
  { type: "Revenue", code: "4100000", name: "National Government Subsidy" },
  { type: "Revenue", code: "4200000", name: "Local Government Aid" },
  { type: "Revenue", code: "4300000", name: "Foreign/NGO Donations" },
  { type: "Revenue", code: "4400000", name: "Interest Income" },
  { type: "Revenue", code: "4500000", name: "Other Income (Non-Operating)" },
  { type: "Expenses", code: "5100000", name: "Financial Assistance Expense" },
  { type: "Expenses", code: "5110000", name: "Livelihood Support Grants" },
  { type: "Expenses", code: "5120000", name: "Emergency Relief Disbursement" },
  { type: "Expenses", code: "5130000", name: "Educational Assistance" },
  { type: "Expenses", code: "5140000", name: "Medical Assistance" },
  { type: "Expenses", code: "5150000", name: "Housing Assistance" },
  { type: "Expenses", code: "5200000", name: "Salaries and Wages" },
  { type: "Expenses", code: "5210000", name: "Honorarium for Social Workers" },
  { type: "Expenses", code: "5300000", name: "Utilities (Water, Electricity)" },
  { type: "Expenses", code: "5400000", name: "Office Supplies and Expenses" },
  { type: "Expenses", code: "5500000", name: "Transportation and Travel" },
  { type: "Expenses", code: "5600000", name: "Trainings and Capacity Building" },
  { type: "Expenses", code: "5700000", name: "Monitoring and Evaluation Costs" }
];


export default function Layout() {
  const [selectedType, setSelectedType] = useState<string>("Assets");

  const filteredAccounts = chartOfAccounts.filter(acc => acc.type === selectedType);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts - Add Mode </h2>
      <div className='flex  gap-4'>
        <div className='w-full max-w-[320px]'>
          <AddCoa />
        </div>
        <div className='flex-1'>


          <Tabs defaultValue="Assets" className="mb-4">
            <TabsList>
              <TabsTrigger value="Assets" onClick={() => setSelectedType("Assets")} >Assets</TabsTrigger>
              <TabsTrigger value="Liabilities" onClick={() => setSelectedType("Liabilities")} >Liabilities</TabsTrigger>
              <TabsTrigger value="Equity" onClick={() => setSelectedType("Equity")} >Equity</TabsTrigger>
              <TabsTrigger value="Revenue" onClick={() => setSelectedType("Revenue")} >Revenue</TabsTrigger>
              <TabsTrigger value="Expenses" onClick={() => setSelectedType("Expenses")} >Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
          {selectedType && (
            <table className="w-full border text-sm">
              <thead className="bg-background">
                <tr>
                  <th className="border px-2 py-1 text-left">Code</th>
                  <th className="border px-2 py-1 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(acc => (
                  <tr key={acc.code}>
                    <td className="border px-2 py-1"><Button variant={"ghost"} className='p-0 m-0 py-0'>{acc.code}</Button></td>
                    <td className="border px-2 py-1">{acc.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}
