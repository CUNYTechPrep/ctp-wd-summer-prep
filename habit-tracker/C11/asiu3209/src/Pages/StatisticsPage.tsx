import { Habit } from "../components/HabitCard";

interface StatisticsPageProps {
  habits: Habit[];
}

function StatisticsPage({ habits }: StatisticsPageProps) {
  return (
    <ul className="completed-habits-list">
      <li className="completed-habit-header">
        <span className="completed-habit-item-span">Habit Name</span>
        <span className="completed-habit-item-span">Date Added</span>
        <span className="completed-habit-item-span">Date Completed</span>
        <span className="completed-habit-item-span">Frequency</span>
      </li>
      {habits.map((habit) =>
        habit.progress === habit.frequency ? (
          <li key={habit.id} className="completed-habit-item">
            <span className="completed-habit-item-span">{habit.name}</span>
            <span className="completed-habit-item-span">
              {habit.dateAdded.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="completed-habit-item-span">
              {habit.dateCompleted
                ? new Date(habit.dateCompleted).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : ""}
            </span>
            <span className="completed-habit-item-span">{habit.frequency}</span>
          </li>
        ) : null
      )}
    </ul>
  );
}

export default StatisticsPage;
