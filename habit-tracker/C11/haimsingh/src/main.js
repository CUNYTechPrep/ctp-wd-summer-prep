const habits =[];
document.getElementById("form").addEventListener("submit",(event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const habit = {
        habit: data.get("habValue"),
        streak: Number(data.get("streakValue"))
    };

    habits.push(habit);

    listHabit(habits);
} )

function listHabit(habit){
    const habitList= document.getElementById("createHere")
    habitList.innerHTML="";
    habits.forEach(habit => {
        const li = document.createElement("li");
        li.textContent = habit.habit + ", streak " + habit.streak
        habitList.appendChild(li);
    });
}


