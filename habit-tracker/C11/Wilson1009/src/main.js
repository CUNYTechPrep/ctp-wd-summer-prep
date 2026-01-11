const form = document.getElementById('habit_form')
const habits = []

form.addEventListener("submit",(event) =>{
    event.preventDefault()

    const data = new FormData(event.target)

    //console.log(Array.from(data.keys()))

    const habit = {
        name:data.get("habit_name"),
        target_streak:data.get("target_streak")
    }

    habits.push(habit)
    console.log(JSON.stringify(habits))

    renderHabits(habits)

})

const renderHabits = (habits) => {
    const habitList = document.getElementById("habit_list")

    // for (let i = 0; i < habits.length; i++){
    //     const habit = habits[i]

    //     const li = document.createElement("li")
    //     li.textContent = `${habit.name} Target Streak: ${habit.target_streak}`
    //     habitList.appendChild(li)
    // }

    habitList.innerHTML = `
        ${
            habits.map(habit => {
                return   `<li>${habit.name} ${habit.target_streak}</li>`
            }).join('\n')
        }
    `

}