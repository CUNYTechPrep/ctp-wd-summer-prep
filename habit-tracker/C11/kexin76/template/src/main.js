
const form = document.querySelector("#habit_form"); // Grabs the form element to the habit creation 
const list = document.querySelector('#habit_list'); // Grabs the ul element for habit list
// object for local storage, with methods 
const habitStorage = {
  save_habits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits))
    
  },
  save_date(){
    const date = new Date();
    localStorage.setItem('dateTime', date.toString());
  },
  
  load_habits() {
    return JSON.parse(localStorage.getItem('habits'))
  },
  load_date(){
    return localStorage.getItem('dateTime')
  },
  
  clear_habits() {
    localStorage.removeItem('habits')
    
  },
  clear_date(){
    localStorage.removeItem('dateTime')
  }
};

// habit array
const habits = habitStorage.load_habits() ? habitStorage.load_habits() : []; 
// completed habits array
const completed_habits = localStorage.getItem('completed_habits') ? JSON.parse(localStorage.getItem('completed_habits')) : [];
const current_date = new Date(); 

// when a form is submitted, it creates a habit object and pushes it to the habits array
// Then saves it to local storage and renders the list with the newely added habit
form.addEventListener('submit', (event) =>{
    event.preventDefault();

    const data = new FormData(event.target);
    const dateTime = new Date();
    const habit = ({
        name: data.get('habit_name'),
        target_streak: Number(data.get("target_streak")),
        current_streak: 1,
        created_date: dateTime,
        latest_date: dateTime,
        completed: false
        
    });
    habits.push(habit);
    habitStorage.save_habits(habits);
    renderHabits(habits);
});

// When ever the user clicks one of the follwing button, delete, edit, and complete
list.addEventListener('click', (event) =>{
    if(event.target.tagName !== 'BUTTON'){
        return;
    }
    // gets the parentElement which is the span tag in this case
    // needed so i can get the name of the array to esaily idenify it in the habit array
    const habit = event.target.parentElement.getAttribute('name').split("//");
    const habit_name = habit[0];
    const habit_streak = habit[1];

    if (event.target.id === "delete_button"){
        let index;
        for(let i = 0; i < habits.length; i++){
            if (habits[i]['name'] == habit_name && habits[i]['target_streak'] == habit_streak){
                index = i;
                break;
            }
        }
        habits.splice(index,1);
        renderHabits(habits);

    }
    if (event.target.id === 'edit_button'){
        let index;
        for(let i = 0; i < habits.length; i++){
            if (habits[i]['name'] == habit_name && habits[i]['target_streak'] == habit_streak){
                index = i;
                break;
            }
        }
        edit_habit(event.target.parentElement, habits[index], index);
        
    }
    if (event.target.id === 'complete_button'){
        let index;
        for(let i = 0; i < habits.length; i++){
            if (habits[i]['name'] == habit_name && habits[i]['target_streak'] == habit_streak){
                index = i;
                break;
            }
        }
        finished_habit(habits[index], index);
    }
    habitStorage.save_habits(habits);
})

// Puts all the habits into html text so its readable to the user
const renderHabits = (habits) => {
    const habitList = document.querySelector("#habit_list");
    habitList.innerHTML = habits.map(habit =>{
        return `<li>
        <span name='${habit.name}//${habit.target_streak}'>
        Name: ${habit.name} , Current Streak: ${habit.current_streak} , Target Streak: ${habit.target_streak}  
        <button id='complete_button' type='button'>Complete</button>
        <button id='edit_button' type='button'>Edit</button>
        <button id='delete_button' type='button'>Delete</button>
        </span>
        </li>`
    }).join('\n');
};

// Lists our all the completed habits in another list in the page
const render_completedList = (completed_habits) =>{
    const completedList = document.querySelector('#completed_list');
    completedList.innerHTML = completed_habits.map(habit =>{
        return `<li>
        Name: ${habit.name} , Streak: ${habit.current_streak}, Completed on: ${(new Date(habit.latest_date)).toLocaleString()}
        </li>`
    }).join('\n');
};

// Creates new inputs within in the habit list so that the user name freely edit the name and streak
// added events for when the user edits or cancels the edit
const edit_habit = (parent, habit, index) =>{
    parent.innerHTML = `<input type="text" id="habit_name" name="habit_name" value="${habit['name']}" required> , 
    Current Streak: ${habit['current_streak']} , Target Streak: 
    <input type='number'id='target_streak' min="2" value='${habit['target_streak']}' required>
    <button id='complete_edit' type='button'>Complete</button>
    <button id='cancel_edit' type='button'>Cancel</button>
    `;
    const completeButton = parent.querySelector('#complete_edit');
    const cancelButton = parent.querySelector('#cancel_edit');

    completeButton.addEventListener('click', () => {
    //  Get the new values from the input fields:
    const newHabitName = parent.querySelector('#habit_name').value;
    const newTargetStreak = parent.querySelector('#target_streak').value;
    habit['name'] = newHabitName;
    habit['target_streak'] = newTargetStreak;
    renderHabits(habits);
    });

    cancelButton.addEventListener('click', () => {
    renderHabits(habits)
    });
};

// Once a habit is completed, goes through the process to remove it from the habit array
// also adds the habit to a seperate array for completed ones. 
const finished_habit = (habit, index) => {
    habit['latest_date'] = current_date;
    habit['completed'] = true;
    completed_habits.push(habit);
    localStorage.setItem('completed_habits', JSON.stringify(completed_habits));
    habits.splice(index, 1);
    renderHabits(habits);
    render_completedList(completed_habits);
}

// Increases each habit's streak once there is a new day
const increaseStreak = (habits) => {
    const current_date_string = current_date.toDateString();

    // Gets the latest saved date
    const storage = habitStorage.load_date();
    const storage_date = new Date(storage);
    const storage_date_string = storage_date.toDateString();

    // Checks if the dates are different, if they are then
    // increase the streak by one
    if (current_date_string != storage_date_string ){
        for(let i = 0; i < habits.length; i++){
            habits[i]['current_streak']++;
            if(habits[i]['current_streak'] >= habits[i]['target_streak']){
                finished_habit(habits[i], i);
            }
        }
    }
};

// If the habit array isnt empty, goes through the proper methods
// so it shows the proper information from local storage
if (habits){
    increaseStreak(habits);
    renderHabits(habits);
    render_completedList(completed_habits);
    
    habitStorage.save_date();
}

// Bugs : edit button, the min attribute for target streak doesnt work