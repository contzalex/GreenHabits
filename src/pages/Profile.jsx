import { useEffect, useState } from "react";
import { db } from "../firebase/firebase_config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth(); // logged-in user
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("Nu există date pentru acest utilizator!");
        }
      } catch (error) {
        console.error("Eroare la citirea datelor din Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const toggleHabit = (id) => {
    if (!userData?.habits) return;
    setUserData((prev) => ({
      ...prev,
      habits: prev.habits.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit
      ),
    }));
  };

  if (loading) {
    return <div className="text-center mt-10 text-darkgreen">Se încarcă profilul...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-10 text-red-600">Nu s-au găsit datele utilizatorului.</div>;
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Profile Section */}
      <section className="bg-bigbox p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-darkgreen">Profile</h2>
        <p className="text-darkgreen"><strong>Name:</strong> {userData.username}</p>
        <p className="text-darkgreen"><strong>Email:</strong> {user.email}</p>
        <p className="text-darkgreen"><strong>Puncte:</strong> {userData.points}</p>
        <p className="text-darkgreen">
          <strong>Total Habits Completed:</strong>{" "}
          {userData.completedHabits?.length || 0}
        </p>
      </section>

      {/* Habits Section */}
      {userData.habits && userData.habits.length > 0 && (
        <section className="bg-bigbox p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-darkgreen">Your Habits</h3>
          <ul className="space-y-4">
            {userData.habits.map((habit) => (
              <li
                key={habit.id}
                className={`flex items-center justify-between p-3 border rounded shadow-sm transition ${
                  habit.done ? "bg-smallbox text-darkgreen" : "bg-earth"
                }`}
              >
                <span className="text-darkgreen">{habit.name}</span>
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    habit.done
                      ? "bg-beige text-darkgreen"
                      : "bg-fundal text-darkgreen hover:bg-darkgreen hover:text-white"
                  }`}
                >
                  {habit.done ? "Done" : "Mark Done"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
