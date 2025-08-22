const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const months2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const daysArrayShort = ['Su', 'Mo', 'Tu', 'Wed', 'Th', 'Fr', 'Sa'];

const habitsJson = localStorage.getItem("habits");
let habitsParsed = JSON.parse(habitsJson || "{}", (key, value) => { 
    if (key == "startDate") return new Date(value);
    if (key == "completionDates") return value.map(date => new Date(date));
    return value;
})
let habits = habitsParsed;

const headerDate = document.querySelector(".date");
const cards = document.querySelector(".cards");
const addButton = document.querySelector(".add-habit");
const cardTemplate = document.querySelector("#card-template");
const templateCheckbox = cardTemplate.content.querySelector(".habit-icon");
const sectionButtons = document.querySelector(".habits-list");
const mainSection = document.querySelector(".section1");
const completedSection = document.querySelector(".section2");
const calendar = document.querySelector(".calendar");
let calendarDay = new Date();
calendarDay.setHours(0, 0, 0, 0);
const TODAY = new Date(calendarDay);


const hidden = document.querySelector("#detached-container");
const extenderTemplate = document.querySelector("#extender-template");
const extender = extenderTemplate.content.firstElementChild;
const saveButton = extender.querySelector(".save-habit");
const deleteButton = extender.querySelector(".delete-habit");
const inputTitle = extender.querySelector("#habit_name_input");
const inputTime = extender.querySelector("#time");
const repeatOptions = extender.querySelector(".repeat-options");
const daily = extender.querySelector(".daily");
const weekly = extender.querySelector(".weekly");
const none = extender.querySelector(".none");
const selectDaysTitle = extender.querySelector("#select-days-title");
const daysButtons = extender.querySelector(".days");


let selected = "main";



addButton.addEventListener("click", () => newHabit());
sectionButtons.addEventListener("click", (e) => {
    if (!e.target.classList.contains("selected") && e.target == mainSection) {
        mainSection.classList.add("selected");
        completedSection.classList.remove("selected");
        selected = "main";
        renderHabits("main");
    }
    else if (!e.target.classList.contains("selected") && e.target == completedSection) {
        completedSection.classList.add("selected");
        mainSection.classList.remove("selected");
        selected = "completed";
        renderHabits("completed");
    }
});
headerDate.textContent = `${months2[TODAY.getMonth()]} ${TODAY.getFullYear()}`;
renderHabits("main");


calendar.addEventListener("click", (e) => calendarInteract(e));

function calendarInteract(e) {
    if (e.target == calendar) return;
    for (const child of calendar.children) child.classList.remove("clicked");
    if (e.target.tagName === "DIV") {
        e.target.parentElement.classList.add("clicked");
        const offset = e.target.parentElement.dataset.timeOffset;
        calendarDay.setDate(TODAY.getDate() + Number(offset));             // redundant?
        if (offset == 0) templateCheckbox.classList.remove("disabled");
        else templateCheckbox.classList.add("disabled");
        renderHabits(selected);
    } else {
        e.target.classList.add("clicked");
        const offset = e.target.dataset.timeOffset;
        calendarDay.setDate(TODAY.getDate() + Number(offset));             // redundant?
        if (offset == 0) templateCheckbox.classList.remove("disabled");
        else templateCheckbox.classList.add("disabled");
        renderHabits(selected);
    }
}

function renderCalendar() {
    for (const child of calendar.children) {
        const offset = child.dataset.timeOffset;
        const weekDay = child.querySelector(".cal-day-of-week");
        const numDay = child.querySelector(".cal-day-num");
        let tempDate = new Date();
        tempDate.setDate(TODAY.getDate() + Number(offset));
        weekDay.textContent = daysArrayShort[tempDate.getDay()];
        numDay.textContent = tempDate.getDate();
    }
}
renderCalendar();

function extenderFill(habitId) {
    inputTitle.value = habits[habitId].name;
    inputTime.value = habits[habitId].reminderTime; 
    repeatSet(habits[habitId].repeat);
    renderDays(habits[habitId].repeatDays);
}

