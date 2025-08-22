export function readDb(){
    //should return array of objects.
    const stored = localStorage.getItem("habits");

    if(stored){
        const habs = JSON.parse(stored);
        return habs
    }
    //console.log(length(stored));
}

//this method works.
export function writeDb(habit){
    const stored = JSON.parse(localStorage.getItem("habits")) || [];

    if(stored){
        stored.push(habit);
        localStorage.setItem('habits', JSON.stringify(stored));
        return;
    }
    localStorage.setItme('habits', JSON.stringify(habit));
}

//target is also habit object
export function deleteDb(target){
    habits = readDb();
    habits = habits.filter((name) => name.date === target.date && name.habit === target.habit);

    localStorage.setItem('habits', JSON.stringify(habits));
}