import React, { useState } from "react";

const taskCategories = [
  {
    name: "Daily Eco Habits",
    key: "eco",
    tasks: [
      "Bring a reusable water bottle",
      "Use a reusable coffee cup",
      "Turn off lights when leaving a room",
      "Unplug devices not in use",
      "Take a shorter shower under 5 min",
      "Walk, bike, or use public transport instead of driving",
      "Skip the elevator — take the stairs",
      "Avoid single-use plastic (e.g., straws, cutlery, bags)",
      "Sort and recycle household waste",
      "Open windows instead of using AC"
    ]
  },
  {
    name: "Sustainable Living",
    key: "sustain",
    tasks: [
      "Eat a vegetarian or vegan meal today",
      "Avoid food waste — use leftovers creatively",
      "Buy local produce",
      "Compost food scraps",
      "Bring your own shopping bag",
      "Refuse unnecessary receipts or packaging",
      "Donate unused clothes or items",
      "Repair something instead of replacing it"
    ]
  },
  {
    name: "Energy Saving",
    key: "energy",
    tasks: [
      "Do laundry with cold water",
      "Hang clothes to dry instead of using the dryer",
      "Turn off the tap while brushing teeth",
      "Use energy-efficient bulbs",
      "Check for leaky faucets and fix them",
      "Reduce screen brightness to save power",
      "Collect rainwater for plants"
    ]
  },
  {
    name: "Nature Mindfulness",
    key: "nature",
    tasks: [
      "Plant a tree or indoor plant",
      "Spend 10 minutes in nature",
      "Pick up litter in your area",
      "Read 10 pages of a book",
      "Share an eco tip with a friend",
      "Join or volunteer for a green community project"
    ]
  },
  {
    name: "Digital Sustainability",
    key: "digital",
    tasks: [
      "Unsubscribe from unused newsletters",
      "Delete unnecessary files/emails",
      "Use dark mode on your devices",
      "Spend 1 hour tech-free today"
    ]
  }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStoredTasks(dateKey) {
  const stored = localStorage.getItem("daily-tasks-history");
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  return parsed[dateKey] || null;
}

function storeTasks(dateKey, tasks) {
  const stored = localStorage.getItem("daily-tasks-history");
  let parsed = {};
  if (stored) parsed = JSON.parse(stored);
  parsed[dateKey] = tasks;
  localStorage.setItem("daily-tasks-history", JSON.stringify(parsed));
}

function getDailyTasks(dateKey) {
  const existing = getStoredTasks(dateKey);
  if (existing) return existing;
  const selection = taskCategories.map(cat => {
    const task = cat.tasks[getRandomInt(0, cat.tasks.length - 1)];
    return {
      text: task,
      category: cat.name,
      key: cat.key,
      points: getRandomInt(5, 20),
      done: false,
      proof: null
    };
  });
  storeTasks(dateKey, selection);
  return selection;
}

const sampleYesterdayTasks = [
  { category: "Daily Eco Habits", text: "Bring a reusable water bottle", points: 10, done: true },
  { category: "Sustainable Living", text: "Eat a vegetarian meal", points: 18, done: false },
  { category: "Energy Saving", text: "Do laundry with cold water", points: 12, done: true },
  { category: "Nature Mindfulness", text: "Spend 10 minutes in nature", points: 15, done: true },
  { category: "Digital Sustainability", text: "Use dark mode on your devices", points: 7, done: false }
];

function ProofModal({ open, onClose, onSubmit }) {
  const [file, setFile] = useState(null);

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-bigbox rounded-2xl shadow-lg p-6 border border-smallbox w-full max-w-md"
        style={{ backgroundColor: "var(--color-bigbox)", borderColor: "var(--color-smallbox)" }}>
        <h3 className="text-xl font-bold mb-4 text-darkgreen">Prove your task</h3>
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit({ file });
        }}>
          <div className="mb-4">
            <label className="block text-darkgreen font-semibold mb-1">Upload Photo:</label>
            <label
              htmlFor="photo-upload"
              className="inline-block px-4 py-2 rounded-lg border border-darkgreen cursor-pointer font-semibold"
              style={{
                backgroundColor: "var(--color-fundal)",
                borderColor: "var(--color-darkgreen)",
                color: "var(--color-darkgreen)",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = "var(--color-beige)")}
              onMouseLeave={e => (e.target.style.backgroundColor = "var(--color-fundal)")}
            >
              {file ? file.name : "Choose Photo"}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
                required
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-beige border border-darkgreen text-darkgreen font-semibold"
              style={{ backgroundColor: "var(--color-beige)", borderColor: "var(--color-darkgreen)" }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-darkgreen text-fundal font-semibold"
              style={{ backgroundColor: "var(--color-darkgreen)", color: "var(--color-fundal)" }}
            >
              Submit Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DailyTasks() {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const yesterdayDate = new Date(today.getTime() - 86400000);
  const yesterdayKey = yesterdayDate.toISOString().slice(0, 10);

  const [tasks, setTasks] = useState(() => getDailyTasks(todayKey));
  const [proofIdx, setProofIdx] = useState(null);
  const yesterdayTasks = getStoredTasks(yesterdayKey) || sampleYesterdayTasks;

  const handleSubmitProof = (proof) => {
    const updated = [...tasks];
    updated[proofIdx] = {
      ...updated[proofIdx],
      done: true,
      proof
    };
    setTasks(updated);
    storeTasks(todayKey, updated);
    setProofIdx(null);
  };

  return (
    <main className="min-h-screen px-8 py-6" style={{ backgroundColor: "var(--color-fundal)" }}>
      <div className="mx-auto max-w-7xl">
        <ProofModal
          open={proofIdx !== null}
          onClose={() => setProofIdx(null)}
          onSubmit={handleSubmitProof}
        />
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Today's tasks */}
          <section
            className="bg-bigbox rounded-2xl shadow-md p-8 border border-smallbox flex-1"
            style={{ backgroundColor: "var(--color-bigbox)", borderColor: "var(--color-smallbox)" }}
          >
            <h2 className="text-3xl font-extrabold mb-8" style={{ color: "var(--color-darkgreen)" }}>
              Today's Tasks <span className="text-xl">🌎</span>
            </h2>
            <ul className="space-y-5">
              {tasks.map((task, idx) => (
                <li
                  key={idx}
                  className={`flex items-center bg-earth border border-smallbox rounded-xl shadow-sm px-6 py-5 transition w-full ${
                    task.done ? "opacity-60 line-through" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--color-earth)",
                    borderColor: "var(--color-smallbox)",
                    color: "var(--color-darkgreen)"
                  }}
                >
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold">{task.category}: </span>
                      {task.text}
                    </div>
                    <span
                      className="ml-0 sm:ml-6 mt-2 sm:mt-0 text-base font-semibold flex-shrink-0 flex items-center justify-end whitespace-nowrap"
                      style={{ minWidth: "120px" }}
                    >
                      Reward: {task.points}
                      <span className="ml-1" role="img" aria-label="EcoPoints">
                        🤑
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => !task.done && setProofIdx(idx)}
                    className="ml-4 px-4 py-2 rounded-lg font-semibold border border-darkgreen transition"
                    style={{
                      backgroundColor: !task.done ? "var(--color-fundal)" : "var(--color-smallbox)",
                      borderColor: "var(--color-darkgreen)",
                      color: "var(--color-darkgreen)"
                    }}
                    disabled={task.done}
                  >
                    {task.done ? "Done" : "Done?"}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Yesterday's tasks */}
          <section
            className="bg-bigbox rounded-2xl shadow-md p-8 border border-smallbox flex-1"
            style={{ backgroundColor: "var(--color-bigbox)", borderColor: "var(--color-smallbox)" }}
          >
            <h2
              className="text-3xl font-extrabold mb-8 text-right"
              style={{ color: "var(--color-darkgreen)" }}
            >
              Yesterday's Tasks <span className="text-xl">📅</span>
            </h2>
            <ul className="space-y-5">
              {yesterdayTasks.map((task, idx) => (
                <li
                  key={idx}
                  className="flex items-center bg-earth border border-smallbox rounded-xl shadow-sm px-6 py-5 w-full"
                  style={{
                    backgroundColor: "var(--color-earth)",
                    borderColor: "var(--color-smallbox)",
                    color: "var(--color-darkgreen)"
                  }}
                >
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold">{task.category}: </span>
                      {task.text}
                    </div>
                    <span
                      className="ml-0 sm:ml-6 mt-2 sm:mt-0 text-base font-semibold flex-shrink-0 flex items-center justify-end whitespace-nowrap"
                      style={{ minWidth: "120px" }}
                    >
                      Reward: {task.points}
                      <span className="ml-1" role="img" aria-label="EcoPoints">
                        🤑
                      </span>
                    </span>
                  </div>
                  <span
                    className={`font-bold ml-4 ${task.done ? "" : "opacity-40"}`}
                    style={{ color: "var(--color-darkgreen)" }}
                  >
                    {task.done ? "Done" : "Not done"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