function repeatSet(option) {
    weekly.classList.remove("clicked");
    none.classList.remove("clicked");
    daily.classList.remove("clicked");
    selectDaysTitle.classList.remove("available");
    daysButtons.classList.remove("available");
    let clear = false;
    switch (option) {
        case "daily":
            option = daily;
            break;
        case "weekly":
            option = weekly;
            selectDaysTitle.classList.add("available");
            daysButtons.classList.add("available");
            break;
        case "none": 
            option = none;
            break;
        default: 
            clear = true;
    }
    if (!clear) option.classList.add("clicked");
}

function setDays(button, habitId) {
    if (typeof button === "string") button = daysButtons.querySelector(`#${button}`);
    const day = button.id;
    button.classList.toggle("clicked");
    if (!habits[habitId].repeatDays) habits[habitId]["repeatDays"] = []; // for cards created and stored with my old code  
    let repeatDays = habits[habitId].repeatDays; 
    const index = repeatDays.indexOf(day);
    if (index != -1) repeatDays.splice(index, 1);
    else repeatDays.push(button.id);
    localUpdate();
}

function renderDays(daysList) { 
    if (!daysList) throw new Error("input undefined");
    renderDaysEmpty();
    for (const day of daysList) {
        let button = daysButtons.querySelector(`#${day}`);
        button.classList.add("clicked");  
    }
}

function renderDaysEmpty() {
    for (const day of daysArray) {
        let button = daysButtons.querySelector(`#${day}`);
        button.classList.remove("clicked");  
    }
}

function extenderClear() {
    inputTitle.value = "";
    inputTime.value = "10:00";  //
    repeatSet("daily");
    for (const day of daysArray) renderDaysEmpty();
}

function habitInteract(e, article, habitId) {
    const habitTop = article.querySelector(".habit-card-main");
    const completedStatus = article.querySelector(".status"); 
    const completionIcon = article.querySelector(".habit-icon"); 
    const streakElement = article.querySelector(".streak");
    const circularProgress = article.querySelector(".circular-progress");
    const progressText = circularProgress.querySelector("text");
    const calDayElement = document.querySelector(".clicked");

    if (e.target == saveButton) {
        hidden.appendChild(extender);
        changeHabit(article); 
    } else if (e.target == deleteButton) {
        hidden.appendChild(extender);
        article.remove();
        delete habits[habitId]; 
        localUpdate();
    } else if (e.target == completionIcon) {
        if (calDayElement.dataset.timeOffset != 0) {
            // do nothing, disabled button
        }
        else if (completedStatus.textContent == "completed ☑️") {
            completedStatus.textContent = "unfinished";
            completionIcon.classList.remove("completed");
            habits[habitId].completionDates.splice(-1);
            localUpdate();

            streakElement.textContent = getStreakString(habitId);
            const completionPercent = getCompletionPercent(habitId);
            circularProgress.style.setProperty('--progress', completionPercent);
            progressText.textContent = `${completionPercent}%`;
        } else {
            completedStatus.textContent = "completed ☑️"
            completionIcon.classList.add("completed");
            habits[habitId].completionDates.push(new Date());
            localUpdate();

            streakElement.textContent = getStreakString(habitId);
            const completionPercent = getCompletionPercent(habitId);
            circularProgress.style.setProperty('--progress', completionPercent);
            progressText.textContent = `${completionPercent}%`;
        }
    } else if (circularProgress.contains(e.target)) { // don't want to expand because this element has a doubleclick action
    } else if (repeatOptions.contains(e.target)) {
        if (e.target.classList.contains("daily")) {
            getCompletionPercent(habitId, "daily");
            habits[habitId].repeat = "daily";
            repeatSet("daily");
        } else if (e.target.classList.contains("weekly")) {
            getCompletionPercent(habitId, "weekly");
            habits[habitId].repeat = "weekly";
            repeatSet("weekly");
        } else if (e.target.classList.contains("none")) {
            getCompletionPercent(habitId, "none"); 
            habits[habitId].repeat = "none";
            repeatSet("none");
        } else console.log("bugged repeat selector?");
        localUpdate();
    } else if (daysButtons.contains(e.target) && e.target != daysButtons) {
        getCompletionPercent(habitId, e.target.id);
        setDays(e.target, habitId);
    } else if (habitTop.contains(e.target) && article.querySelector(".habit-card-extender")) {
        changeHabit(article);
        hidden.appendChild(extender);
    } else if (!article.querySelector(".habit-card-extender")) { 
        article.appendChild(extender);
        extenderFill(habitId);
    } 
}

