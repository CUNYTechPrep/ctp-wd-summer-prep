const form = document.getElementById("habit_form");
const habitList = document.getElementById("habit_list");

const habits = (() => {
  try { return JSON.parse(localStorage.getItem("habits")) ?? []; }
  catch { return []; }
})();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(event.target);
  const habit = {
    habitName: data.get('habit_name'),
    targetStreak: Number(data.get('target_streak')),
    habitFreq: data.get('timeframe'),
    completed: false
  };

  habits.push(habit);
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
  form.reset();
});

const renderHabits = () => {
  habitList.innerHTML = habits.map((habit, i) => `
    <li>
      <input id = "check" type="checkbox" ${habit.completed ? "checked" : ""} />
      ${habit.habitName} ${habit.habitFreq} — Target Streak: ${habit.targetStreak} —
      Current Streak: <span class="clicks">0</span>
      <button type="button" class="delete_btn" data-index="${i}">Delete</button>
    </li>
  `).join('');
};

renderHabits();

// Event delegation for delete
habitList.addEventListener('click', (event) => {
  const btn = event.target.closest('button.delete_btn');
  if (!btn) return;

  const index = Number(btn.dataset.index);
  habits.splice(index, 1); // remove from array
  localStorage.setItem("habits", JSON.stringify(habits)); // persist
  renderHabits(); // re-render UI
});

// Keep UI in sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'habits') {
    try { habits.splice(0, habits.length, ...JSON.parse(e.newValue) ?? []); }
    catch { habits.splice(0, habits.length); }
    renderHabits();
  }
});
