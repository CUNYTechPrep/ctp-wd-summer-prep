const form = document.getElementById('habit_form')
const habits = []

form.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const data = new FormData(event.target)

    const habit = {
        name: data.get('habit_name'),
        targetStreak: Number(data.get('target_streak'))
    }

    habits.push(habit)



    console.log(JSON.stringify(habits))

    renderHabits(habits)
})

const renderHabits = (habits) => {
    const habitList = document.getElementById('habit_list')

    habitList.innerHTML = habits.map(habit => {
        return `<li>${habit.name} ${habit.targetStreak}</li>`
    }).join('\n')
}

