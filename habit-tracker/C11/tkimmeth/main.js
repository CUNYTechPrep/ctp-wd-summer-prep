// Very basic storage
var KEY = "habits";
var habits = JSON.parse(localStorage.getItem(KEY) || "[]");

var form  = document.getElementById("habitForm");
var input = document.getElementById("habitInput");
var list  = document.getElementById("habitList");

function save() {
  localStorage.setItem(KEY, JSON.stringify(habits));
}

// Return "YYYY-MM-DD" for today
function todayStr() {
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1; // 1..12
  var day = d.getDate();
  if (m < 10) m = "0" + m;
  if (day < 10) day = "0" + day;
  return y + "-" + m + "-" + day;
}

// Difference in days between two "YYYY-MM-DD" strings
function diffDays(a, b) {
  var A = new Date(a + "T00:00:00");
  var B = new Date(b + "T00:00:00");
  var ms = B - A;
  return Math.round(ms / 86400000);
}

// Compute current & longest streak from days[]
function calcStreaks(days) {
  // make a copy and sort ASC
  var arr = days.slice();
  arr.sort(); // "YYYY-MM-DD" sorts lexicographically by date

  var longest = 0;
  var run = 0;
  var prev = null;
  for (var i = 0; i < arr.length; i++) {
    if (prev !== null && diffDays(prev, arr[i]) === 1) {
      run = run + 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = arr[i];
  }

  // current = count back from today
  var current = 0;
  var t = todayStr();
  // Walk backwards as long as t is in arr
  while (arr.indexOf(t) !== -1) {
    current = current + 1;
    // go to previous day (build string in a basic way)
    var d = new Date(t + "T00:00:00");
    d.setDate(d.getDate() - 1);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var dd = d.getDate();
    if (m < 10) m = "0" + m;
    if (dd < 10) dd = "0" + dd;
    t = y + "-" + m + "-" + dd;
  }

  return { current: current, longest: longest };
}

function render() {
  list.innerHTML = "";

  if (habits.length === 0) {
    var empty = document.createElement("li");
    empty.textContent = "No habits yet. Add one above.";
    list.appendChild(empty);
    return;
  }

  for (var i = 0; i < habits.length; i++) {
    var h = habits[i];
    // ensure shape
    if (!h.days) h.days = [];

    var li = document.createElement("li");

    var nameSpan = document.createElement("span");
    nameSpan.textContent = h.name;

    // stats
    var s = calcStreaks(h.days);
    var stats = document.createElement("span");
    stats.className = "stats";
    stats.textContent = "(current: " + s.current + ", longest: " + s.longest + ")";

    // toggle today button (complete/incomplete)
    var t = todayStr();
    var hasToday = h.days.indexOf(t) !== -1;
    var toggleBtn = document.createElement("button");
    toggleBtn.textContent = hasToday ? "Undo Today" : "Done Today";
    toggleBtn.addEventListener("click", (function(idx) {
      return function() {
        var T = todayStr();
        var j = habits[idx].days.indexOf(T);
        if (j === -1) {
          habits[idx].days.push(T);
        } else {
          habits[idx].days.splice(j, 1);
        }
        save();
        render();
      };
    })(i));

    // edit name
    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (function(idx) {
      return function() {
        var next = prompt("Edit habit name:", habits[idx].name);
        if (next && next.trim()) {
          habits[idx].name = next.trim();
          save();
          render();
        }
      };
    })(i));

    // delete
    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", (function(idx) {
      return function() {
        habits.splice(idx, 1);
        save();
        render();
      };
    })(i));

    li.appendChild(nameSpan);
    li.appendChild(stats);
    li.appendChild(toggleBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  }
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  var name = input.value.trim();
  if (!name) return;
  habits.push({ name: name, days: [] });
  input.value = "";
  save();
  render();
});

render();