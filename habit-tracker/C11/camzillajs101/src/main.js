const form = document.getElementById('new_habit');
let habits;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const habit = {
        name: data.get('habit_name'),
        streak: parseInt(data.get('target_streak'))
    };

    habits.push(habit);
    renderHabits(habits);
    window.localStorage.setItem('habits', JSON.stringify(habits));
});

const renderHabits = habits => {
    const habits_container = document.getElementById('habits_container');

    habits_container.innerHTML = habits.map(habit => {
        return `<section class="habit">
        <h3>${habit.name}</h3><h4>Target streak: ${habit.streak} day(s)</h4>
        <button>Complete</button>
        <div><a href="#">Edit</a><a href="#">Delete</a></div>
        </section>`
    }).join("\n");
}

document.addEventListener('DOMContentLoaded', function() {
    habits = JSON.parse(localStorage.getItem('habits')) ?? [];
    if (habits !== null) { renderHabits(habits) }
});