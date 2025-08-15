const form = document.getElementById('habit_form')

// const habit = {
//     name: "",
//     category: "",
//     streakDays: 0,
//     isActive: false,
//     complete() {
//         this.streakDays++;
//         console.log("streak updated")
//     }
// }

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

const habitTracker = {
  habits: [],
  
  addHabit(name, category) {
    const habit = {
      name: name,
      category: category,
      completions: 0,
      lastCompleted: null
    };
    this.habits.push(habit);
    return habit;
  },
  
  completeHabit(name) {
    const habit = this.habits.find(h => h.name === name);
    if (habit) {
      habit.completions++;
      habit.lastCompleted = new Date();
      return true;
    }
    return false;
  },
  
  getTotalPoints() {
    return this.habits.reduce((total, habit) => {
      return total + (habit.completions * 10);
    }, 0);
  }
};

// habitTracker.habits = habitStorage.load()

// const tracker = new habitTracker([])

form.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const data = new FormData(event.target)

    // console.log(data)
    const habit = {
        name: data.get('habit_name'),
        targetStreak: Number(data.get('target_streak'))
    }

    // habits.push(habit)
    habitTracker.addHabit(data.get('habit_name'), Number(data.get('target_streak')))
    console.log(JSON.stringify(habitTracker.habits))
    // window.localStorage.setItem('habits', JSON.stringify(tracker.habits))
    habitStorage.save(habitTracker.habits)

    renderHabits(habitTracker.habits)
})

const renderHabits = (habits) => {
    const habitList = document.getElementById('habit_list')

    habitList.innerHTML = `
        ${
            habits.map(habit => {
                return `<div class="habit_card">
                          <header class="habit_header">
                              <h2 class="habit_name">${habit.name}</h2>
                              <time class="habit_time" datetime="2024-01-15">Started Jan 15, 2024</time>
                          </header>
                          <section class="habit_info">
                              <p class="habit_streak">Current streak: <strong>15 days</strong></p>
                              <progress value="15" max="30">50%</progress>
                          </section>
                          <footer class="habit_footer">
                              <button class="habit_mark_complete">Mark Complete</button>
                              <button class="habit_view_details">View Details</button>
                          </footer> 
                        </div>`
                
                
                // <li>${habit.name}; ${habit.targetStreak}`
            }).join('\n')
        }
    `
}



const calculateStreak = (habits) => {
    return habits.length;
} 

const isHabitCompleted = (habit,date) => {
    for (let i = 0; i < habit.completions.length; i++) {
    if (habit.completions[i] === date) {
      return true;
    }
  }
  return false;

} 

const getPoints = (streak) => {
    return streak * 10;
} 

// const complete_habit = document.getElementById('complete_habit')

