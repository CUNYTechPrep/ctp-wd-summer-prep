console.log('Script loaded!');


let habits = [];


const form = document.getElementById('habit-form');
const container = document.getElementById('habits-container');

// Load saved habits 
function loadHabits() {
    const saved = localStorage.getItem('habits');
    if (saved) {
        habits = JSON.parse(saved);
    }
    displayHabits();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Add new habit
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    
    const name = document.getElementById('habit-name').value;
    const target = document.getElementById('target-days').value;
    
    // Create a habit object
    const newHabit = {
        id: Date.now(), // ID using timestamp
        name: name,
        targetDays: target,
        completedDays: [],
        currentStreak: 0
    };
    
    // Add to array
    habits.push(newHabit);
    
    saveHabits();
    displayHabits(); 
    
    form.reset();
});


function displayHabits() {
    // Clear the container
    container.innerHTML = '';
    
    // Show each habit
    for (let i = 0; i < habits.length; i++) {
        const habit = habits[i];
        
        // create div for this habit
        const habitDiv = document.createElement('div');
        habitDiv.style.border = '1px solid black';
        habitDiv.style.padding = '10px';
        habitDiv.style.marginBottom = '10px';
        
        // add habit info
        habitDiv.innerHTML = `
            <h3>${habit.name}</h3>
            <p>Target: ${habit.targetDays} days</p>
            <p>Current Streak: ${habit.currentStreak} days</p>
            <button onclick="markComplete(${habit.id})">Mark Complete Today</button>
            <button onclick="deleteHabit(${habit.id})">Delete</button>
        `;
        
        container.appendChild(habitDiv);
    }
}

// Mark habit as complete for today
function markComplete(habitId) {
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Get today's date as a string
    const today = new Date().toDateString();
    
    // Check if already completed today
    if (habit.completedDays.includes(today)) {
        alert('Already completed today!');
        return;
    }
    
    // Add today to completed days
    habit.completedDays.push(today);
    
    updateStreak(habit);
    
    saveHabits();
    displayHabits();
}


function updateStreak(habit) {
    let streak = 0;
    const today = new Date();
    
    // Check backwards from today
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateString = checkDate.toDateString();
        
        if (habit.completedDays.includes(dateString)) {
            streak++;
        } else if (i > 0) {
            // If we miss a day (except today), streak breaks
            break;
        }
    }
    
    habit.currentStreak = streak;
}


function deleteHabit(habitId) {
    if (confirm('Are you sure?')) {
        // Filter out the habit
        habits = habits.filter(h => h.id !== habitId);
        
        saveHabits();
        displayHabits();
    }
}

loadHabits();

// Make functions available globally for onclick
window.markComplete = markComplete;
window.deleteHabit = deleteHabit;