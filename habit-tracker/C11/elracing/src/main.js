const HabitCategory = {
  HEALTH: "health",
  PRODUCTIVITY: "productivity",
  LEARNING: "learning",
  RELAXATION: "relaxation"
};

const habitStorage = { //use to save habits


  save(habits) {
    window.localStorage.setItem('habits', JSON.stringify(habits));
  },
  
  load() {
    const data = localStorage.getItem('habits');
    return data ? JSON.parse(data) : [];
  },
  
  clear() {
    localStorage.removeItem('habits')
  }
};

let habits = habitStorage.load() || [];

const renderHabits = (habits) => {
  const habitlist = document.getElementById('habit_list')
  habitlist.innerHTML = ""; //clear list

  for (let i = 0; i < habits.length; i++) {
    const habit  = habits[i]

    const li = document.createElement('li')
    li.textContent = `${habit.habitName}, category: ${habit.category}, target streak : ${habit.targetStreak}`
    habitlist.appendChild(li)

  }
}

renderHabits(habits);

function calculatePoints(streak) {
  return streak * 10;
}

function calculateStreak(dates) {
    let count = 0;
    for (let i = 0; i < dates.length; i++) {
        count++;
    }
    

    return count;

}

function isHabitCompleted(habit, date) {
  let completed = false;

  for (let i = 0; i < habit.completions.length; i++) {
    if (habit.completions[i] === date) {
      completed = true;
    }

   
  }
    return completed;


}

const form = document.getElementById('habitform')
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const data = new FormData(event.target);

  console.log(Array.from(data.keys()));

  const habit = ({
    habitName: data.get('habitName'),
    targetStreak: data.get('targetStreak'),
    category: data.get('category'),
    completions: []
  });

  habits.push(habit);

  habitStorage.save(habits);
  renderHabits(habits);
})









