const form = document.getElementById('habit_form')
const habits = []
let editingIdx = null; // Track which habit is being edited

form.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const data = new FormData(event.target)

    const habit = {
        name: data.get('habit_name'),
        targetStreak: Number(data.get('target_streak'))
    }

    if (editingIdx !== null) {
        habits.splice(editingIdx, 0, habit)
        editingIdx = null
    } else {
        habits.push(habit)
    }

    form.reset()
    renderHabits(habits)
})

const renderHabits = (habits) => {
    const habitList = document.getElementById('habit_list')

    habitList.innerHTML = habits.map((habit, idx) => {
        return `
            <li class="habit_card"> <div class="card_content">
                <div class="displayed_name">${habit.name}</div>
                <div class="displayed_streak">${habit.targetStreak} day streak</div>

                <div>
                    <button class="complete_button">Complete</button>
                </div>

                <div>
                    <button class="edit-btn" data-idx="${idx}">Edit</button>
                    <button class="delete-btn" data-idx="${idx}">Delete</button>
                </div>
            </div> </li>
        `
    }).join('\n')

    // Add event listeners for edit and delete buttons
    habitList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.target.dataset.idx)
            habits.splice(idx, 1)
            renderHabits(habits)
        })
    })

    habitList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.target.dataset.idx)
            const habit = habits[idx]

            // Fill the form with the habit's data for editing
            form.habit_name.value = habit.name
            form.target_streak.value = habit.targetStreak
            
            // Remove the habit from the list so it can be re-added on submit
            habits.splice(idx, 1)
            editingIdx = idx;

            renderHabits(habits)
        })
    })
}





// TODO: Local storage

const habitStorage = {
  // TODO: Implement these methods
  save(habits) {
    window.localStorage.setItem('habits', JSON.stringify(habits))
  },
  
  load() {
    JSON.parse(localStorage.getItem('habits'))
  },
  
  clear() {
    localStorage.removeItem('habits')
  }
};