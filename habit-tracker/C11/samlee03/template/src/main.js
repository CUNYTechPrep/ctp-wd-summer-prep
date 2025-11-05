console.log("test");
const habit_list = document.getElementById("habit_list");
const form = document.getElementById("habit_form");

// const getHabits = () => {
//     console.log(form);
//     let data = FormData()
// }

let habits = [];
let saved_habits = [];
form.addEventListener("submit", (event) => {
    event.preventDefault();
    // console.log(event.target);
    let data = new FormData(event.target);
    console.log(Array.from(data.keys()));

    let habit_name = data.get("habit_name");
    let habit_streak = parseInt(data.get("habit_streak"));

    let saved_habit = {
        "habit_name": habit_name,
        "habit_streak": habit_streak
    }
    saved_habits.push(saved_habit);
    // localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem("habit", JSON.stringify(saved_habits));

    habits.push(`${habit_name} with a streak of ${habit_streak}`)
    habit_list.innerHTML = habits.map(habit => `<li>${habit}</li>`);
})
let loaded_habits = JSON.parse(localStorage.getItem('habit'))
console.log(loaded_habits)

// habits.push(`${habit_name} with a streak of ${habit_streak}`)
habit_list.innerHTML = loaded_habits.map(habit => `<li>${habit.habit_name}  with a streak of ${habit.habit_streak}</li>`);


// const storedUserProfile = localStorage.getItem('userProfile');
// if (storedUserProfile) {
//     const userProfile = JSON.parse(storedUserProfile);
//     console.log(userProfile.name); // Outputs: Jane Doe
// }

