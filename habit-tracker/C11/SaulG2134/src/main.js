const form = document.getElementById('habit_form');
let habits = [];
let editIndex = null; //making it see which one is being edited

const saveHabits = () => {
  localStorage.setItem('habits', JSON.stringify(habits));
};

const loadHabits = () => {
  habits = JSON.parse(localStorage.getItem('habits')) || [];
  habits.forEach(habit => {
    if (!habit.lastUpdated) habit.lastUpdated = null;
    if (!habit.longestStreak) habit.longestStreak = habit.streak;
    if (!habit.history) habit.history = habit.lastUpdated ? [habit.lastUpdated] : [];
  });
  renderHabits(habits);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.target);

  const habitName = data.get('habit_name');
  const targetInput = data.get('target_streak');
  const target = targetInput && targetInput.trim() !== '' ? Number(targetInput) : null;
  const today = new Date().toISOString().split('T')[0];

  if (editIndex !== null) {
    // Update existing habit
    const habit = habits[editIndex];
    habit.name = habitName;
    habit.target = target;
    editIndex = null; //ressetting
  } else {
    const existingHabit = habits.find(h => h.name === habitName);

    if (existingHabit) {
      existingHabit.streak++;
      existingHabit.lastUpdated = today;
      existingHabit.history.push(today);

      if (existingHabit.streak > existingHabit.longestStreak) {
        existingHabit.longestStreak = existingHabit.streak;
      }
    } else {
      habits.push({
        name: habitName,
        streak: 1,
        target: target,
        lastUpdated: today,
        longestStreak: 1,
        history: [today]
      });
    }
  }

  saveHabits();
  renderHabits(habits);
  form.reset();
});

const renderHabits = (habits) => {
  const habitList = document.getElementById('habit_list');
  habitList.innerHTML = '';

  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    const targetText = habit.target !== null ? `/${habit.target}` : '';
    li.textContent = `${habit.name} — Current: ${habit.streak}${targetText} | Longest: ${habit.longestStreak}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      form.habit_name.value = habit.name;
      form.target_streak.value = habit.target || '';
      editIndex = index;
    });

    const historyBtn = document.createElement('button');
    historyBtn.textContent = 'View History';
    historyBtn.addEventListener('click', () => {
      alert(`${habit.name} completed on:\n${habit.history.join('\n')}`);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.addEventListener('click', () => {
      deleteHabit(index);
    });

    li.appendChild(editBtn);
    li.appendChild(historyBtn);
    li.appendChild(delBtn);
    habitList.appendChild(li);
  });
};

function deleteHabit(index) {
  habits.splice(index, 1);
  saveHabits();
  renderHabits(habits);
}

loadHabits();
