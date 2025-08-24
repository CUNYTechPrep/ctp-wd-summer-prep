let habits = [];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('habit-form');
  const container = document.querySelector('.habit-container');

  loadHabits();
  renderHabits(container);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('habit-name').value.trim();
    const target = parseInt(document.getElementById('habit-target').value);

    // habit object
    if (name && target > 0) {
        addHabit({
        id: Date.now(),
        name,
        target,
        streak: 0,
        longestStreak: 0,
        completions: [],
        lastCompleted: null,
        skippedDate: null
      });
        form.reset();
        renderHabits(container);
        saveHabits();
    } 
    else {
      alert('Please fill in all fields correctly.');
    }
  });
});

// load habits from localStorage
function loadHabits() {
  const saved = localStorage.getItem('habits');
  habits = saved ? JSON.parse(saved) : [];

  habits.forEach(habit => {
    if (!habit.completions) habit.completions = [];
    if (!habit.longestStreak) habit.longestStreak = 0;
  });
}

// save habits to localStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// rendering habit cards
function renderHabits(container) {
  container.innerHTML = '';
  habits.forEach(habit => {
    container.appendChild(createHabitCard(habit));
  });
}

// generate habit cards as user add them
function createHabitCard(habit) {
  const card = document.createElement('div');
  card.className = 'habit-card';
  card.dataset.id = habit.id;

  const progressPercent = habit.target ? Math.min((habit.streak / habit.target) * 100, 100) : 0;

  // date format for "Last Completed" using helper
  const lastCompletedText = habit.lastCompleted
    ? `Last completed: ${formatDate(habit.lastCompleted)}`
    : 'Last completed: Never';

  // date format for history of completions
 const formattedCompletions = habit.completions && habit.completions.length > 0
  ? habit.completions.map(formatDate).join(', ')
  : 'No completions yet';

  card.innerHTML = `
    <div class="delete-icon" title="Delete Habit">
      <img src="images/trash-can-icon.png" alt="Delete" />
    </div>
    <div class="habit-header">
      <h3 class="habit-title">${habit.name}</h3>
      <div class="right-side">
      
        <button class="btn-edit">Edit</button>
      </div>
    </div>
    <div class="habit-body">
      <div class="streak-info">
        <span class="streak-number">${habit.streak}</span>
        <span class="streak-label">day(s) streak</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <p class="habit-time">${lastCompletedText}</p>
      <button class="btn-show-history">Show History</button>
    </div>
    <div class="habit-footer">
      <button class="btn-complete">Mark Complete</button>
      <button class="btn-skip">Skip Today</button>
    </div>
  `;

  // event listeners for "Show History" button
  const toggleBtn = card.querySelector('.btn-show-history');
  const historyDiv = card.querySelector('.habit-history');

  toggleBtn.addEventListener('click', () => {
    if (habit.completions && habit.completions.length > 0) {
      const formattedDates = habit.completions.map(formatDate).join(', ');
      alert(`Here's the completion history of ${habit.name}:\n${formattedDates}`);
    } 
    else {
      alert(`There's no completion history for ${habit.name}.`);
    }
});

   // event listeners for "Mark Complete" button
  card.querySelector('.btn-complete').addEventListener('click', () => {
    markHabitComplete(habit);
  });

  // event listeners for "Skip Today" button
  card.querySelector('.btn-skip').addEventListener('click', () => {
    skipHabitToday(habit);
  });

  // event listeners for "Edit" button
  card.querySelector('.btn-edit').onclick = () => editHabit(habit.id);

  // event listeners for trash button
  card.querySelector('.delete-icon').onclick = () => {
    if (confirm(`Are you sure you want to delete ${habit.name}? This action can't be undone.`)) {
      card.remove();
      deleteHabit(habit.id);
    }
  };

  return card;
}

// adding habit form functionality
function addHabit(habit) {
  habits.push(habit);
  saveHabits();
}

// "Mark Complete" button functionality
function markHabitComplete(habit) {
  const today = getLocalDateString();

  // ensure user can only click "Mark Complete" or "Skip Today" button once
  if (habit.lastCompleted === today) {
    alert("Whoops! Seems like you already completed this today!");
    return;
  }

  if (habit.skippedDate === today) {
    alert("Whoops! Seems like you skipped this today!");
    return;
  }

  habit.lastCompleted = today;
  habit.streak += 1;
  habit.skippedDate = null;

  // calculated streaks
  if (!habit.completions.includes(today)) {
    habit.completions.push(today);
  }

  if (habit.streak > habit.longestStreak) {
    habit.longestStreak = habit.streak;
  }

  saveHabits();
  renderHabits(document.querySelector('.habit-container'));
}

// trash icon functionality
function deleteHabit(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) {
    return;
  }
  habits = habits.filter(h => h.id !== id);
  saveHabits();
  renderHabits(document.querySelector('.habit-container'));
}

// edit habit and catgeory functionality
function editHabit(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) {
    return;
  }

  const newName = prompt('Edit habit name:', habit.name);

  if (newName !== null && newName !== '') {
    habit.name = newName;
  }

  const newTargetStr = prompt('Edit target streak (positive number):', habit.target);
  if (newTargetStr !== null) {
    const newTarget = parseInt(newTargetStr, 10);
    if (!isNaN(newTarget) && newTarget > 0) {
      habit.target = newTarget;
    } else {
      alert('Invalid target streak. It must be a positive number.');
    }
  }

  saveHabits();
  renderHabits(document.querySelector('.habit-container'));
}

// "Skip Today" functionality
function skipHabitToday(habit) {
  const today = getLocalDateString();

  if (!confirm(`Are you sure you want to skip ${habit.name}?`)) {
    return;
  }
  
  // ensure user can only click "Mark Complete" or "Skip Today" button once
  if (habit.skippedDate === today) {
    alert("Whoops! Seems like you already skipped this today!");
    return;
  }

  if (habit.lastCompleted === today) {
    alert("Whoops! Seems like you already completed this today!");
    return;
  }

  habit.skippedDate = today;
  habit.lastCompleted = today;

  saveHabits();
  renderHabits(document.querySelector('.habit-container'));
}

// date format "MM-DD-YY"
function formatDate(dateStr) {
  const d = new Date(dateStr);
  // if (isNaN(d)) return dateStr;

  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);

  return `${mm}/${dd}/${yy}`;
}

// get the current date
function getLocalDateString() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}