const habitForm = document.getElementById("habit-form");
const habitList = document.getElementById("habit-list");
let habits = JSON.parse(localStorage.getItem("habits")) || [];

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("habit-name").value;
  const frequency = document.getElementById("habit-frequency").value;

  const habit = {
    id: Date.now(),
    name,
    frequency,
    entries: [],
    createdAt: new Date().toISOString(),
  };

  habits.push(habit);
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
  habitForm.reset();
});

function renderHabits() {
  habitList.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  habits.forEach((habit) => {
    const div = document.createElement("div");

    const isCompletedToday = habit.entries.includes(today);

    const name = document.createElement("strong");
    name.textContent = `${habit.name} (${habit.frequency})`;

    const status = document.createElement("span");
    status.textContent = isCompletedToday ? " ✅" : "";

    const checkBtn = document.createElement("button");
    checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", () => markComplete(habit.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteHabit(habit.id));

    div.appendChild(name);
    div.appendChild(status);
    div.appendChild(checkBtn);
    div.appendChild(deleteBtn);
    habitList.appendChild(div);
  });
}


function markComplete(id) {
  const habit = habits.find(h => h.id === id);
  const today = new Date().toISOString().split("T")[0];
  if (!habit.entries.includes(today)) {
    habit.entries.push(today);
  }
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

renderHabits();
