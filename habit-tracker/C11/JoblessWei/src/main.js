const habits = []
let editIndex = -1
// show modal when create new habit button is clicked
document.getElementById("create_habit_btn").addEventListener("click", () =>{
    editIndex = -1
    document.getElementById('habitForm').reset()
    document.getElementById("habitModal").classList.remove("hidden")
});


// handle form submissions
document.getElementById('habitForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const habit = {
        name: formData.get('habitName'),
        category: formData.get('category'),
        frequency: formData.get('frequency'),
        reminder: formData.get('reminder') === 'on',
        streak: editIndex >= 0 ? habits[editIndex].streak : 0
    };

    try{
        if (editIndex >= 0){
            habits[editIndex] = habit     // update existing habit (edit function)
        }
        else{
            habits.push(habit)       //  create a new one
            console.log('New habit created:', habit);
        }

        localStorage.setItem("habits", JSON.stringify(habits))  // add habit to list

    } catch (error){
        console.log(error)
    }
    document.getElementById("habitModal").classList.add("hidden")
    renderHabit(habits)


    editIndex = -1
});

const renderHabit = (habits) => {
    const habitList = document.getElementById("habit_list")
    
    habitList.innerHTML = habits.map((habit, index) => {
        return  `<div class="habitCard">
        <div class="cardContent">
            <p>${habit.name}</p>
            <p>Category: ${habit.category}</p>
            <p>Streak:${habit.streak}</p>
            <p>Frequency: ${habit.frequency}</p>
        </div>
        <div class="cardButtons">
            <button class="deleteHabitButton" data-index=${index}> Delete Habit </button>
            <button class="completeButton" data-index=${index}> Mark as Complete </button>
            <button class="editHabitButton" data-index=${index}> Edit </button>
        </div>
    </div>`
    
    }).join('\n')

}

// Increment streak by one when clicking on complete button
document.addEventListener('click', (e) =>{
    if (e.target.classList.contains('completeButton')){
        const index = e.target.getAttribute('data-index')

        habits[index].streak += 1;
        renderHabit(habits)
        localStorage.setItem("habits", JSON.stringify(habits))
    }
    // delete habit when button is pressed
    if (e.target.classList.contains('deleteHabitButton')){
    const index = e.target.getAttribute('data-index')

    habits.splice(index, 1)
    renderHabit(habits)
    localStorage.setItem("habits", JSON.stringify(habits))

    }

    // edit habit if edit button is pressed
    if(e.target.classList.contains('editHabitButton')){
        const index = parseInt(e.target.getAttribute('data-index'))
        const habit = habits[index]

        editIndex = index
        document.getElementById("habitModal").classList.remove("hidden")
        
        document.getElementById('habitName').value = habit.name;
        document.getElementById('category').value = habit.category;
        document.getElementById('frequency').value = habit.frequency;
        document.getElementById('reminder').checked = habit.reminder;


    }
})


