const form = document.getElementById('habit_form');

// Load habits from localStorage
const loadHabits = () => JSON.parse(localStorage.getItem('habits')) || [];

// Save habits to localStorage
const saveHabits = (habits) => localStorage.setItem('habits', JSON.stringify(habits));

let habits = loadHabits();

// Utility to get today’s date as YYYY-MM-DD
const getToday = () => new Date().toISOString().slice(0, 10);

// Handle form submission
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const data = new FormData(event.target);

  const habit = {
    id: Date.now().toString(), // unique ID
    name: data.get('habit_name'),
    targetStreak: Number(data.get('target_streak')),
    history: [] // store completed dates here
  };

  habits.push(habit);
  saveHabits(habits);
  renderHabits(habits);
  form.reset();
});

// Render habit list with "Done Today" button
const renderHabits = (habits) => {
  const habitList = document.getElementById('habit_list');
  if (!habitList) {
    console.error('habit_list element not found');
    return;
  }
  habitList.innerHTML = habits.map(habit => {
    const historyText = habit.history.length > 0 ? habit.history.join(', ') : 'No completions yet';
    return `
      <li>
        <strong>${habit.name}</strong> (${habit.targetStreak} days)
        <button onclick="markComplete('${habit.id}')">Done Today</button>
        <button onclick="editHabit('${habit.id}')">Edit</button>
        <button onclick="deleteHabit('${habit.id}')">Delete</button>
        <span>✅ ${habit.history.length} days completed</span>
        <div style="margin-top:5px; font-size:0.9em; color: lightblue;">
          <strong>History:</strong> ${historyText}
        </div>
      </li>
    `;
  }).join('');
};

// Mark habit as complete
window.markComplete = (habitId) => {
  const today = getToday();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;

  if (!habit.history.includes(today)) {
    habit.history.push(today);
    console.log(`Marked ${habit.name} as complete for ${today}`);
  } else {
    console.log(`${habit.name} already completed today`);
  }

  saveHabits(habits);
  renderHabits(habits);
};

// Delete habit
window.deleteHabit = (habitId) => {
  habits = habits.filter(h => h.id !== habitId);
  saveHabits(habits);
  renderHabits(habits);
};

// Edit habit
window.editHabit = (habitId) => {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;

  // Fill form with existing values
  document.getElementById('habit_name').value = habit.name;
  document.getElementById('target_streak').value = habit.targetStreak;

  // Remove old habit from list temporarily
  habits = habits.filter(h => h.id !== habitId);
  saveHabits(habits);
  renderHabits(habits);
};

// Render initial empty list to verify the container shows up
renderHabits(habits);