const form =document.getElementById('habit_form')
const habits=[]

const renderHabits=(habits) =>{
    const habitlist=document.getElementById('habit_list')
    habitlist.innerHTML= (habits.map((habit,index)=>{ 
        return `<li>${habit.name};${habit.targetStreak} <button data-index="${index}"> Delete </button> </li>`}).join('\n'))

        document.querySelectorAll('button[data-index]').forEach(button =>{
            button.addEventListener('click',(e)=>{
                const index=e.target.getAttribute('data-index')
                DeleteHabit(index)
            })
        })
}

const DeleteHabit=(index)=>{
    index=Number(index)
    if (habits[index])
        if(habits[index].targetStreak>1)
           habits[index].targetStreak-=1;
        else
            habits.splice(index,1)
        localStorage.setItem("habits", JSON.stringify(habits))
        renderHabits(habits)
}


const savedHabits=JSON.parse(localStorage.getItem("habits"))

if(savedHabits){
    habits.push(...savedHabits)
    renderHabits(habits)}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data=new FormData(event.target)
    const habit=
             {name: data.get('habit_name'),
             targetStreak:Number(data.get('target_streak'))}

    habits.push(habit)
    localStorage.setItem("habits", JSON.stringify(habits))
    console.log(JSON.stringify(habits))
    renderHabits(habits)

})



