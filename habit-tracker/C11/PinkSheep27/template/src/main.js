document.addEventListener("DOMContentLoaded", () => {
    const habitForm = document.getElementById("habit-form");
    const habitNameUI = document.getElementById("habit-name");
    const habitCategoryUI = document.getElementById("habit-category");
    const habitFrequencyUI = document.getElementById("habit-frequency");
    const habitListContainer = document.getElementById("habit-list");

    //Load from localStorage or New List
    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    //Save Habits to localStorage
    function saveHabits(){
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    //For when the user presses the submition button
    habitForm.addEventListener("submit", (e) =>{
        e.preventDefault();
        const name = habitNameUI.value.trim();
        if (!name) return alert("Please Enter a Habit Name!");
        const frequency = parseInt(habitFrequencyUI.value);
        if(!frequency) return alert("Please Enter a Valid Frequency!");

        habits.push({
            id: Date.now().toString(),
            name,
            category: habitCategoryUI.value,
            frequency,
            completions:[],
            createdAt: new Date().toString()
        });
        saveHabits();
        renderHabits();
        habitForm.reset();
    });

    //When the user clicks a toggle, delete, and edit button
    habitListContainer.addEventListener("click", (e) => {
        const habitElement = e.target.closest('.habit-display');
        if (!habitElement) return;

        const id = habitElement.dataset.id;
        const habit = habits.find(h => h.id === id);
        if(!habit) return;

        if(e.target.classList.contains("toggle-button"))
            toggleHabitComplete(habit);
        else if(e.target.classList.contains("delete-button"))
            deleteHabit(id);
        else if(e.target.classList.contains("edit-button"))
            editHabit(habit);
    });

    //Completion button for when the user completes a habit
    function toggleHabitComplete(habit){
        const today = new Date();
        // Get date in YYYY-MM-DD format, ignoring timezone issues
        const todayStr = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1) + '-' + 
                    String(today.getDate());

            if(habit.completions.includes(todayStr))
                return alert("Already Completed Today!");

        habit.completions.push(todayStr);
        saveHabits();
        renderHabits();
    }

    //Allows for the removal of a Habit
    function deleteHabit(id){
        if(confirm("Are you sure you want to delete this habit?")){
            habits = habits.filter(habit => habit.id !== id);
            saveHabits();
            renderHabits();
        }
    }

    //Should allow for the editing of habit name and the frequency
    function editHabit(habit){
        const newName = prompt("Edit Habit Name:", habit.name);
        if (newName && newName.trim() !== ""){
            habit.name = newName.trim();
            const newFrequency = prompt("Edit Frequency (weekly):", habit.frequency);
            if(newFrequency) habit.frequency = parseInt(newFrequency) || habit.frequency;
            saveHabits();
            renderHabits();
        }
    }

    //Streak Calculator
    function calculateStreak(habit){
        const milliSec = 86400000; //milliseconds in a day
        let streak = 0;

        const getLocalDate = (date = new Date()) => {
            return date.toLocaleDateString('en-US');
        };

        const today = getLocalDate();
        const yesterday = getLocalDate(new Date(Date.now() - milliSec));
        
        // Remove duplicates and sort newest first
        const completions = [...new Set(habit.completions)]
            .map(d => {return getLocalDate(new Date(d));})
            .filter(Boolean)
            .sort()
            .reverse();

        if (completions.length === 0) return 0;
        
        // Check if most recent is today or yesterday
        if (completions[0] !== today && completions[0] !== yesterday) return 0;

        streak++;
        
        // Check consecutive days
        for (let i = 1; i < completions.length; i++) {
            const prevDate = new Date(completions[i-1]);
            const expectedDate = new Date(prevDate);
            expectedDate.setDate(prevDate.getDate() - 1);
            
            if (getLocalDate(expectedDate) === completions[i]) {
                streak++;
            } else {
                break;
            }
        }
    
        return streak;
    }

    //Return the last 5 completed dates in MM/DD fashion bassically a history
    function getRecentCompletions(dates){
        return dates.slice(-5).map(d => {
            const date = new Date(d);
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
        }).reverse(); //reverse the list to print out the dates in descending order
    }

    function renderHabits() {
        habitListContainer.innerHTML = '';
        
        if (habits.length === 0) {
            habitListContainer.innerHTML = '<p class="no-habits">No habits yet 😢. Add one to get started!</p>';
            return;
        }

        habits.forEach(habit => {
            const today = new Date().toString();
            const isCompletedToday = habit.completions.includes(today);
            const streak = calculateStreak(habit);
            const recent = getRecentCompletions(habit.completions);

            const habitElement = document.createElement('div');
            habitElement.className = "habit-display";
            habitElement.dataset.id = habit.id;
            habitElement.innerHTML = `
                <h3>${habit.name}</h3>
                <div class="habit-info">
                    <span>${habit.category}</span>
                    <span>${habit.frequency}x/week</span>
                </div>
                <div class="habit-stats">
                    <div>Streak: ${streak} days</div>
                    ${recent.length > 0 ? `<div class="recent">Recent: ${recent.join(', ')}</div>` : 'No Completions😢'}
                </div>
                <div class="habit-actions">
                    <button class="toggle-button ${isCompletedToday ? 'completed' : ''}" 
                            ${isCompletedToday ? 'disabled' : ''}>
                        ${isCompletedToday ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </div>
            `;
            habitListContainer.appendChild(habitElement);
        });
    }

    //Initial Render of Habits
    renderHabits();
})