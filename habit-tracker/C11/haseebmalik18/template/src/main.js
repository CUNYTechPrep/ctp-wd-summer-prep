let habits = loadHabits();
let currentEditId = null;

function init() {
  bindEvents();
  render();
}

function bindEvents() {
  document.getElementById('habitForm').addEventListener('submit', handleAddHabit);
  document.getElementById('habitFrequency').addEventListener('change', handleFrequencyChange);
  document.getElementById('editHabitFrequency').addEventListener('change', handleEditFrequencyChange);
  document.getElementById('editForm').addEventListener('submit', handleEditHabit);
  document.querySelector('.close-btn').addEventListener('click', closeDialog);
  document.querySelector('.cancel-btn').addEventListener('click', closeDialog);
  document.getElementById('editDialog').addEventListener('click', handleDialogClick);
}

function handleAddHabit(e) {
  e.preventDefault();
  const name = document.getElementById('habitName').value.trim();
  const frequency = document.getElementById('habitFrequency').value;
  const customDays = document.getElementById('customDays').value;

  if (!name || !frequency) return;

  const habit = {
    id: Date.now().toString(),
    name,
    frequency,
    customDays: frequency === 'custom' ? parseInt(customDays) : null,
    createdAt: new Date().toISOString(),
    completions: {}
  };

  habits.push(habit);
  saveHabits();
  render();
  resetForm();
  showToast('Habit added successfully!');
}

function handleFrequencyChange(e) {
  const customGroup = document.getElementById('customFrequencyGroup');
  if (e.target.value === 'custom') {
    customGroup.classList.remove('hidden');
  } else {
    customGroup.classList.add('hidden');
  }
}

function handleEditFrequencyChange(e) {
  const customGroup = document.getElementById('editCustomFrequencyGroup');
  if (e.target.value === 'custom') {
    customGroup.classList.remove('hidden');
  } else {
    customGroup.classList.add('hidden');
  }
}

function handleEditHabit(e) {
  e.preventDefault();
  const name = document.getElementById('editHabitName').value.trim();
  const frequency = document.getElementById('editHabitFrequency').value;
  const customDays = document.getElementById('editCustomDays').value;

  if (!name || !frequency) return;

  const habitIndex = habits.findIndex(h => h.id === currentEditId);
  if (habitIndex !== -1) {
    habits[habitIndex] = {
      ...habits[habitIndex],
      name,
      frequency,
      customDays: frequency === 'custom' ? parseInt(customDays) : null
    };
    saveHabits();
    render();
    closeDialog();
    showToast('Habit updated successfully!');
  }
}

function handleDialogClick(e) {
  if (e.target === document.getElementById('editDialog')) {
    closeDialog();
  }
}

function openEditDialog(habitId) {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;

  currentEditId = habitId;
  document.getElementById('editHabitName').value = habit.name;
  document.getElementById('editHabitFrequency').value = habit.frequency;
  
  if (habit.frequency === 'custom') {
    document.getElementById('editCustomFrequencyGroup').classList.remove('hidden');
    document.getElementById('editCustomDays').value = habit.customDays;
  } else {
    document.getElementById('editCustomFrequencyGroup').classList.add('hidden');
  }

  document.getElementById('editDialog').classList.remove('hidden');
}

function closeDialog() {
  document.getElementById('editDialog').classList.add('hidden');
  currentEditId = null;
}

function deleteHabit(habitId) {
  if (confirm('Are you sure you want to delete this habit?')) {
    habits = habits.filter(h => h.id !== habitId);
    saveHabits();
    render();
    showToast('Habit deleted successfully!');
  }
}

function toggleCompletion(habitId) {
  const today = getDateString(new Date());
  const habit = habits.find(h => h.id === habitId);
  
  if (!habit) return;

  if (habit.completions[today]) {
    delete habit.completions[today];
    showToast('Habit marked as incomplete!');
  } else {
    habit.completions[today] = true;
    showToast('Great job! Habit completed!');
  }

  saveHabits();
  render();
}

function getDateString(date) {
  return date.toISOString().split('T')[0];
}

function getCurrentStreak(habit) {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = getDateString(currentDate);
    if (!habit.completions[dateStr]) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

function getLongestStreak(habit) {
  const completionDates = Object.keys(habit.completions)
    .filter(date => habit.completions[date])
    .sort();

  if (completionDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completionDates.length; i++) {
    const prevDate = new Date(completionDates[i - 1]);
    const currDate = new Date(completionDates[i]);
    const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function getCompletionRate(habit) {
  const createdDate = new Date(habit.createdAt);
  const today = new Date();
  const daysSinceCreated = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
  
  const completedDays = Object.keys(habit.completions).filter(date => habit.completions[date]).length;
  
  let targetDays = daysSinceCreated;
  if (habit.frequency === 'weekly') {
    targetDays = Math.floor(daysSinceCreated / 7);
  } else if (habit.frequency === 'custom') {
    targetDays = Math.floor((daysSinceCreated / 7) * habit.customDays);
  }

  return targetDays > 0 ? Math.round((completedDays / targetDays) * 100) : 0;
}

function getFrequencyText(habit) {
  switch (habit.frequency) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'custom': return `${habit.customDays} times per week`;
    default: return habit.frequency;
  }
}

function isCompletedToday(habit) {
  const today = getDateString(new Date());
  return !!habit.completions[today];
}

function render() {
  const emptyState = document.getElementById('emptyState');
  const habitsGrid = document.getElementById('habitsGrid');

  if (habits.length === 0) {
    emptyState.classList.remove('hidden');
    habitsGrid.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  habitsGrid.classList.remove('hidden');

  habitsGrid.innerHTML = habits.map(habit => {
    const currentStreak = getCurrentStreak(habit);
    const longestStreak = getLongestStreak(habit);
    const completionRate = getCompletionRate(habit);
    const isCompleted = isCompletedToday(habit);

    return `
      <div class="habit-card">
        <div class="habit-header">
          <div class="habit-info">
            <h3>${habit.name}</h3>
            <div class="habit-frequency">${getFrequencyText(habit)}</div>
          </div>
          <div class="habit-actions">
            <button class="btn btn-secondary btn-small" onclick="openEditDialog('${habit.id}')">Edit</button>
            <button class="btn btn-danger btn-small" onclick="deleteHabit('${habit.id}')">Delete</button>
          </div>
        </div>

        <div class="habit-stats">
          <div class="stat-item">
            <div class="stat-value">${currentStreak}</div>
            <div class="stat-label">Current Streak</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${longestStreak}</div>
            <div class="stat-label">Longest Streak</div>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-header">
            <span>Progress</span>
            <span class="completion-status ${isCompleted ? 'completed' : 'not-completed'}">
              ${isCompleted ? 'Completed Today' : 'Not Completed'}
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${completionRate}%"></div>
          </div>
          <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} complete-btn" 
                  onclick="toggleCompletion('${habit.id}')">
            ${isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function resetForm() {
  document.getElementById('habitForm').reset();
  document.getElementById('customFrequencyGroup').classList.add('hidden');
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function saveHabits() {
  try {
    localStorage.setItem('habits', JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits:', error);
    showToast('Failed to save data', true);
  }
}

function loadHabits() {
  try {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load habits:', error);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', init);