'use strict';

const form = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');
const completedHabitsElement = document.getElementById('completed-habits');
const brokenStreaksElement = document.getElementById('broken-streaks');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
/*
Habits object structure:
{
    id: Date.now(), // Unique timestamp-based ID
    name: 'Habit Name',
    targetStreak: 30, // Target streak in days
    currentStreak: 5, // Current streak in days
    longestStreak: 10, // Longest streak in days
    totalCompletions: 25, // Total times completed (every targetStreak days)
    completionDates: ['2025-07-01', '2025-08-02'], // Array of completion dates (YYYY-MM-DD)
    lastCompleted: '2025-08-04', // Last completion date (YYYY-MM-DD)
}
    Use timestamps 
*/
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let stats = JSON.parse(localStorage.getItem('stats')) || {
    completedHabits: 0,
    brokenStreaks: 0
}

const saveToLocalStorage = () => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('stats', JSON.stringify(stats));
}

// Update streaks based on completion dates
const calculateAllStreaks = () => {
    habits.forEach(habit => {
        if (checkStreaks(habit.id))
            habit.currentStreak = 0;
    });
    saveToLocalStorage();
    
}

// Convert timestamp to YYYY-MM-DD string
const timestampString = (timestamp) => {
    return new Date(timestamp).toISOString().split('T')[0];
}

// Format dates nicely for display
const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Handle streak checks from today's date
const checkStreaks = (habit) => {
    if (!habit) return false;
    
    let brokenStreak = false; // Changed from const to let

    if (habit.lastCompleted) {
        const lastCompletedDate = new Date(habit.lastCompleted);
        const yesterday = new Date(Date.now() - 1000*60*60*24);
         
        // Check if we haven't broken the streak
        if (lastCompletedDate.getTime() < yesterday.getTime())
            brokenStreak = true;
    }

    return brokenStreak;
}
// Close modal function
const closeModal = (modal) => {
    modal.style.display = 'none';
};
    
const completeHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    modalTitle.textContent = `Complete Habit`;
    [...modalBody.children].forEach(child => child.remove());
    modal.style.display = 'flex';

    const modalParagraph = document.createElement('p');
    // Check if habit is already completed today
    const today = timestampString(Date.now());
    if (habit.completionDates.includes(today)) {
        modalParagraph.textContent = `You have already completed "${habit.name}" today.`;
        modalBody.appendChild(modalParagraph);
        return;
    }
    // Add today's date to completion dates
    habit.completionDates.push(today);
    
    const isBrokenStreak = checkStreaks(habit);
    let targetReached = false;
    habit.lastCompleted = Date.now();
    
    if (isBrokenStreak) {
        stats.brokenStreaks += 1;
        habit.currentStreak = 1; 
    } else {
        habit.currentStreak++;
        if (habit.currentStreak % habit.targetStreak === 0) {
            targetReached = true;
            habit.totalCompletions += 1;
            stats.completedHabits += 1; 
        }
    }
    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);

    modalParagraph.textContent = `Great! You've completed "${habit.name}" for today!\n`;

    const modalParagraphNotice = document.createElement('p');
    if (isBrokenStreak)
        modalParagraphNotice.textContent = `💔 Your streak broke, but you're starting fresh!`;
    else
        modalParagraphNotice.textContent = `🔥 Current streak: ${habit.currentStreak} days`;

    if (targetReached)
        modalParagraphNotice.textContent += `🎯 Congratulations! You've reached your target of ${habit.targetStreak} days!`;

    modalBody.appendChild(modalParagraph);
    modalBody.appendChild(modalParagraphNotice);

    // Update stats
    saveToLocalStorage();
    renderHTML();
}

const showCompletionDates = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    modalTitle.textContent = `Completion History`;
    [...modalBody.children].forEach(child => child.remove());
    modal.style.display = 'flex';

    const modalParagraph = document.createElement('p');
    if (habit.completionDates.length === 0) {
        modalParagraph.textContent = `No completion dates found for "${habit.name}".`;
        modalBody.appendChild(modalParagraph);
        return;
    }

    modalParagraph.textContent = `Completion dates for "${habit.name}":`;
    modalBody.appendChild(modalParagraph);

    const completionList = document.createElement('ul');
    completionList.className = 'history-content';
    
    // Sort dates in descending order (most recent first)
    const sortedDates = [...habit.completionDates].sort((a, b) => new Date(b) - new Date(a));
    
    sortedDates.forEach((date, index) => {
        const li = document.createElement('li');
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'history-date';
        dateSpan.textContent = formatDateForDisplay(date);

        li.appendChild(dateSpan);        
        if (index === 0) {
            // Most recent completion
            const recentBadge = document.createElement('span');
            recentBadge.className = 'recent-badge';
            recentBadge.textContent = 'Latest';
            li.appendChild(recentBadge);
        }
        completionList.appendChild(li);
    });
    
    modalBody.appendChild(completionList);
}

const editHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // make form work with current ID
    editForm.dataset.habitId = id;
    
    // Prepopulate form
    const editNameInput = document.getElementById('edit-habit-name');
    const editStreakInput = document.getElementById('edit-target-streak');
    
    if (editNameInput) editNameInput.value = habit.name;
    if (editStreakInput) editStreakInput.value = habit.targetStreak;
    
    // Show the edit modal
    editModal.style.display = 'flex';
}