function habitInteractDouble(e, article, habitId) {
    const circularProgress = article.querySelector(".circular-progress");
    if (circularProgress.contains(e.target)) {
        hidden.appendChild(extender);
        article.remove();
        delete habits[habitId]; 
        localUpdate();
    }
}

function newHabit() {
    if (completedSection.classList.contains("selected")) {
        mainSection.dispatchEvent(new CustomEvent("click", {bubbles:true}));
    }
    const clone = cardTemplate.content.cloneNode(true);
    const article = clone.querySelector("article");
    const habitId = storeHabit(article);
    extenderClear(habitId);
    article.appendChild(extender);
    

    article.addEventListener("click", (e) => habitInteract(e, article, habitId));
    article.addEventListener("keyup", (e) => keydownToClick);
    article.addEventListener("dblclick", (e) => habitInteractDouble(e, article, habitId));
    cards.appendChild(clone);
}

function renderHabits(section) {
    renderClear();
    let main = (section == "main") ? true : false;
    for (const habitId of Object.keys(habits)) {
        const clone = cardTemplate.content.cloneNode(true);
        const article = clone.querySelector("article");
        
        
        const habitTop = article.querySelector(".habit-card-main");
        const completedStatus = article.querySelector(".status"); 
        const completionIcon = article.querySelector(".habit-icon"); 
        const streak = article.querySelector(".streak");
        const circularProgress = article.querySelector(".circular-progress");
        const progressText = circularProgress.querySelector("text");
        
        const timeframe = habits[habitId].repeat;
        const completionDates = habits[habitId].completionDates;
        const repeatDays = habits[habitId].repeatDays;
        if (!habits[habitId].repeatChanges) oldCardCompletionFix(habitId);
        const completionPercent = getCompletionPercent(habitId);
        const oneDayInMs = 1000 * 60 * 60 * 24;
        const today = new Date(calendarDay); /*marker for later*/ 

        article.dataset.habitId = habitId;  
        if (completionDates && isSameTimeframe(timeframe, repeatDays, today, completionDates.at(-1))) {
            completedStatus.textContent = "completed ☑️";
            completionIcon.classList.add("completed");
            if (main) continue;
        } else {
            if (!main) continue;
        }   

        article.addEventListener("click", (e) => habitInteract(e, article, habitId));
        article.addEventListener("keydown", (e) => keydownToClick(e));
        article.addEventListener("dblclick", (e) => habitInteractDouble(e, article, habitId)); 
        
        // from changehabit function
        const titleElement = article.querySelector(".habit-title");
        const timeElement = article.querySelector(".time");
        titleElement.textContent = habits[habitId].name;
        timeElement.textContent = convert24to12(habits[habitId].reminderTime || "10:00");
        streak.textContent = getStreakString(habitId);
        circularProgress.style.setProperty('--progress', completionPercent);
        progressText.textContent = `${completionPercent}%`;
        cards.appendChild(clone);
    }
}

function oldCardCompletionFix(habitId) {
    const habit = habits[habitId];
    habit["repeatChanges"] = {changeDate:habit.startDate, lastCount: 1};
    localUpdate();
}

function repeatChangesReset() {
    for (const habitId of Object.keys(habits)) {
        const habit = habits[habitId];
        habit["repeatChanges"] = {changeDate:habit.startDate, lastCount: 1};
        localUpdate();
    }
}

