// state
let habits = loadHabits();


// elements
const habitForm = document.getElementById('habit_form');
const habitList = document.getElementById('habit_list');
const dateStartedInput = document.getElementById('date_started');

if (dateStartedInput && !dateStartedInput.value) {
  dateStartedInput.value = todayKey();
} 

// event listeners
habitForm.addEventListener('submit', handleAddHabit);
habitList.addEventListener('click', (event) => {
  const index = Number(event.target.getAttribute('data-index'));
  if (isNaN(index)) return; // safety

  if (event.target.classList.contains('toggle_today')) {
    handleToggleToday(index);
  } 
  else if (event.target.classList.contains('delete_habit')) {
    handleDeleteHabit(index);
  }
  else if (event.target.classList.contains('edit_habit')) {
    habits[index].editing = true;
    renderHabits();
  }
  else if (event.target.classList.contains('cancel_edit')) {
    habits[index].editing = false;
    renderHabits();
  }
  else if (event.target.classList.contains('save_edit')) {
    const name = document.querySelector(`.edit_name[data-index="${index}"]`).value.trim();
    const category = document.querySelector(`.edit_category[data-index="${index}"]`).value.trim();
    const target = Number(document.querySelector(`.edit_target[data-index="${index}"]`).value);

    habits[index].name = name || habits[index].name;
    habits[index].category = category || habits[index].category;
    habits[index].targetStreak = isNaN(target) ? habits[index].targetStreak : target;

    habits[index].editing = false;
    saveHabits();
    renderHabits();
  }
});

// loads habits from local storage
function loadHabits() {
  try {
    const stored = localStorage.getItem('habits');
    const arr = stored ? JSON.parse(stored) : [];
    arr.forEach(h => {
      if (!h.logs) h.logs = {};
      if (!h.dateStarted) h.dateStarted = todayKey();
    });
    return arr;
  } catch {
    return [];
  }
}
// saves habits to local storage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
} 


// core functions

// add new habit
function handleAddHabit(event) {
  event.preventDefault();
  const data = new FormData(event.target);

  const habit = {
    name: String(data.get('habit_name') || '').trim(),
    category: String(data.get('habit_category') || 'uncategorized'),
    targetStreak: Number(data.get('target_streak') || 0),
    dateStarted: String(data.get('date_started') || todayKey()),
    logs: {}
  };
  if (!habit.name) return;

  habits.push(habit);
  saveHabits();
  renderHabits();
  habitForm.reset();
  console.log(habit) // to check developer tools for debugging  
  if (dateStartedInput) dateStartedInput.value = todayKey();

}

// toggles if habit is completed today
function handleToggleToday(index) {
  const habit = habits[index];
  if (!habit) return;
  const key = todayKey();
  habit.logs[key] = !habit.logs[key];
  saveHabits();
  renderHabits();
}

// deletes habit
function handleDeleteHabit(index) {
  habits.splice(index, 1);
  saveHabits();
  renderHabits();
}

// renders habits
function renderHabits() {
  habitList.innerHTML = habits
    .map((habit, index) => {
      const doneToday = !!habit.logs[todayKey()];
      const currentStreak = calculateCurrentStreak(habit);
      const longestStreak = calculateLongestStreak(habit);

      if (habit.editing) {
        return `
          <li>
            <label for="edit_name">Habit Name:</label>
            <input data-index="${index}" class="edit_name" value="${habit.name}">
            <label for="edit_category">Category:</label>
            <select data-index="${index}" class="edit_category">
              <option value="Health" ${habit.category === "Health" ? "selected" : ""}>Health</option>
              <option value="Productivity" ${habit.category === "Productivity" ? "selected" : ""}>Productivity</option>
              <option value="Learning" ${habit.category === "Learning" ? "selected" : ""}>Learning</option>
            </select> 
            <label for="edit_target">Target:</label>
            <input data-index="${index}" class="edit_target" type="number" value="${habit.targetStreak}">
            <button data-index="${index}" class="save_edit">Save</button>
            <button data-index="${index}" class="cancel_edit">Cancel</button>
          </li>
        `;
      } else {
        return `
          <li>
            <strong>${habit.name}</strong> | (${habit.category})
            | Target: ${habit.targetStreak} | Started: ${habit.dateStarted}<br>
             Current Streak: ${currentStreak} |  Longest Streak: ${longestStreak}
            <br>
            <button data-index="${index}" class="toggle_today">
              ${doneToday ? 'Undo Today' : 'Done Today'}
            </button>
            <button data-index="${index}" class="edit_habit">Edit</button>
            <button data-index="${index}" class="delete_habit">Delete</button>
          </li>
        `;
      }
    })
    .join('');
}

// used for setting date in YYYY-MM-DD format
function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// streak helpers
function calculateCurrentStreak(habit) {
  const logs = habit.logs || {};
  let streak = 0;
  let d = new Date();

  while (logs[todayKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1); 
  }
  return streak;
}

// calculates longest streak by seeing if the current date is the previous date + 1
function calculateLongestStreak(habit) {
  const logs = habit.logs || {};
  const dates = Object.keys(logs).filter(day => logs[day]).sort();
  
  let max = 0, current = 0, prev = null;
  
  for (const day of dates) {
    if (!prev) {
      current = 1;
    } else {
      const prevDate = new Date(prev);
      prevDate.setDate(prevDate.getDate() + 1);
      current = (todayKey(prevDate) === day) ? current + 1 : 1;
    }
    max = Math.max(max, current);
    prev = day;
  }
  
  return max;
}


renderHabits();