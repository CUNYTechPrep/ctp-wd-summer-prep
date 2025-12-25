
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let habitEntries = JSON.parse(localStorage.getItem('habitEntries')) || [];

// DOM elements
const form = document.getElementById('habit_form');
const habitList = document.getElementById('habit_list');
const totalHabitsEl = document.getElementById('totalHabits');
const activeStreaksEl = document.getElementById('activeStreaks');

// Initialize the app
renderStats();
renderHabits();

// Form submission handler
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const newHabit = {
    id: Date.now().toString(),
    name: formData.get('habit_name'),
    targetStreak: parseInt(formData.get('target_streak')),
    createdAt: new Date().toISOString(),
    isActive: true
  };

  habits.push(newHabit);
  saveData();
  renderStats();
  renderHabits();
  form.reset();
});

// Render all habits
function renderHabits() {
  habitList.innerHTML = '';
  
  if (habits.length === 0) {
    habitList.innerHTML = '<p>No habits yet. Add one to get started!</p>';
    return;
  }
  
  habits.forEach(habit => {
    const habitEl = document.createElement('div');
    habitEl.className = 'habit-card';
    habitEl.dataset.id = habit.id;
    
    const entries = habitEntries.filter(entry => entry.habitId === habit.id);
    const currentStreak = calculateCurrentStreak(entries);
    
    habitEl.innerHTML = `
      <div class="habit-header">
        <h3>${habit.name}</h3>
        <div>Streak: ${currentStreak}/${habit.targetStreak}</div>
      </div>
      
      <div class="habit-actions">
        <button class="delete-btn" data-id="${habit.id}">Delete</button>
      </div>
      
      <div class="calendar" id="calendar-${habit.id}"></div>
    `;
    
    habitList.appendChild(habitEl);
    
    // Render calendar for this habit
    renderCalendar(habit, entries);
    
    // Add delete event listener
    habitEl.querySelector('.delete-btn').addEventListener('click', () => {
      habits = habits.filter(h => h.id !== habit.id);
      habitEntries = habitEntries.filter(e => e.habitId !== habit.id);
      saveData();
      renderStats();
      renderHabits();
    });
  });
}

// Render calendar for a habit
function renderCalendar(habit, entries) {
  const calendarEl = document.getElementById(`calendar-${habit.id}`);
  calendarEl.innerHTML = '';
  
  // Show last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    
    const entry = entries.find(e => e.date === dateStr);
    const isCompleted = entry ? entry.completed : false;
    
    const dayEl = document.createElement('div');
    dayEl.className = `day ${isCompleted ? 'completed' : ''}`;
    dayEl.textContent = date.getDate();
    dayEl.title = dateStr;
    
    dayEl.addEventListener('click', () => toggleCompletion(habit.id, dateStr));
    calendarEl.appendChild(dayEl);
  }
}

// Toggle completion status
function toggleCompletion(habitId, dateStr) {
  let entry = habitEntries.find(e => e.habitId === habitId && e.date === dateStr);
  
  if (entry) {
    entry.completed = !entry.completed;
  } else {
    entry = {
      id: Date.now().toString(),
      habitId,
      date: dateStr,
      completed: true
    };
    habitEntries.push(entry);
  }
  
  saveData();
  renderStats();
  renderHabits();
}

// Calculate current streak
function calculateCurrentStreak(entries) {
  const completedDates = entries.filter(e => e.completed).map(e => e.date).sort();
  
  if (completedDates.length === 0) return 0;
  
  // Check if today is completed
  const today = formatDate(new Date());
  if (!completedDates.includes(today)) return 0;
  
  let streak = 1;
  for (let i = completedDates.length - 1; i > 0; i--) {
    const prevDate = new Date(completedDates[i - 1]);
    const currDate = new Date(completedDates[i]);
    
    if ((currDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Render statistics
function renderStats() {
  totalHabitsEl.textContent = habits.length;
  
  // Calculate active streaks (habits with current streak > 0)
  let activeStreaks = 0;
  habits.forEach(habit => {
    const entries = habitEntries.filter(e => e.habitId === habit.id);
    if (calculateCurrentStreak(entries) > 0) {
      activeStreaks++;
    }
  });
  
  activeStreaksEl.textContent = activeStreaks;
}

// Helper functions
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('habitEntries', JSON.stringify(habitEntries));
}