function getCompletionPercent(habitId, repeatChange) {
    const repeat = habits[habitId].repeat;
    const lastRepeatChange = new Date(habits[habitId].repeatChanges.changeDate);
    const lastCount = habits[habitId].repeatChanges.lastCount;
    lastRepeatChange.setHours(0,0,0,0);
    let completions = habits[habitId].completionDates.length;
    
    if (repeat === "daily" || repeat === "none") {
        let daysElapsed = ((TODAY - lastRepeatChange) / (1000 * 60 * 60 * 24)); 
        const percentCompleted = (completions / (daysElapsed + lastCount)) * 100;     
        updateRepeatChanges(habitId, (daysElapsed + lastCount));
        localUpdate();
        return Math.round(percentCompleted);
    }
    else if (repeat === "weekly") {
        const repeatDays = habits[habitId].repeatDays;
        let validDaysElapsed = lastCount; // changed from 0;
        for (const dayOfWeek of repeatDays) {
            let lastSuch = calcLastSuchDay(dayOfWeek, TODAY);
            let daysElapsed = ((lastSuch - lastRepeatChange) / (1000 * 60 * 60 * 24)); 
            let suchDaysElapsed = 0;
            while (lastSuch > lastRepeatChange) {
                suchDaysElapsed++;
                lastSuch.setDate(lastSuch.getDate() - 1);
                lastSuch = calcLastSuchDay(dayOfWeek, new Date(lastSuch));
            }
            validDaysElapsed += suchDaysElapsed;
        }
        const percentCompleted = (completions / (validDaysElapsed || 1)) * 100; // patched new habit weekly behavior... not confident that this is a robust solution
        updateRepeatChanges(habitId, validDaysElapsed);
        localUpdate();
        return Math.round(percentCompleted);
    }
    throw new error("getCompletionPercent()'s habit parameter has invalid repeat value");
}

function updateCompletionPercent(article, habitId) {
    habitId = article.dataset.habitId;
    const circularProgress = article.querySelector(".circular-progress");
    const progressText = circularProgress.querySelector("text");
    const completionPercent = getCompletionPercent(habitId);
    circularProgress.style.setProperty('--progress', completionPercent);
    progressText.textContent = `${completionPercent}%`;
}

function updateRepeatChanges(habitId, currentCount) {
    const WEEKDAY = daysArray[TODAY.getDay()];
    let yesterday = new Date();
    yesterday.setDate(TODAY.getDate() - 1); 
    if (habits[habitId].repeatDays.includes(WEEKDAY) || habits[habitId].repeat != "weekly") currentCount--;
    habits[habitId].repeatChanges = {changeDate: yesterday, lastCount: currentCount};
}

function updateStreak(article, habitId) {
    habitId = article.dataset.habitId;
    const streak = article.querySelector(".streak");
    streak.textContent = getStreakString(habitId);
}

function toggleComplete(article, habitId) {                          // unused
    const completedStatus = article.querySelector(".status"); 
    const completionIcon = article.querySelector(".habit-icon");
    habitId = article.dataset.habitId;
    if (completedStatus.textContent == "completed ☑️") {
        completedStatus.textContent = "unfinished";
        completionIcon.classList.remove("completed");
        habits[habitId].completionDates.splice(-1);
        localUpdate();

        streakElement.textContent = getStreakString(habitId);
        const completionPercent = getCompletionPercent(habitId);
        circularProgress.style.setProperty('--progress', completionPercent);
        progressText.textContent = `${completionPercent}%`;
    } else {
        completedStatus.textContent = "completed ☑️"
        completionIcon.classList.add("completed");
        habits[habitId].completionDates.push(new Date());
        localUpdate();

        streakElement.textContent = getStreakString(habitId);
        const completionPercent = getCompletionPercent(habitId);
        circularProgress.style.setProperty('--progress', completionPercent);
        progressText.textContent = `${completionPercent}%`;
    }
}

function renderClear() {
    cards.replaceChildren();
}

function localUpdate() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function storeHabit(article) {
    date = new Date();
    date.setDate(TODAY.getDate() - 1);
    const habitId = date.toISOString();
    article.dataset.habitId = habitId;
    habits[habitId] = { 
        name: "New Habit",
        startDate: date,
        completionDates: [],
        reminderTime: "10:00",
        repeat: "daily",
        repeatDays: [], //repeatDays: [daysArray[date.getDay()]] maybe
        repeatChanges: {changeDate: date, lastCount: 0}, // date repeat was changed, due dates up to that point
    };
    localUpdate();
    return habitId;
}

