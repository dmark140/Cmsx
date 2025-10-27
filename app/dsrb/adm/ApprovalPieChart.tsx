// components/ApprovalPieChart.tsx
'use client';

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#10B981', '#FBBF24']; // green for approved, yellow for pending

export default function ApprovalPieChart({
  approved = 1,
  pending = 3,
}: {
  approved: number;
  pending: number;
}) {
  const data = [
    { name: 'Approved', value: approved },
    { name: 'Pending', value: pending },
  ];

  return (
    <div className=" rounded-2xl shadow-lg p-6 ">
    
      <div className="h-[224px] ">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
