import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Stats() {
  const data = [
    { day: "Mon", completed: 3 },
    { day: "Tue", completed: 4 },
    { day: "Wed", completed: 2 },
    { day: "Thu", completed: 5 },
    { day: "Fri", completed: 3 },
    { day: "Sat", completed: 4 },
    { day: "Sun", completed: 1 },
  ];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Weekly Habit Stats 📊</h2>
      <div className="bg-white p-6 rounded shadow-md">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#22c55e" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
