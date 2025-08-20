const form = document.getElementById('habit_form')
const habitList = document.getElementById('habit_list')

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
    return JSON.parse(localStorage.getItem('habits'))
  },
  
  clear() {
    localStorage.removeItem('habits')
  }
};

const habitTracker = {
  habits: [],
  
  addHabit(name, category) {
    const habit = {
      id: Math.floor(Math.random() * 5000),
      name: name,
      category: category,
      completions: 0,
      completionDates: [],
      lastCompleted: null,
      createdAt: new Date().toISOString().split('T')[0] // Store as YYYY-MM-DD
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

const streakCalculator = {
  // TODO: Implement these methods
  isConsecutive(date1, date2) {
    // Check if date2 is exactly one day after date1
    // Your code here...
    var one_day=1000*60*60*24;
    var date1_ms = Date.parse(date1)
    var date2_ms = Date.parse(date2)
    var difference_ms = date2_ms - date1_ms;
    var difference = Math.round(difference_ms/one_day)

    if(difference === 1) {
      return True
    }
    return False

  },
  
  calculateStreak(completionDates) {
    // Given array of date strings (YYYY-MM-DD), 
    // calculate current streak ending today
    // Your code here...
    let streak;
    if(completionDates) {
      streak = 1
    }
    else {
      streak = 0
    }

    console.log("help")
    for(let i = 0; i < completionDates.length-1; i++) {
      console.log(completionDates[i])

      var one_day=1000*60*60*24;
      var date1_ms = Date.parse(completionDates[i])
      var date2_ms = Date.parse(completionDates[i+1])
      var difference_ms = date2_ms - date1_ms;
      var difference = Math.round(difference_ms/one_day)


      if(difference != 1) {
        streak = 0
      }
      else {
        streak+=1
      }

    }
    return streak
  },
  
  getLongestStreak(completionDates) {
    // Find the longest streak in the history
    // Your code here...
    let streak;
    if(completionDates) {
      streak = 1
    }
    else {
      streak = 0
    }

    let longestStreak = streak

    for(let i = 0; i < completionDates.length-1; i++) {
      var one_day=1000*60*60*24;
      var date1_ms = Date.parse(completionDates[i])
      var date2_ms = Date.parse(completionDates[i+1])
      var difference_ms = date2_ms - date1_ms;
      var difference = Math.round(difference_ms/one_day)
      console.log(difference)


      if(difference > 1) {
        streak = 0
      }
      else {
        streak+=1
      }
      longestStreak = Math.max(streak,longestStreak)

    }
    return longestStreak
  }
};

document.addEventListener("DOMContentLoaded", function() {
  habitTracker.habits = habitStorage.load()
  if (habitTracker.habits != null) {
    renderHabits(habitTracker.habits)
  }
  else {
    habitTracker.habits = []
  }
});



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
    console.log(habitStorage.load())

    renderHabits(habitTracker.habits)
})

const renderHabits = (habits) => {

    habitList.innerHTML = `
        ${
            habits.map(habit => {
                return `<div class="habit_card">
                          <header class="habit_header">
                              <h2 class="habit_name">${habit.name}</h2>
                              <p class="delete_habit" data_habit="${habit.id}">X</p>                        
                          </header>
                          <section class="habit_info">
                            <time class="habit_time" datetime="${habit.createdAt}">Started ${habit.createdAt}</time>
                              <p class="habit_streak">Current streak: <strong>${streakCalculator.calculateStreak(habit.completionDates)}</strong></p>
                              <progress value="15" max="30">50%</progress>
                          </section>
                          <footer class="habit_footer">
                              <button class="habit_mark_complete" data_habit="${habit.id}">Mark Complete</button>
                              <button class="habit_view_details">View Details</button>
                          </footer> 
                        </div>`
                
                
                // <li>${habit.name}; ${habit.targetStreak}`
            }).join('\n')
        }
    `
}

habitList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete_habit')) {
    console.log('hi')
    const habitId = event.target.getAttribute('data_habit');
    console.log(habitId);
    for(let i = 0; i < habitTracker.habits.length; i++) {
      console.log(habitTracker.habits[i].id === habitId);
      if (habitTracker.habits[i].id == habitId) {
        habitTracker.habits.splice(i, 1);
        console.log(`Deleted habit with id: ${habitId}`);
        break;
      }
    }
    habitStorage.save(habitTracker.habits);
    renderHabits(habitTracker.habits);
  }

  if (event.target.classList.contains('habit_mark_complete')) {
    const habitId = event.target.getAttribute('data_habit');
    console.log(habitId);
    for(let i = 0; i < habitTracker.habits.length; i++) {
      console.log(habitTracker.habits[i].id === habitId);
      if (habitTracker.habits[i].id == habitId) {
        habitTracker.habits[i].completions++;
        let today = new Date().toISOString().split('T')[0];
        console.log(`Today's date: ${today}`);
        console.log(`Completion dates: ${habitTracker.habits[i].completionDates}`);
        if (!habitTracker.habits[i].completionDates.includes(today)) {
          habitTracker.habits[i].completionDates.push(today);
          habitTracker.habits[i].lastCompleted = today;
        }

        console.log(`Completed habit with id: ${habitId}`);
        break;
      }
    }
    // console.log(habitName)
  }

  if (event.target.classList.contains('habit_view_details')) {
    const habitId = event.target.getAttribute('data_habit');
  }
    
    // renderHabits(habitTracker.habits);
});



// const calculateStreak = (habits) => {
//     return habits.length;
// } 

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

