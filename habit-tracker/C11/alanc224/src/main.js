console.log(document.getElementById('habit_form'));
const form = document.getElementById('habit_form');
const habitList = document.getElementById('habit_list');
const habitStorage = {
  // TODO: Implement these methods
  save(habits) {
    window.localStorage.setItem('habits', JSON.stringify(habits))
  },
  
  load() {
    return JSON.parse(localStorage.getItem('habits')) || [];
  },
  
  clear() {
    localStorage.removeItem('habits')
  }
};
const habits = habitStorage.load();

for(let i = 0;i<habits.length;i++){
        if (habits[i].lastCompleted !== new Date().toDateString()){
            console.log("Test")
            habits[i].completed = false
        }
    }

let counterID = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
const clearButton = document.getElementById('clear_habit');


const renderHabits = (habits) => {
    habitList.innerHTML = habits.map(habit => {

        if (habit.completed) {
           return `
                <li class="habit-item">
                    ${habit.name}: ${habit.targetStreak} ✅<br>
                    Current Streak: ${habit.streak} days<br>
                    Longest Streak: ${habit.longestStreak} days<br>
                    <p><button class="delete_habit" data-habit-id="${habit.id}">Delete</button><p>
                </li>
            `;
        } 

        else {
            return `
                <li class="habit-item">
                    Habit Name: ${habit.name}<br>
                    Target Streak: ${habit.targetStreak}<br>
                    <button class="delete_habit" data-habit-id="${habit.id}">Delete</button>
                    <button class="edit_habit" data-habit-id="${habit.id}">Edit</button>
                    <button class="complete_habit" data-habit-id="${habit.id}">Complete</button>
                </li>
            `;
        }
    }).join('');
};
renderHabits(habits)


form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const habitName = data.get('habit_name').trim();
    const targetStreak = Number(data.get('target_streak'));

    if (habitName === '') {
        alert('Please enter a habit name.');
        return;
    }

    if (isNaN(targetStreak) || targetStreak <= 0) {
        alert('Please enter a target streak greater than 0.');
        return;
    }
    const habit = {
    id: counterID,
    name: data.get('habit_name'),
    targetStreak: Number(data.get('target_streak')),
    completed: false,
    streak: 0, 
    longestStreak: 0,
    lastCompleted: null
    };

    let exist = habits.some(h => h.name === habit.name);
    console.log(exist)

    if (!exist){
        counterID++;
        habits.push(habit);
        console.log(JSON.stringify(habits));
        habitStorage.save(habits)
        renderHabits(habits);
    }
});

clearButton.addEventListener('click', () => {
  habitStorage.clear();
  habits.length = 0;
  renderHabits(habits);
});

habitList.addEventListener('click', (event) => {

     if (event.target.classList.contains('delete_habit')) {
        if (event.target.classList.contains('delete_habit')) {
            const habitIdToDelete = event.target.dataset.habitId;
            deleteHabit(habitIdToDelete);
            renderHabits(habits);
        }
    }

    if (event.target.classList.contains('edit_habit')) {
        if (event.target.classList.contains('edit_habit')) {
            const habitIdToEdit = event.target.dataset.habitId;
            editHabit(habitIdToEdit);
            renderHabits(habits);
        }
    }

    if (event.target.classList.contains('complete_habit')) {
        if (event.target.classList.contains('complete_habit')) {
            const habitIdToComplete = event.target.dataset.habitId;
            completeHabit(habitIdToComplete);
            renderHabits(habits);
        }
    }
});

function deleteHabit(habitID){
    for(let i = 0;i<habits.length;i++){
        if (habits[i].id == habitID){
            habits.splice(i,1);
            break;
        }
    }
    habitStorage.save(habits);
}

function completeHabit(habitID) {
    const date = new Date().toDateString();

    for (let i = 0; i < habits.length; i++) {
        if (habits[i].id == habitID) {
            if (habits[i].lastCompleted !== date) {
                habits[i].completed = true;

                const lastDate = habits[i].lastCompleted ? new Date(habits[i].lastCompleted) : null;
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
                    habits[i].streak++;
                } 
                else {
                    habits[i].streak = 1; 
                }
                if (habits[i].streak > habits[i].longestStreak) {
                    habits[i].longestStreak = habits[i].streak;
                }

                habits[i].lastCompleted = date;
                
                break;
            }
        }
    }
    habitStorage.save(habits);
}

function editHabit(habitID){
    for(let i = 0;i<habits.length;i++){
        if (habits[i].id == habitID){
            let name = prompt("Please edit the habit name:");
            let streakVAL = prompt("Please edit the streak value:");
            let val = parseInt(streakVAL)
            if (name){
                let exist = habits.some(h => h.name === name);
                if (!exist){
                    habits[i].name = name
                }
            }
            if (!isNaN(val)) {
                habits[i].targetStreak = val
            }
            break;
        }
    }
    habitStorage.save(habits);
}