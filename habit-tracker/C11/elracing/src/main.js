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
  const pointsDisplay = document.getElementById('pointsDisplay');
  const points = calculatePoints();
  habitlist.innerHTML = ""; //clear list



  for (let i = 0; i < habits.length; i++) {
    const habit  = habits[i]

    const li = document.createElement('li')
    li.textContent = `${habit.habitName}, category: ${habit.category}, target streak : ${habit.targetStreak}, current streak : ${habit.completionStreak}`
    habitlist.appendChild(li)

  }

  pointsDisplay.textContent = `Points: ${points}`; //replace points html content

}

renderHabits(habits);

function calculatePoints() {
  return calculateStreak() * 10;
}

function calculateStreak() {
    let count = 0;
    for (let i = 0; i < habits.length; i++) {
        count += habits[i].completionStreak;
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
  let repeatEntry = false; //flag to check for repeat habit

  console.log(Array.from(data.keys()));

  const habit = ({
    habitName: data.get('habitName').trim().toLowerCase(), //normalize names
    targetStreak: data.get('targetStreak'),
    category: data.get('category'),
    completionStreak: 1 //initialize streak to 1
  });

  for (let i = 0; i < habits.length; i++){
    if (habit.habitName === habits[i].habitName) {
      habits[i].completionStreak++; //add to habit streak if habit already exists
      repeatEntry = true;
      break;
    }
  }
  if (!repeatEntry) {
    habits.push(habit);
  }

  habitStorage.save(habits);
  renderHabits(habits);
})


const clearButton = document.getElementById('clearList');

clearButton.addEventListener('click', (event) => {
  habitStorage.clear();
  renderHabits(habits);
  location.reload(); //force refresh
});













