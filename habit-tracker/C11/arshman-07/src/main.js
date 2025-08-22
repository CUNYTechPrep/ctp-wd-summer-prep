const form = document.getElementById("habit_form");
const habitListEl = document.getElementById("habit_list");


let habits = JSON.parse(localStorage.getItem("habits")) || [];


function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}


function renderHabits() {
  habitListEl.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "habit-item";

    
    const textSpan = document.createElement("span");
    textSpan.textContent = `${habit.habitName} — Streak: ${habit.streak}/${habit.targetStreak}`;

    
    const btnContainer = document.createElement("div");

    
    const incBtn = document.createElement("button");
    incBtn.textContent = "+1";
    incBtn.addEventListener("click", () => {
      if (habit.streak < habit.targetStreak) {
        habit.streak++;
        saveHabits();
        renderHabits();
      }
    });

    
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      const newName = prompt("Enter new habit name:", habit.habitName);
      const newTarget = prompt("Enter new target streak:", habit.targetStreak);

      if (newName !== null && newName.trim() !== "") {
        habit.habitName = newName.trim();
      }
      if (newTarget !== null && !isNaN(newTarget) && Number(newTarget) > 0) {
        habit.targetStreak = Number(newTarget);
      }
      saveHabits();
      renderHabits();
    });

    
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete";
    delBtn.addEventListener("click", () => {
      habits.splice(index, 1);
      saveHabits();
      renderHabits();
    });

    btnContainer.appendChild(incBtn);
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);

    li.appendChild(textSpan);
    li.appendChild(btnContainer);

    habitListEl.appendChild(li);
  });
}


form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(event.target);

  const habit = {
    habitName: data.get("habit_name"),
    targetStreak: parseInt(data.get("target_streak")),
    streak: 0 // start streak at zero
  };

  habits.push(habit);
  saveHabits();
  renderHabits();
  form.reset();
});


renderHabits();

