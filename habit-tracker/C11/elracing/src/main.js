const HabitCategory = {
  HEALTH: "health",
  PRODUCTIVITY: "productivity",
  LEARNING: "learning",
};

const habit = {
  id: "abc123",
  name: "Read Books",
  description: "Read at least 10 pages daily",
  category: HabitCategory.LEARNING,
  targetFrequency: "daily",
  targetCount: 1,
  difficulty: "medium",
  color: "#ff9900",
  createdAt: new Date(),
  isActive: true,
  completions: []
};


const HabitEntry = {
  id: string,
  habitId: string,
  date: string, // YYYY-MM-DD format
  completed: boolean,
  notes: string,
  completedAt: Date,
};

const UserStats = {
  totalHabits: number,
  activeStreaks: number,
  longestStreak: number,
  completionRate: number,
  pointsEarned: number,
};

function calculatePoints(streak) {
  return streak * 10;
}

function calculateStreak(dates) {
    let count = 0;
    for (let i = 0; i < dates.length; i++) {
        count++;
    }
    

    return count;

}

function isHabitCompleted(habit, date) {
  let completed = false;

  for (let i = 0; i < habit.completions.length; i++) {
    if (habit.completions[i] === date) {
      completed = true;
    }

   
  }
    return completed;


}




