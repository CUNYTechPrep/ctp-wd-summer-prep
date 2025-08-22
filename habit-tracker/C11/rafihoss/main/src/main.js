const form = document.getElementById('habit-form');
const habitList = document.getElementById('habit-list');
let habits = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('habit-name').value;
  const frequency = document.getElementById('habit-frequency').value;
  const habit = { id: Date.now(), name, frequency, dates: [] };
  habits.push(habit);
  saveHabits();
  renderHabits();
  form.reset();
});

function calculateStreaks(dates) {
  if (dates.length === 0) return { current: 0, longest: 0 };

  // Sort dates in ascending order
  const sorted = dates.map(date => new Date(date)).sort((a, b) => a - b);

  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const diffInDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (diffInDays > 1) {
      currentStreak = 1; // reset current streak
    }
  }

  // Check if last completed date is yesterday or today
  const lastDate = sorted[sorted.length - 1];
  const today = new Date();
  const diffFromToday = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  if (diffFromToday > 1) {
    currentStreak = 0;
  }

  return { current: currentStreak, longest: longestStreak };
}

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const div = document.createElement('div');

    // Display habit info
    const habitText = document.createElement('span');
    habitText.innerText = `${habit.name} (Target: ${habit.frequency}/week)`;

    // Create "Complete Today" button
    const completeBtn = document.createElement('button');
    completeBtn.innerText = 'Complete Today';
    completeBtn.style.marginLeft = '10px';

    // Add event listener for the button
    completeBtn.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      if (!habit.dates.includes(today)) {
        habit.dates.push(today);
        saveHabits();
        alert(`Marked "${habit.name}" as completed for today!`);
      } else {
        alert(`You've already marked "${habit.name}" as completed today.`);
      }
    });

    // Create Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.style.marginLeft = '10px';

    deleteBtn.addEventListener('click', () => {
        habits.splice(index, 1); // remove habit at this index
        saveHabits();
        renderHabits();
    });

    // Create Edit button
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.style.marginLeft = '10px';

    editBtn.addEventListener('click', () => {
        const newName = prompt("Enter new habit name:", habit.name);
        const newFrequency = prompt("Enter new target frequency:", habit.frequency);

        if (newName && newFrequency) {
            habit.name = newName;
            habit.frequency = newFrequency;
            saveHabits();
            renderHabits();
        }
    });



    const streaks = calculateStreaks(habit.dates);

    const streakInfo = document.createElement('p');
    streakInfo.innerText = `🔥 Current Streak: ${streaks.current} | 🥇 Longest Streak: ${streaks.longest}`;

    // Completion History
    const historyTitle = document.createElement('p');
    historyTitle.innerText = '📅 Completion History:';

    const historyList = document.createElement('ul');
    habit.dates
        .sort()
        .forEach(date => {
            const li = document.createElement('li');
            li.innerText = date;
            historyList.appendChild(li);
        });



    div.appendChild(habitText);
    div.appendChild(completeBtn);
    div.appendChild(deleteBtn);
    div.appendChild(editBtn)
    div.appendChild(streakInfo);
    div.appendChild(historyTitle);
    div.appendChild(historyList);
    habitList.appendChild(div);
  });
}


function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function loadHabits() {
  const stored = localStorage.getItem('habits');
  if (stored) {
    habits = JSON.parse(stored);
  }
}

loadHabits();
renderHabits();


