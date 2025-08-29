'use client';
import DynamicDropdown from '@/lib/DynamicDropdown';
import React, { useLayoutEffect, useState } from 'react';

interface GLMapping {
  id: number;
  project_name: string;
  dr_code: string;
  dr_name: string;
  cr_code: string;
  cr_name: string;
}

export default function GLMappingTable() {
  const [data, setData] = useState<GLMapping[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/gl-mapping');
    const json = await res.json();
    setData(json);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">AR Invoice GL Mapping</h1>

      <table className="table-auto w-full border text-sm">
        <thead className="">
          <tr>
            <th className="border px-3 py-2">Project</th>
            <th className="border px-3 py-2">DR Code</th>
            <th className="border px-3 py-2">DR Name</th>
            <th className="border px-3 py-2">CR Code</th>
            <th className="border px-3 py-2">CR Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, id) => (
            <tr key={id}>
              <td className="border px-3 py-2">{entry.project_name}</td>
              <td className="border px-3 py-2">{entry.dr_code}</td>
              <td className="border px-3 py-2">{entry.dr_name}</td>
              <td className="border px-3 py-2">{entry.cr_code}</td>
              <td className="border px-3 py-2">{entry.cr_name}</td>
            </tr>
          ))}
          <tr>
            <td>
              <DynamicDropdown
                queryText="ChartOfAccountPerType"
                params={["Project"]}
                onChange={(val) => console.log('Returned:', val)}
              />
            </td>
            <td>  <DynamicDropdown
              queryText="ChartOfAccountPerType"
              params={["Project"]}
              onChange={(val) => console.log('Returned:', val)}
            /></td>
            <td></td>
            <td>  <DynamicDropdown
              queryText="ChartOfAccountPerType"
              params={["Payable"]}
              onChange={(val) => console.log('Returned:', val)}
            /></td>
            <td></td>

          </tr>
        </tbody>

      </table>
    </div>
  );
}
