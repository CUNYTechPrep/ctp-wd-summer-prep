//checking to see if connected properly in html
console.log("hi");
// allow to submit form when fnished
const form = document.getElementById('habit_form')


//code given by Mentor shiftp
form.addEventListener('submit', (event) => {
    event.preventDefault()

    const data = new FormData(event.target)

    console.log(Array.form(data.keys()))

    const habit = {
        habitName: data.get('habit_name'),
        targetStreak: Number(data.get('targe_streak'))
    }

    habits.push(habit)
    console.log(habits)
})


//code to append habits
//first functions is for adding and removing habits. this is for the top row, temporarily until i fix layout in html css
let tempParent = document.getElementById("container");

let tempHabit;
 

document.getElementById("submit_habit").onclick = function()
{
    tempHabit = document.getElementById("habit_name").value;
    
    
    let habitBox = document.createElement('div');
    habitBox.innerHTML = `<div class="boxes">
        <div class="text">
      ${tempHabit} 
    </div>
    <p class="streak">Day(s) Completed: 0</p>
    <img class="boximg1" src="./images/newhabit.png"></img>
    <div class="button">
    <button class="complete" onclick="updateStreak(this)">Complete</button>
    <button class="remove" onclick='removeHabit(this)'>Remove Habit</button>
  </div>
  </div>`;
    console.log(habitBox);
  tempParent.appendChild(habitBox);
}




//plan to use this code instead of the first one, nicer to look at in the webpage
document.getElementById("submit_habit2").onclick = function()
{
    tempHabit = document.getElementById("habit_name2").value;
    
    
    let habitBox = document.createElement('div');
    habitBox.innerHTML = `<div class="boxes">
        <div class="text">
      ${tempHabit} 
    </div>
    <p class="streak">Day(s) Completed: 0</p>
    <img class="boximg1" src="./images/newhabit.png"></img>
    <div class="button">
    <button class="complete" onclick="updateStreak(this)">Complete</button>
    <button class="remove" onclick='removeHabit(this)'>Remove Habit</button>
  </div>
  </div>`;
    console.log(habitBox);
  tempParent.appendChild(habitBox);
}
// const renderHabits = (habits) => {
//     const habitList = document.getElementById('habit_list')

//     for(let i = 0; i<habits.length; i++)
//         {
//             cons habit = habits[i]
//         }
// }

function updateStreak(button)
{
  //button specific to distinc t div
  const block = button.closest('.boxes');
  const editStreak = block.querySelector('.streak');

  // let streakText = document.getElementById('streak').textContent;
  let streakText = editStreak.textContent;
  let streakNum = streakText.split(' ');
  let currentNum = streakNum[streakNum.length-1];
  console.log(currentNum);
  let streakNum2 = parseInt(currentNum);

  streakNum2++;
  console.log(streakNum2);
  editStreak.textContent = `Day(s) Completed: ${streakNum2}`;

}

function removeHabit(button)
{
    const block = button.closest('.boxes').remove();
    block.remove();
    console.log("removed habit");
    
}