// Global variable storing habits
let habits = [];

// Intialize the application
function initHabitTracker() {
    habits = loadHabits();
    renderHabits();
    bindEvents();
    updateStats();
}

// Loads habits from storage
function loadHabits () {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved): [];
}

// Saves habits to local storage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Adds a new habit
function addHabit(name, frequency) {
    const newHabit = {
        id: Date.now(),
        name: name,
        icon: getRandomIcon(),
        streak: 0,
        frequency: frequency,
        completedToday: false,
        lastCompleted: null,
        totalCompleted: 0
    }

    habits.push(newHabit)
    renderHabits()
    updateStats();
}

// Get a random icon for new habits
function getRandomIcon() {
    const icons = ['🎯', '💪', '📖', '🏃', '🧘', '💧', '🎨', '🎵', '🍎', '✍️'];
    return icons[Math.floor(Math.random() * icons.length)];
}

function markHabitComplete(habitId) {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return;

    const today = new Date().toDateString();

    if(habit.completedToday && habit.lastCompleted === today) {
        alert('You already completed this today.');
        return;
    }

    // Mark as completed 
    habit.completedToday = true;
    habit.lastCompleted = today;
    habit.streak += 1;
    habit.totalCompleted += 1;

    saveHabits();
    renderHabits();
    updateStats();
}

// Render (makes the habits visible) to the usere
function renderHabits() {
    const container = document.querySelector('.habit-container');
    if(!container) return;

    container.innerHTML = '';

    habits.forEach(habit => {
        const habitCard = createHabitCard(habit);
        container.appendChild(habitCard)

    })
}

// Create a habit card element
function createHabitCard(habit) {
    const card = document.createElement('div');
    const completionPercentage = Math.min(100, (habit.totalCompleted / 100) * 100);
    const isCompleted = habit.completedToday && habit.lastCompleted === new Date().toDateString();
    
    card.className = `habit-card ${habit.streak >= 10 ? 'featured' : ''}`;
    card.innerHTML = `
        <div class="habit-header">
            <div class="habit-icon">${habit.icon}</div>
            <button class="delete-btn" data-habit-id="${habit.id}" title="Delete habit">×</button>
        </div>
        <h3>${habit.name}</h3>
        <p class="habit-streak">${habit.streak} day streak</p>
        <div class="habit-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${completionPercentage}%"></div>
            </div>
            <span class="progress-text">${Math.round(completionPercentage)}% complete</span>
        </div>
        <div class="habit-actions">
            <button class="complete-btn ${isCompleted ? 'completed' : ''}" 
                    data-habit-id="${habit.id}"
                    ${isCompleted ? 'disabled' : ''}>
                ${isCompleted ? '✓ Completed Today' : 'Mark Complete'}
            </button>
        </div>
    `;

    return card;
}

// Delete a habit
function deleteHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
        // Remove habit from array
        habits = habits.filter(h => h.id !== habitId);
        
        saveHabits();
        renderHabits();
        updateStats();

    }
}

// Update statistics
function updateStats() {
    const totalHabitsEl = document.querySelector('dd:nth-of-type(1)');
    const longestStreakEl = document.querySelector('dd:nth-of-type(2)');

    if (totalHabitsEl) {
        totalHabitsEl.textContent = habits.length;
    }

    if (longestStreakEl) {
        const longestStreak = Math.max(...habits.map(h => h.streak), 0);
        longestStreakEl.textContent = `${longestStreak} days`;
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('habit-name');
    const frequencySelect = document.getElementById('habit-frequency');
    
    if (nameInput.value.trim()) {
        addHabit(nameInput.value.trim(), frequencySelect.value);
        nameInput.value = '';
    }
}

// Handle button clicks
function handleButtonClick(e) {
    if (e.target.classList.contains('complete-btn') && !e.target.disabled) {
        const habitId = parseInt(e.target.dataset.habitId);
        markHabitComplete(habitId);
    }
    if (e.target.classList.contains('delete-btn')) {
        const habitId = parseInt(e.target.dataset.habitId);
        deleteHabit(habitId);
    }
}


// Check if reset is needed
function checkDailyReset() {
    const today = new Date().toDateString();
    let needsUpdate = false;

    habits.forEach(habit => {
        if (habit.lastCompleted && habit.lastCompleted !== today) {
            habit.completedToday = false;
            needsUpdate = true;
        }
    });

    if (needsUpdate) {
        saveHabits();
        renderHabits();
    }
}

// Bind all event listeners
function bindEvents() {
    // Handle habit form submission
    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
        habitForm.addEventListener('submit', handleFormSubmit);
    }

    // Handle complete button clicks (using event delegation)
    document.addEventListener('click', handleButtonClick);

    // Reset completion status daily
    setInterval(checkDailyReset, 60000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initHabitTracker);