/*import React, { useState } from "react";*/
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";

export default function Stats() {
  const ecoHabits = [
    { name: "Riding a bike 🚲" },
    { name: "Donating clothes 👕" },
    { name: "Recycling plastic ♻️" },
    { name: "Planting a tree 🌳" },
    { name: "Using public transport 🚌" },
    { name: "Composting food waste 🍂" },
  ];

  const ecoDays = [1, 3, 5, 6, 9, 12, 14, 18, 20, 25, 28];

  const weeklyData = [
    { week: "Week 1", actions: 3 },
    { week: "Week 2", actions: 4 },
    { week: "Week 3", actions: 2 },
    { week: "Week 4", actions: 5 },
  ];

  const currentMonth = new Date();
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-8 bg-fundal min-h-screen">
      <h2 className="text-4xl font-extrabold mb-6 text-darkgreen text-center">
        Eco Statistics 🌿
      </h2>

      {/* Eco Habits */}
      <section className="bg-bigbox rounded-2xl shadow-md p-6 border border-smallbox">
        <h3 className="text-2xl font-bold mb-4 text-darkgreen text-center">
          Popular Eco Habits
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ecoHabits.map((habit, index) => (
            <li
              key={index}
              className="flex items-center gap-2 bg-earth border border-smallbox rounded-lg p-3 hover:bg-smallbox hover:text-darkgreen transition duration-200"
            >
              <span className="text-lg font-semibold text-darkgreen">
                {habit.name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Monthly Calendar */}
      <section className="bg-bigbox rounded-2xl shadow-md p-6 border border-smallbox">
        <h3 className="text-5xl text-darkgreen font-extrabold mb-6 text-center">
          {format(currentMonth, "MMMM yyyy")}
        </h3>

        <div className="grid grid-cols-7 text-center font-bold mb-4 text-darkgreen">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day) => {
            const dayNum = day.getDate();
            const isEcoDay = ecoDays.includes(dayNum);
            const offset = getDay(startOfMonth(currentMonth)) || 7;
            return (
              <div
                key={dayNum}
                className={`aspect-square flex items-center justify-center rounded-lg border text-sm transition duration-200 ${
                  isEcoDay
                    ? "bg-earth text-darkgreen font-bold shadow-md"
                    : "bg-smallbox text-darkgreen hover:bg-darkgreen hover:text-white"
                }`}
                style={{
                  gridColumnStart: dayNum === 1 ? offset : undefined,
                }}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Chart */}
      <section className="bg-bigbox rounded-2xl shadow-md p-6 border border-smallbox">
        <h3 className="text-3xl font-bold mb-4 text-darkgreen text-center">
          Weekly Eco Actions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={weeklyData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e9dcc3" />
            <XAxis dataKey="week" tick={{ fill: "#255938", fontWeight: 600 }} />
            <YAxis tick={{ fill: "#255938", fontWeight: 600 }} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                backgroundColor: "#DDE6DE",
                borderRadius: "8px",
                border: "1px solid #c5d9d0",
                color: "#255938",
              }}
            />
            <Legend />
            <Bar
              dataKey="actions"
              name="Eco Actions"
              fill="#b39283"
              radius={[20, 20, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}