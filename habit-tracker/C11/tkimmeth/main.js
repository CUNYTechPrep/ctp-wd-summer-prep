const KEY = "habits";
let habits = JSON.parse(localStorage.getItem(KEY) || "[]");

const form  = document.getElementById("habitForm");
const input = document.getElementById("habitInput");
const list  = document.getElementById("habitList");

function save() { localStorage.setItem(KEY, JSON.stringify(habits)); }

function render() {
  list.innerHTML = "";
  if (habits.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No habits yet — add one above.";
    list.appendChild(li);
    return;
  }

  habits.forEach((h, i) => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = h.name;

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.textContent = `(streak: ${h.streak})`;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done Today";
    doneBtn.addEventListener("click", () => {
      h.streak += 1;          // increment counter
      save(); render();
    });

    const failBtn = document.createElement("button");
    failBtn.textContent = "Fail (reset)";
    failBtn.addEventListener("click", () => {
      h.streak = 0;           // clear on failure
      save(); render();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      habits.splice(i, 1);
      save(); render();
    });

    li.appendChild(name);
    li.appendChild(streak);
    li.appendChild(doneBtn);
    li.appendChild(failBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  habits.push({ name, streak: 0 });
  input.value = "";
  save(); render();
});

render();
// 