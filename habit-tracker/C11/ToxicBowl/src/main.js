const form = document.getElementById('habit_form')
const habitList = document.getElementById('habit_list')

//load habits from local storage or start with an empty array
const habits = JSON.parse(localStorage.getItem('habits')) || []


function saveHabits(){
    localStorage.setItem('habits', JSON.stringify(habits))
}

//habit addition
form.addEventListener('submit', (event) => {
    event.preventDefault()

    const data = new FormData(event.target)
    const habit = {
        name: data.get('habit_name'),
        targetStreak: parseInt(data.get('target_streak')),
        completedDates: [] 
    }

    habits.push(habit)
    saveHabits()
    renderHabits()
    
    form.reset()
})

// render habits to page with addition of delete button next to any habits added
function renderHabits() {
  habitList.innerHTML = habits.map((habit, index) => {
    const today = new Date().toISOString().split("T")[0] 
    const isCompleteToday = habit.completedDates.includes(today)
    
    const currentStreak = getCurrentStreak(habit)
    const longestStreak = getLongestStreak(habit)

    // Calculate the progress ratio for the streak (0 -> 1)
    const progress = Math.min(currentStreak / habit.targetStreak, 1)

    // Simple color interpolation: start at blue, end at red
    const r = Math.floor(0 + progress * (255 - 0));     // from 0 → 255
    const g = Math.floor(0 + progress * (0 - 0));       // stays 0
    const b = Math.floor(255 - progress * (255 - 0));   // from 255 → 0
  
    const bgColor = `rgb(${r},${g},${b})`

     return `
  <li style="background-color: ${bgColor};">
      <span>${habit.name} - Target Streak: ${habit.targetStreak} Current: ${currentStreak} Longest: ${longestStreak}</span>
    <span>
      <button data-index="${index}" class="completion-toggle-btn">
      ${isCompleteToday ? "Undo" : "Mark as Complete"}
      </button>
      <button data-index="${index}" class="edit-btn">Edit</button>
      <button data-index="${index}" class="delete-btn">Delete</button> 
    </span>  
    </li>
  `
  }).join('');
}
//Listener made for edit/delete/completion marker buttons
habitList.addEventListener('click', (event) => {
  const index = event.target.getAttribute('data-index')

  if (event.target.classList.contains('delete-btn')){
    const index = event.target.getAttribute('data-index')
    habits.splice(index, 1)
    saveHabits()
    renderHabits() 
  }
  
  if(event.target.classList.contains('edit-btn')){
    const index = event.target.getAttribute('data-index')
    const habit = habits[index]

    const newName = prompt("Enter new habit name:", habit.name)
    if (newName !== null && newName.trim() !== ""){
      habit.name = newName.trim()
    }

    let newTarget = prompt("Enter new target streak:", habit.targetStreak)
    if (newTarget !== null){
      newTarget = Number(newTarget)
    

    if(!isNaN(newTarget)){
      if (newTarget < 0) newTarget = 0
      if (newTarget > 10) newTarget = 10
      habit.targetStreak = newTarget
    }
  }
    saveHabits();
    renderHabits();
}

  if(event.target.classList.contains('completion-toggle-btn')){
    const today = new Date().toISOString().split("T")[0]
    const habit = habits[index]
    const dateIndex = habit.completedDates.indexOf(today)

    if (dateIndex === -1){
      habit.completedDates.push(today)
    } else {
      habit.completedDates.splice(dateIndex, 1)
    }
    saveHabits()
    renderHabits()
  }
})

function getCurrentStreak(habit){
  const today = new Date()
  let Streak = 0

  const dates = habit.completedDates.slice().sort((a, b) => new Date(b) - new Date(a))

  for(let i=0; i < dates.length; i++){
    const date = new Date(dates[i])
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24))

    if (diffDays === Streak){
      Streak++
    } else {
    break
    }
  }

  return Streak
}

function getDayDifference(date1, date2){
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24))
}

function getLongestStreak(habit){
  if (habit.completedDates.length === 0) return 0

  const dates = habit.completedDates
  .slice()
  .map(d => new Date(d))
  .sort((a, b) => a - b)

  let longest = 1
  let Streak = 1

  for(let i = 1; i < dates.length; i++){
    const diffDays = Math.round(getDayDifference(dates[i-1], dates[i]))
    if (diffDays === 1){
      Streak++
      longest = Math.max(longest, streak)
    } else if (diffDays > 1){
      Streak = 1 //broken streak
    }
  }

  return longest
}
// Initial render on page load from local storage
renderHabits();