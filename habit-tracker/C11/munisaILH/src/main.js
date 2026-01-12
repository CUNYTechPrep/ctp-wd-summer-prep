const form = document.getElementById('habit_form');
let habits = JSON.parse(localStorage.getItem('habits')) || [];

//save habits to the localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

//render habits in the list
function renderHabits() {
    const habitList = document.getElementById('habit_list');
    habitList.innerHTML = habits.map((habit, index) => {
        return `
            <li>
                <span>${habit.name} — Streak: ${habit.streak}/${habit.targetStreak}</span>
                <div>
                    <button onclick="incrementStreak(${index})">✅</button>
                    <button onclick="deleteHabit(${index})">🗑</button>
                </div>
            </li>
        `;
    }).join('');
}

//adding a new habit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const habit = {
        name: data.get('habit_name'),
        targetStreak: Number(data.get('target_streak')),
        streak: 0
    };

    habits.push(habit);
    saveHabits();
    renderHabits();
    form.reset();
});

function incrementStreak(index) {
    habits[index].streak++;
    saveHabits();
    renderHabits();
}

function deleteHabit(index) {
    habits.splice(index, 1);
    saveHabits();
    renderHabits();
}

//initial render from localStorage
renderHabits();
