import '../style.css';

const LS_KEY = "habit-tracker:data";
const load = () => JSON.parse(localStorage.getItem(LS_KEY) || "[]");
const save = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));

const fmt = (d) => d.toISOString().slice(0, 10);
const todayStr = () => fmt(new Date());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

let habits = load(); 

function streaks(habit) {
  const days = Object.keys(habit.entries).filter((d) => habit.entries[d]).sort();
  if (!days.length) return { current: 0, longest: 0 };

  if (habit.targetFrequency === "weekly" || habit.targetFrequency === "custom") {
    const target = habit.targetFrequency === "custom" ? habit.targetCount : 1;
    let current = 0, longest = 0;
    let weekMap = {};

    days.forEach(date => {
      let weekKey = getWeekKey(new Date(date));
      weekMap[weekKey] = (weekMap[weekKey] || 0) + 1;
    });

    const weeks = Object.keys(weekMap).sort();
    weeks.forEach(w => {
      if (weekMap[w] >= target) current++;
      else current = 0;
      longest = Math.max(longest, current);
    });
    return { current, longest };
  }

  const set = new Set(days);
  let longest = 0;
  for (const d of days) {
    const prev = fmt(addDays(new Date(d), -1));
    if (!set.has(prev)) {
      let len = 1, cur = d;
      while (set.has(fmt(addDays(new Date(cur), 1)))) { cur = fmt(addDays(new Date(cur), 1)); len++; }
      if (len > longest) longest = len;
    }
  }
  let current = 0, cursor = new Date();
  while (set.has(fmt(cursor))) { current++; cursor = addDays(cursor, -1); }
  return { current, longest };
}

function getWeekKey(date) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((d - firstDay) / (24*60*60*1000));
  return `${d.getFullYear()}-W${Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7)}`;
}

const form = document.getElementById("new-habit-form");
const nameInput = document.getElementById("habit-name");
const freqSelect = document.getElementById("habit-frequency");
const targetInput = document.getElementById("habit-target");
const list = document.getElementById("habits");
const cardTpl = document.getElementById("habit-card-template");
const errorMsg = document.getElementById("error-msg");

freqSelect.addEventListener("change", () => {
  targetInput.style.display = freqSelect.value === "custom" ? "inline-block" : "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  if (nameExists(name)) {
    showError();
    return;
  }

  const frequency = freqSelect.value;
  const targetCount = frequency === "custom" ? Math.max(1, Number(targetInput.value || 1)) : undefined;

  habits.push({
    id: crypto.randomUUID(),
    name,
    targetFrequency: frequency,
    targetCount,
    createdAt: todayStr(),
    entries: {}
  });
  save(habits);
  form.reset();
  targetInput.style.display = "none";
  hideError();
  render();
});


function toggleDate(habitId, dateStr) {
  const h = habits.find((x) => x.id === habitId);
  if (!h) return;
  h.entries[dateStr] = !h.entries[dateStr];
  save(habits);
  render();
}

function editHabit(habitId) {
  const h = habits.find((x) => x.id === habitId);
  if (!h) return;

  const input = prompt("Update habit name:", h.name);
  if (input === null) return;         
  const next = input.trim();
  if (!next) return;                  

  if (norm(next) === norm(h.name)) return;

  if (nameExists(next, h.id)) {
    showError();
    return;
  }

  h.name = next;
  save(habits);
  render();
}


function deleteHabit(habitId) {
  const h = habits.find((x) => x.id === habitId);
  if (!h) return;

  const ok = window.confirm(`are you sure you want to Delete "${h.name}"? You cannot get this back.`);
  if (!ok) return;

  habits = habits.filter((x) => x.id !== habitId);
  save(habits);
  render();
}

function renderCalendar(container, habit) {
  container.innerHTML = "";

  const header = document.createElement("div");
  header.className = "weekday-row";
  const daysGrid = document.createElement("div");
  daysGrid.className = "days";
  container.appendChild(header);
  container.appendChild(daysGrid);

  ["S","M","T","W","T","F","S"].forEach(w => {
    const el = document.createElement("div");
    el.className = "wd";
    el.textContent = w;
    header.appendChild(el);
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    const blank = document.createElement("div");
    daysGrid.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = d.toISOString().slice(0, 10);
    const done = !!habit.entries[key];

    const cell = document.createElement("button");
    cell.type = "button"; 
    cell.className = "cell" + (done ? " done" : "") + (key === todayStr() ? " today" : "");
    cell.setAttribute("aria-pressed", String(done));
    cell.title = key;
    cell.textContent = String(day);
    cell.addEventListener("click", () => toggleDate(habit.id, key));

    daysGrid.appendChild(cell);
  }
}

function freqLabel(h) {
  return h.targetFrequency === "custom" ? `Custom: ${h.targetCount}/week`
    : h.targetFrequency[0].toUpperCase() + h.targetFrequency.slice(1);
}

function render() {
  list.innerHTML = "";
  if (!habits.length) {
    const p = document.createElement("p");
    p.textContent = "No habits yet 🥲. You could add one above!";
    list.appendChild(p);
    return;
  }
  for (const h of habits) {
    const node = cardTpl.content.cloneNode(true);
    node.querySelector(".habit-title").textContent = h.name;

    const { current, longest } = streaks(h);
    node.querySelector(".freq").textContent = freqLabel(h);
    node.querySelector(".streak").textContent = `Current: ${current}🔥`;
    node.querySelector(".longest").textContent = `Longest: ${longest}🏆`;

    renderCalendar(node.querySelector(".calendar"), h);
    node.querySelector("[data-edit]").addEventListener("click", () => editHabit(h.id));
    node.querySelector("[data-delete]").addEventListener("click", () => deleteHabit(h.id));

    list.appendChild(node);
  }
}

render();
const errorBox  = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
let errorTimer  = null;

const norm = s => s.trim().toLowerCase();

function nameExists(name, exceptId = null) {
  const want = norm(name);
  return habits.some(h => norm(h.name) === want && h.id !== exceptId);
}

function showError(msg = "Two habits can't have the same name 💔") {
  errorText.textContent = msg;
  errorBox.classList.remove("hidden");       
  clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    errorBox.classList.add("hidden");       
  }, 5000);
}

function hideError() {
  errorBox.classList.add("hidden");
}

nameInput.addEventListener("input", hideError);
