const habitForm = document.getElementById('habit-form');
const habitNameInput = document.getElementById('habit-name');
const habitList = document.getElementById('habit-list');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach(habit => {
    const div = document.createElement('div');
    div.className = 'habit';

    const completedToday = habit.dates.includes(today());
    div.innerHTML = `
      <strong>${habit.name}</strong><br/>
      Current streak: ${getStreak(habit)} days<br/>
      <button onclick="markComplete('${habit.id}')" ${completedToday ? 'disabled' : ''}>
        ${completedToday ? 'Done Today' : 'Mark Done'}
      </button>
      <button onclick="deleteHabit('${habit.id}')">Delete</button>
    `;
    habitList.appendChild(div);
  });
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function getStreak(habit) {
  const sortedDates = habit.dates.slice().sort().reverse();
  let streak = 0;
  let currentDate = new Date(today());

  for (let date of sortedDates) {
    if (date === currentDate.toISOString().split('T')[0]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function markComplete(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit.dates.includes(today())) {
    habit.dates.push(today());
    saveHabits();
    renderHabits();
  }
}

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveHabits();
  renderHabits();
}

habitForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = habitNameInput.value.trim();
  if (!name) return;
  const newHabit = {
    id: Date.now().toString(),
    name,
    dates: []
  };
  habits.push(newHabit);
  saveHabits();
  renderHabits();
  habitForm.reset();
});

renderHabits();
