

this is old code I wanted to reference

```javascript

addButton.addEventListener("click", () => addHabit(habitName, categories));

function addHabit(habitName, categories, date) {
    if (!habitName.value) throw new Error("User didn't enter name");
    const card = document.createElement("article");
    card.classList.add("habit-card") ;

    const habitHeader = document.createElement("h2");
    const started = document.createElement("p");
    const streak = document.createElement("p");
    const buttons = document.createElement("div");
    const b1 = document.createElement("button");
    const b2 = document.createElement("button");
    if (!date) date = new Date();

    habitHeader.textContent = habitName.value;
    started.textContent = `Started ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    streak.textContent = `Current Streak: 40 days!`;
    b1.textContent = `Mark Complete`;
    b2.textContent = `View Details`;
    b1.id = "complete";
    b2.id = "details";

    buttons.appendChild(b1);
    buttons.appendChild(b2);
    card.appendChild(habitHeader);
    card.appendChild(started);
    card.appendChild(streak);
    card.appendChild(buttons);

    cards.appendChild(card);


    // category function later
    const selectedCategory = categories.options[categories.selectedIndex];
    console.log(selectedCategory.value);

    // store Habit (not local yet)
    const habitId = date.toISOString();
    card.dataset.habitId = habitId;
    habits[habitId] = { 
        name: habitName.value,
        category: selectedCategory.value,
        startDate: date,
        completionDates: [],
    };

    // markcomplete event listener
    card.addEventListener("click", (e) => {
        if (e.target.id == "complete") { 
            completeHabit(card.dataset.habitId) ;
        };
    });
}
```

```html
<form>
    
    <label for="habit_name">Habit Name:</label>
    <input type="text" id="habit_name">

    <label>Category</label>
    <select name="category:" id="categories">
      <option value="health">Health</option>
      <option value="productivity">Productivity</option>
      <option value="learning">Learning</option>
    </select>
    

    <fieldset>
      <legend>Frequency:</legend>
      <label for="daily">Daily</label>
      <input type="radio" name="frequency" id="daily" value="Daily" checked>
      
      <label for="weekly">Weekly</label>
      <input type="radio" name="frequency" id="weekly" value="Weekly">
    </fieldset>

    <input type="checkbox" name="reminders" id="reminders">
    <label for="reminders">Enable reminders</label>

    <button type="button" class="create-button">Create Habit</button>
    <button type="clear">Clear Form</button>
    
  </form>
```

```css
.habit-icon {
    box-sizing: border-box;
    height: 3.75rem;
    width: 3.75rem;
    border-radius: 100%;
    margin-right: 1.25rem;
    background-color: #dedddd;
    background: linear-gradient(45deg, #A4A4A4 0%, #CBCBCB 100%, #757575 100%);
    flex: 0 0 auto;
}

.habit-icon.green:hover {
    background: linear-gradient(45deg, #65B516 0%, #AFF200 100%, #689E42 100%);
}

.habit-card-main:hover .habit-icon {
    border-style: solid;
    border-color:  #5BAAC7;
}

.habit-icon.completed {
    background: linear-gradient(45deg, #5BAAC7 0%, #6ED2FF 100%, #ffffff 100%);
}

/* .calendar-day.test:hover {
    color:#269cc7;
    box-shadow: none;   
    border-style: none;
    
    box-shadow: 
    0px -4px 10px 8px #ffffffdc, 
    0px 5px 10px 0px #a2a2a2;
}

.calendar-day.test {
    color:#269cc7;
    box-shadow: none;   
    border-style: none;
    
    box-shadow:  -50px 5px 10px -40px #f9faf8bc,
    50px 5px 10px -40px #f9faf8bc,
    1px -4px 10px 8px #fffefe, 
    -1px 5px 10px 0px #9c9c9c;
} */
```