function changeHabit(article, repeat) {
    const titleElement = article.querySelector(".habit-title");
    const timeElement = article.querySelector(".time");
    titleElement.textContent = inputTitle.value || "New Habit";
    timeElement.textContent = convert24to12(inputTime.value);

    const habitId = article.dataset.habitId;
    habits[habitId].name = inputTitle.value || "New Habit";
    habits[habitId].reminderTime = inputTime.value;
    localUpdate();

    updateCompletionPercent(article);
    updateStreak(article);
}

function convert24to12(time) {
    let timeParts = time.split(":");
    const date = new Date();
    date.setHours(timeParts[0], timeParts[1]);

    const time12hr = date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return time12hr;
}

function isSameTimeframe(repeat, repeatDays, date1, lastCompletedDate) { 
    if (!lastCompletedDate) return false;

    date1.setHours(0, 0, 0, 0);
    lastCompletedDate.setHours(0, 0, 0, 0);
    if (repeat === "daily") {
        return date1.getTime() === lastCompletedDate.getTime();
    }
    else if (repeat === "weekly") {
        for (const weekday of repeatDays) {
            const lastSuchDay = calcLastSuchDay(weekday);
            if (lastSuchDay > lastCompletedDate) return false;
        }
        return true;
    }
    else if (repeat === "none") {
        return true; 
    }
}

function isSameTimeframe2(repeat, repeatDays, date1, lastCompletedDate) { // might be able to replace first one I need to check
    if (!lastCompletedDate) return false;

    date1.setHours(0, 0, 0, 0);
    lastCompletedDate.setHours(0, 0, 0, 0);
    if (repeat === "daily") {
        let diff = date1 - lastCompletedDate;
        diff = diff / (1000 * 60 * 60 * 24);
        return diff <= 1;
    }
    else if (repeat === "weekly") {
        for (const weekday of repeatDays) {
            let lastSuchDay = calcLastSuchDay(weekday, date1);
            lastSuchDay.setDate(lastSuchDay.getDate() - 1);
            lastSuchDay = calcLastSuchDay(weekday, lastSuchDay);
            if (lastSuchDay > lastCompletedDate) return false;
        }
        return true;
    }
    else if (repeat === "none") {
        return true; 
    }
}

function calcLastSuchDay(day, date1) {
    const today = new Date(date1 ?? calendarDay); /*marker for later*/
    const lastDayNumber = daysArray.indexOf(day);
    const todayNumber = today.getDay();
    let diff = todayNumber - lastDayNumber;
    if (diff < 0) diff += 7;
    const lastSuch = new Date(date1 ?? calendarDay); /*marker for later*/
    lastSuch.setDate(lastSuch.getDate() - diff);
    lastSuch.setHours(0,0,0,0);
    return lastSuch;
}

function getStreakString(habitId) {
    const completionDates = habits[habitId].completionDates;
    const length = completionDates.length;

    const timeframe = habits[habitId].repeat;    
    const repeatDays = habits[habitId].repeatDays;

    let recentStreak = 1; 

    for (let i=length-1; i>0; i--) {
        if (isSameTimeframe2(timeframe, repeatDays, completionDates[i], completionDates[i-1])) {
            recentStreak++;
        } else {
            break;
        }
    }

    if (length > 1 && !isSameTimeframe2(timeframe, repeatDays, TODAY, completionDates.at(-1))) return ``;
    else if (length > 1 && isSameTimeframe2(timeframe, repeatDays, completionDates.at(-1), completionDates.at(-2))) return `🌀${recentStreak}`;
    else if (length >= 1 && isSameTimeframe2(timeframe, repeatDays, TODAY, completionDates.at(-1))) return `🌀${recentStreak}`;
    else return ``;
}

function keydownToClick(e) {
    if (e.key === 'Enter') {
        if (e.target.tagName === "BUTTON") return;
        e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
}




// later:
// properly change completion status when repeat settings are updated
//
// streak behavior weird when you change to repeat = none. 