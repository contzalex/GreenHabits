// src/services/userDataService.js
import { db } from "../firebase/firebase_config";
import { doc, getDoc, updateDoc,arrayUnion, increment } from "firebase/firestore";

/** Obține datele utilizatorului */
export async function getUserData(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/** Actualizează un task */
export async function updateTaskStatus(uid, dateKey, taskIndex, taskData) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    [`tasks.${dateKey}.${taskIndex}`]: taskData
  });
}

/** Marchează ziua ca finalizată */
export async function markDayComplete(uid, dateKey, pointsGained) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    [`calendarProgress.${dateKey}`]: true,
    points: increment(pointsGained)
  });
}

/** Resetează streak-ul sau îl incrementează */
export async function updateStreak(uid, newStreak) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { streak: newStreak });
}

export const addUserPoints = async (uid, points) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(points),
  });
};

// ✅ Marchează o zi verde (ecoDay)
export const addEcoDay = async (uid, day) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ecoDays: arrayUnion(day),
  });
};

// ✅ Adaugă habit completat
export const addCompletedHabit = async (uid, habitId) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    completedHabits: arrayUnion(habitId),
  });
};

export const updateUserDailyProgress = async (uid, task) => {
  if (!uid || !task) return;

  const userRef = doc(db, "users", uid);
  const todayKey = new Date().toISOString().split("T")[0]; // ex: "2025-11-08"

  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() || {};

  const newCalendarProgress = {
    ...userData.calendarProgress,
    [todayKey]: [
      ...(userData.calendarProgress?.[todayKey] || []),
      { text: task.text, points: task.points, category: task.category }
    ]
  };

  const newPoints = (userData.points || 0) + task.points;

  await updateDoc(userRef, {
    calendarProgress: newCalendarProgress,
    points: newPoints
  });
};

/*
export async function redeemReward(uid, rewardName, cost) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    points: increment(-cost),
    redeemHistory: arrayUnion({
      rewardName,
      cost,
      redeemedAt: new Date().toISOString()
    })
  });
}
*/