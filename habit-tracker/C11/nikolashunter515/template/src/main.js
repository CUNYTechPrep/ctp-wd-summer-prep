import {readDb, writeDb} from './CRUD.js';
import {streakCalc, habitCounting, editHabits, removeHabit} from './tackerOps.js';

function habSubmit(){
    const form = document.getElementById('habitSubmit');

    form.addEventListener('submit', function(event){
        event.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('habit');
        let complete = (formData.get('duration') >= formData.get('target-duration'))? true: false;

        const habit = {
            name: formData.get('habit'),
            duration: formData.get('duration'),
            targetduration: formData.get('target-duration'),
            complete: complete,
            date: formData.get('date')
        };
        writeDb(habit);
    });
}

function displayProgress(){
    const form = document.getElementById('progress');

    form.addEventListener('submit', function(event){
        event.preventDefault();
        const formData = new FormData(form);
        let target = formData.get('habit-prog');
        //console.log(target);
        const arr = habitCounting(target);

        let message = `Completed ${arr[0]}, out of ${arr[1]}`;
        console.log(message);
        document.getElementById('cur-progress').textContent = message;

        let streak = streakCalc(target);
        let streakMessage = `Current streak is: ${streak}`;
        document.getElementById('cur-streak').textContent = streakMessage; 
    });
}

function edits(){
    const form = document.getElementById('edit');

    form.addEventListener('submit', function(event){
        event.preventDefault();
        const formData = new FormData(form);
        const remove = formData.get('remove');
        if(remove === 'on'){
            removeHabit(formData.get('hab-name'));
            return;
        }
        editHabits(formData.get('hab-name'), formData.get('attribute'), formData.get('new-val'));
    });
}

habSubmit();
displayProgress();
edits();
const data = {
    name: 'Running',
    duration: 16,
    date: "7/30/2025"
};
//writeDb(data['data']);
console.log(readDb());
//console.log(JSON.parse(localStorage.getItem('habits'))[0]['complete']);
//localStorage.clear('habits');
console.log(readDb().length);
//console.log(streakCalc('running'));