const deleteHabit = (id) => {
    const habitIndex = habits.findIndex(habit => habit.id === id);
    if (habitIndex === -1) return;

    modalTitle.textContent = `Delete Habit`;
    [...modalBody.children].forEach(child => child.remove());
    modal.style.display = 'flex';

    const modalParagraph = document.createElement('p');
    modalParagraph.textContent = `Are you sure you want to delete "${habits[habitIndex].name}"? This action cannot be undone.`;
    modalBody.appendChild(modalParagraph);

    const modalButtons = document.createElement('div');
    modalButtons.className = 'modal-buttons';
    const modalDelete = document.createElement('button');
    modalDelete.className = 'btn btn--primary';
    modalDelete.textContent = 'Delete';
    modalButtons.appendChild(modalDelete);

    const modalCancel = document.createElement('button');
    modalCancel.className = 'btn btn--secondary';
    modalCancel.textContent = 'Cancel';
    modalButtons.appendChild(modalCancel);

    modalBody.appendChild(modalButtons);

    modalDelete.onclick = () => {
        habits.splice(habitIndex, 1);
        saveToLocalStorage();
        renderHTML();
        closeModal(modal);
        alert(`Successfully deleted habit!`);
    };
    modalCancel.onclick = () => closeModal(modal);
}

function renderHTML() {
    // set stats
    completedHabitsElement.textContent = stats.completedHabits;
    brokenStreaksElement.textContent = stats.brokenStreaks;

    // render habits
    [...habitList.children].forEach(child => child.remove());

    if (habits.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-habits';
        li.textContent = 'No habits added yet. Create your first habit above!';
        habitList.appendChild(li);
        return;
    }

    habits.forEach((habit) => {
        const li = document.createElement('li');
        li.className = 'habit-item';
        li.setAttribute('habit-id', habit.id);
        
        // Show habit name
        const habitName = document.createElement('h3');
        habitName.className = 'habit-name';
        habitName.textContent = habit.name;

        li.appendChild(habitName);

        // Create habit details 
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'habit-details';
        
        const createDetailItem = (label, value) => {
            const detailDiv = document.createElement('div');
            detailDiv.className = 'habit-detail';
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'habit-detail-label';
            labelDiv.textContent = label;
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'habit-detail-value';
            valueDiv.textContent = value;
            
            detailDiv.appendChild(labelDiv);
            detailDiv.appendChild(valueDiv);

            detailsContainer.appendChild(detailDiv);
        }
        
        createDetailItem('Target Streak', `${habit.targetStreak || 0} days`);
        createDetailItem('Current Streak', `${habit.currentStreak || 0} days`);
        createDetailItem('Longest Streak', `${habit.longestStreak || 0} days`);
        createDetailItem('Total Completions', habit.totalCompletions || 0);
        
        li.appendChild(detailsContainer);

        // Create actions container for buttons
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'habit-actions';
        
        const createButton = (text, variant, clickHandler) => {
            const button = document.createElement('button');
            button.className = `btn btn--${variant}`;
            button.textContent = text;
            button.addEventListener('click', () => clickHandler(habit.id));
            actionsContainer.appendChild(button);
        }
        
        createButton('Complete Today', 'success', completeHabit);
        createButton('View Dates', 'info', showCompletionDates);
        createButton('Edit', 'warning', editHabit);
        createButton('Delete', 'danger', deleteHabit);

        li.appendChild(actionsContainer);
        
        habitList.appendChild(li);
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const data = new FormData(event.target);

    // Validate input
    const name = data.get('habit-name').trim();
    if (!name) {
        alert('Please enter a valid habit name.');
        return;
    }
    const streak = Number(data.get('target-streak'));
    if (isNaN(streak) || streak < 1 || streak > 32) {
        alert('Target streak must be a number between 1 and 32 days.');
        return;
    }
    const habit = {
        id: Date.now(),
        name: name,
        targetStreak: streak,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        completionDates: [],
        lastCompleted: null
    }

    habits.push(habit)
    saveToLocalStorage()
    renderHTML()
    
    // Reset form
    event.target.reset()
    
    // Scroll to the newly created habit
    const newHabit = document.querySelector(`[habit-id="${habit.id}"]`);
    if (newHabit) newHabit.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


// Modal event listeners and functionality
const setupModals = () => {    
    // Edit modal close events
    const editClose = document.getElementById('edit-close');    
    const editCancel = document.getElementById('edit-cancel');
    editClose.addEventListener('click', () => closeModal(editModal));
    editCancel.addEventListener('click', () => closeModal(editModal));

    // Modal close events
    const modalClose = document.getElementById('modal-close');
    modalClose.addEventListener('click', () => closeModal(modal));

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeModal(editModal);
        }
        if (event.target === modal) {
            closeModal(modal);
        }
    });
    
    // Handle edit form submission
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const habitId = parseInt(editForm.dataset.habitId);
        const habit = habits.find(h => h.id === habitId);
        
        if (!habit) {
            alert('Habit not found!');
            return;
        }
        
        const data = new FormData(event.target);
        const newName = data.get('edit-habit-name').trim();
        const newTargetStreak = parseInt(data.get('edit-target-streak'));
        
        // Validate input
        if (!newName) {
            alert('Please enter a valid habit name.');
            return;
        }
        
        if (isNaN(newTargetStreak) || newTargetStreak < 1 || newTargetStreak > 32) {
            alert('Target streak must be a number between 1 and 32 days.');
            return;
        }
        
        // Update habit
        habit.name = newName;
        habit.targetStreak = newTargetStreak;
        habit.totalCompletions = Math.floor(habit.completionDates.length / newTargetStreak);

        // Save and refresh
        saveToLocalStorage();
        renderHTML();
        closeModal(editModal);
        
        alert(`Successfully updated "${habit.name}"!`);
    });
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    calculateAllStreaks();
    renderHTML();
})
