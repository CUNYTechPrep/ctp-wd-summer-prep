import "./index.css";
import HomePage from "./Pages/HomePage";
import NavBar from "./components/NavBar";
import StatisticsPage from "./Pages/StatisticsPage";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Habit, StoredHabit } from "./components/HabitCard";


function App() {
  let [habits, setHabits] = useState<Habit[]>(loadHabits());
  function loadHabits() {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      return JSON.parse(savedHabits).map((storedHabit: StoredHabit) => ({
        ...storedHabit,
        dateAdded: new Date(storedHabit.dateAdded),
      }));
    }
    return [];
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={<HomePage habits={habits} setHabits={setHabits} />}
        />
        <Route
          path="/statistics"
          element={<StatisticsPage habits={habits} />}
        />
      </Routes>
    </>
  );
}


export default App;
