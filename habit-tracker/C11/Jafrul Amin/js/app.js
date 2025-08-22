// main script for habit tracker

var habits = [];

// load habits from localStorage
function loadHabits() {
  var data = localStorage.getItem('habits');
  if (data) {
    habits = JSON.parse(data);
  }
}

// save habits to localStorage
function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

// render the list of habits
function renderHabits() {
  var ul = document.getElementById('habits');
  ul.innerHTML = ''; // clear old list

  for (var i = 0; i < habits.length; i++) {
    var h = habits[i];
    var li = document.createElement('li');
    li.className = 'habit-item';

    // info about name, freq, streaks
    var info = document.createElement('div');
    info.innerHTML = 
      '<strong>' + h.name + '</strong> (' + h.frequency + ')<br>' +
      'Streak: ' + calcCurrentStreak(h) +
      ' | Longest: ' + (h.longestStreak || 0);

    // button: mark today done/undone
    var markBtn = document.createElement('button');
    markBtn.textContent = 'Done';
    markBtn.onclick = (function(id) {
      return function() {
        toggleComplete(id, today());
        saveHabits();
        renderHabits();
      }
    })(h.id);

    // button: edit habit
    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = (function(id) {
      return function() {
        var newName = prompt('New name:', h.name);
        var newFreq = prompt('New freq (daily/weekly):', h.frequency);
        if (newName) { h.name = newName.trim(); }
        if (newFreq === 'daily' || newFreq === 'weekly') {
          h.frequency = newFreq;
        }
        saveHabits();
        renderHabits();
      }
    })(h.id);

    // button: view history
    var histBtn = document.createElement('button');
    histBtn.textContent = 'History';
    histBtn.onclick = (function(entries, li) {
      return function() {
        var hist = li.querySelector('.history');
        if (hist) {
          hist.style.display = hist.style.display === 'none' ? 'block' : 'none';
        } else {
          var d = document.createElement('div');
          d.className = 'history';
          if (entries.length > 0) {
            d.textContent = 'Done on: ' + entries.join(', ');
          } else {
            d.textContent = 'No history yet.';
          }
          li.appendChild(d);
        }
      }
    })(h.entries, li);

    // button: delete habit
    var delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = (function(id) {
      return function() {
        deleteHabit(id);
        saveHabits();
        renderHabits();
      }
    })(h.id);

    // put it all together
    li.appendChild(info);
    li.appendChild(markBtn);
    li.appendChild(editBtn);
    li.appendChild(histBtn);
    li.appendChild(delBtn);
    ul.appendChild(li);
  }
}

// toggle completion for a given date
function toggleComplete(id, date) {
  for (var i = 0; i < habits.length; i++) {
    if (habits[i].id === id) {
      var idx = habits[i].entries.indexOf(date);
      if (idx > -1) {
        habits[i].entries.splice(idx, 1);
      } else {
        habits[i].entries.push(date);
      }
      updateLongest(habits[i]);
      break;
    }
  }
}

// delete a habit by id
function deleteHabit(id) {
  var newList = [];
  for (var i = 0; i < habits.length; i++) {
    if (habits[i].id !== id) {
      newList.push(habits[i]);
    }
  }
  habits = newList;
}

// calculate current streak (count back from today)
function calcCurrentStreak(habit) {
  var streak = 0;
  var d = new Date(today());
  while (habit.entries.indexOf(formatDate(d)) !== -1) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// update the longest streak ever
function updateLongest(habit) {
  var dates = habit.entries.slice().sort();
  var max = 0;
  var curr = 1;
  for (var i = 1; i < dates.length; i++) {
    var prev = new Date(dates[i-1]);
    var now = new Date(dates[i]);
    if ((now - prev) === 24*60*60*1000) {
      curr++;
    } else {
      if (curr > max) { max = curr; }
      curr = 1;
    }
  }
  if (curr > max) { max = curr; }
  habit.longestStreak = max;
}

// format Date to 'YYYY-MM-DD'
function formatDate(d) {
  return d.toISOString().split('T')[0];
}
function today() {
  return formatDate(new Date());
}

// handle form submit
document.getElementById('habit-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var name = document.getElementById('habit-name').value.trim();
  var freq = document.getElementById('habit-frequency').value;
  if (name) {
    habits.push({
      id: Date.now().toString(), // simple id
      name: name,
      frequency: freq,
      entries: [],
      longestStreak: 0
    });
    saveHabits();
    renderHabits();
    e.target.reset();
  }
});

// init on page load
loadHabits();
renderHabits();
