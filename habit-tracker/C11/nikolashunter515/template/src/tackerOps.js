import {readDb} from './CRUD.js';


export function streakCalc(target){
    //should just return the current streak, for target value.
    const storage = findHabit(target);
    let prev = new Date(storage[0]);
    let streak = (storage[0]['complete'] == true)? 1 : 0;
    let longestStreak = (storage[0]['complete'] == true)? 1 : 0;

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if(storage.length === 1 || storage.length === 0){
        if(storage.length === 1 && storage[0]['complete'] == true){
            return 1;
        }
        return 0;
    }

    for(let i = 1; i < storage.length; i++){
        let current = new Date(storage[i]);
        if(prev.getTime() + day === current.getTime() && storage[i]['complete'] == true){
            streak++;
        }
        else{
            if(streak >= longestStreak && storage[i]['complete'] == true){
                longestStreak = streak;
            }
            streak = 1;
        }
    }
    return streak;
}
//TODO write parse by habit method.
//also returns the habits history.
function findHabit(target){
    const db = readDb();
    const storage = [];

    for(let data of db){
        //console.log(data['name']);
        //console.log(target);
        if(data['name'] === target){
            storage.push(data);
        }
    }

    return storage;
}

//works now
export function removeHabit(target){
    const habits = readDb();
    const storage = [];

    for(let data of habits){
        if(data['name'] !== target){
            storage.push(data);
        }
    }

    localStorage.setItem('habits', JSON.stringify(storage));
}

//works
export function habitCounting(target){
    let totalCount = 0;
    let completedCount = 0;
    let nonCount = 0;

    const db = findHabit(target);
    for(let data in db){
        if(data['completed'] === true){
            completedCount++;
        }
        else{
            nonCount++;
        }
        totalCount++;
    }
    return [completedCount, totalCount];
}

//works now
export function editHabits(name, target, value){
    const db = readDb();

    for(const dat of db){
        if(dat['name'] === name){
            console.log('In here');
            dat['targetduration'] = value;
        }
    }

    localStorage.setItem('habits', JSON.stringify(db));
}