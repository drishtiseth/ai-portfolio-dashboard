import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

type Props = { data: Record<string, number> };
const COLORS = ["#8884d8","#82ca9d","#ffc658","#8dd1e1","#d0ed57","#a4de6c","#d08484","#84d0d0","#c0c0c0"];

export default function SectorPie({ data }: Props) {
  // inside SectorPie
const items = Object.entries(data)
  .filter(([k, v]) => typeof k === "string" && Number.isFinite(v) && v > 0)
  .map(([name, value]) => ({ name, value }));
  if (!items.length) return <div className="muted">No sector data.</div>;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={items} dataKey="value" nameKey="name" outerRadius={110} label>
            {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
