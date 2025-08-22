/*function addHabit() {
    var habit = document.getElementById("habit").value
    var streak = document.getElementById("streak").value

    document.getElementById("habit-list").innerHTML += "<li>Habit: \"" + habit + "\", Streak: " + streak + "</li>"
}*/
const habits = []

document.getElementById("form").addEventListener('submit', (event) => {
    event.preventDefault()

    const data = new FormData(event.target)

    const habit = {
        habit: data.get('habit'),
        streak: Number(data.get('streak'))
    }

    habits.push(habit)

    listHabits(habits)

})

function listHabits(habits) {
    const habitList = document.getElementById("habit-list")
    habitList.innerHTML = "";

    for(let habit of habits) {
        const li = document.createElement('li')
        li.textContent = habit.habit + ", Streak: " + habit.streak
        habitList.appendChild(li)
    }
}