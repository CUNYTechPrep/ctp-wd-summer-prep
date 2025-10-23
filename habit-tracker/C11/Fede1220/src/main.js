const form = document.getElementById('habit_form')

const habits = []

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    const habit = {
        name: data.get("habit_name"),
        targetStreak: Number(data.get("target_streak")),
        completions: []
    }

    habits.push(habit)

    console.log(JSON.stringify(habits))

    renderHabits(habits)
})

const renderHabits = (habits) => {
    const habitList = document.getElementById('habit_list')

    //while loop resets array everytime 'renderHabits' is called to allow deletion. 
    while (habitList.firstChild){
        habitList.removeChild(habitList.firstChild)
    }
    
    habits.forEach((habit, index) => {
        const li = document.createElement('li')
        li.textContent = `Habit Name: ${habit.name} --- Target Streak: ${habit.targetStreak} days`
            
        const deleteBtn = document.createElement('button')  //Creates a delete button for each habit.
        deleteBtn.textContent = 'Delete'

        deleteBtn.addEventListener('click', () => {
            habits.splice(index, 1)
            renderHabits(habits)
        })

        const completeBtn = document.createElement('button')    //Creates completion button for each habit.
        completeBtn.textContent = 'Mark Complete'
        
        completeBtn.addEventListener('click', () => {
            const todayDate = new Date().toISOString().split('T')[0]    // Gets real current date and stores it into an array. 
            if (!habit.completions.includes(todayDate)){
                habit.completions.push(todayDate)
                alert(`Marked "${habit.name}" completed today.`)
            }
            else {
                alert(`Already Completed.`)
            }
            renderHabits(habits)
        })

        const editBtn = document.createElement('button')
        editBtn.textContent = 'edit'
        
        editBtn.addEventListener('click', () => {
            const newName = prompt("Enter new habit name: ", habit.name)    // Asks user to type a new habit name.
            if(newName) habit.name = newName

            const newStreak = prompt("Enter new target Streak : ", habit.targetStreak)
            if(newStreak) habit.targetStreak = newStreak

            renderHabits(habits)
        })

        li.appendChild(deleteBtn)        
        habitList.appendChild(completeBtn)
        habitList.appendChild(li)
        habitList.appendChild(editBtn)
    })
}