import React from "react";

export default function Profile() {
  const user = { name: "Jane Doe", email: "jane@example.com", totalHabits: 42, streak: 7 };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="bg-white p-6 rounded shadow-md space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Total Habits Completed:</strong> {user.totalHabits}</p>
        <p><strong>Current Streak:</strong> {user.streak} days</p>
      </div>
    </main>
  );
}
