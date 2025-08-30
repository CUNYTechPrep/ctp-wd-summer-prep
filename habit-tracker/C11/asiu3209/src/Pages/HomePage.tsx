import NavBar from "../components/NavBar";
import HabitForm from "../components/HabitForm";
import HabitCard, { FormHabit, Habit } from "../components/HabitCard";
import { useEffect } from "react";
//Prop used for HomePage function input
type HabitStorageProps = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};
function HomePage({ habits, setHabits }: HabitStorageProps) {

  //Adds new Habit into useState
  function addHabit(newHabit: FormHabit) {
    const processHabit: Habit = {
      ...newHabit,
      id: Date.now() + Math.random(), // Generate a unique id
      dateAdded: new Date(),
    };
    setHabits((oldHabits) => [...oldHabits, processHabit]);
  }

  //prevHabits refer to state of habits currently
  function markComplete(id: number) {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const newProgress = Math.min(habit.progress + 1, habit.frequency);
          return {
            ...habit,
            progress: newProgress,
            dateCompleted:
              newProgress === habit.frequency
                ? new Date()
                : habit.dateCompleted,
          };
        }
        return habit;
      })
    );
  }

  function markIncomplete(id: number) {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, progress: 0 } : habit
      )
    );
  }
  //Deletes Habit Card from useState
  function deleteHabit(id: number) {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  }
  //JSON local storage to save habits
  function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
  }
  //SaveHabits function is runned when tuple habits is changed
  //1st parameter is what is being runned, 2nd parameter is when effect is runned.
  useEffect(() => {
    saveHabits();
  }, [habits]);

  return (
    <>
      <NavBar />
      <HabitForm addHabit={addHabit} />
      <div className="habits-list">
        {habits.map(
          (habit) =>
            habit.progress !== habit.frequency && (
              <HabitCard
                key={habit.id}
                habit={habit}
                markComplete={markComplete}
                markIncomplete={markIncomplete}
                deleteHabit={deleteHabit}
              />
            )
        )}
      </div>
    </>
  );
}

export default HomePage;
