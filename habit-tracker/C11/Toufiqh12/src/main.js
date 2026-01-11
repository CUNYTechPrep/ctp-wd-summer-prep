const form = document.getElementById('habitform');
const habits = [];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const habit = {
        name: data.get('habit_name'),
        targetStreak: Number(data.get('target_streak')),
        streak: 0 // this is the current streak, initialized to 0
    };

    habits.push(habit);
    console.log(JSON.stringify(habits));
    renderHabits(habits);
});
const renderHabits = (habits) => {
    const habitList = document.getElementById('habit_list');
    habitList.innerHTML = habits.map((habit, index) => {
        return `
            <li>
                ${habit.name} — ${habit.streak}/${habit.targetStreak}
                <button onclick="markCompleted(${index})">Complete</button> 
            </li> 
            
        `;
    }).join('\n');
};
const markCompleted = (index) => {
    habits[index].streak += 1; 
    renderHabits(habits);
};