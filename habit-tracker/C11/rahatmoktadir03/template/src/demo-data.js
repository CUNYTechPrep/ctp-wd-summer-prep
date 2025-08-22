// Demo data for testing the Habit Tracker application
// Run this in the browser console to populate with sample data

function loadDemoData() {
  if (typeof habitTracker === "undefined") {
    console.error(
      "Habit Tracker not loaded yet. Please wait for the page to load completely."
    );
    return;
  }

  if (habitTracker.habits.length > 0) {
    const shouldClear = confirm(
      "You already have habits. Do you want to clear existing data and load demo data?"
    );
    if (!shouldClear) return;
    habitTracker.clearAllData();
  }

  console.log("Loading demo data...");

  // Sample habits
  const demoHabits = [
    {
      id: "demo_habit_1",
      name: "Drink 8 glasses of water",
      category: "health",
      frequency: "daily",
      targetCount: null,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      isActive: true,
    },
    {
      id: "demo_habit_2",
      name: "Read for 30 minutes",
      category: "learning",
      frequency: "daily",
      targetCount: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      isActive: true,
    },
    {
      id: "demo_habit_3",
      name: "Exercise or walk",
      category: "health",
      frequency: "daily",
      targetCount: null,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      isActive: true,
    },
    {
      id: "demo_habit_4",
      name: "Meditate",
      category: "mindfulness",
      frequency: "custom",
      targetCount: 5,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      isActive: true,
    },
    {
      id: "demo_habit_5",
      name: "Call family or friends",
      category: "social",
      frequency: "weekly",
      targetCount: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isActive: true,
    },
  ];

  // Sample habit entries (completions)
  const demoEntries = [];
  const today = new Date();

  // Generate some historical data
  demoHabits.forEach((habit, habitIndex) => {
    const createdDate = new Date(habit.createdAt);

    for (let i = 0; i < 14; i++) {
      const entryDate = new Date(today);
      entryDate.setDate(entryDate.getDate() - i);

      // Only create entries for dates after the habit was created
      if (entryDate >= createdDate) {
        const dateStr = entryDate.toISOString().split("T")[0];

        // Simulate realistic completion patterns
        let shouldComplete = false;

        switch (habitIndex) {
          case 0: // Water - high consistency
            shouldComplete = Math.random() > 0.2; // 80% completion rate
            break;
          case 1: // Reading - moderate consistency
            shouldComplete = Math.random() > 0.3; // 70% completion rate
            break;
          case 2: // Exercise - variable consistency
            shouldComplete = Math.random() > 0.4; // 60% completion rate
            break;
          case 3: // Meditation - lower consistency, custom frequency
            shouldComplete = Math.random() > 0.5; // 50% completion rate
            break;
          case 4: // Social - weekly habit, less frequent
            shouldComplete = Math.random() > 0.6 && entryDate.getDay() === 0; // 40% completion rate, mostly Sundays
            break;
        }

        if (shouldComplete) {
          demoEntries.push({
            id: `demo_entry_${habit.id}_${dateStr}`,
            habitId: habit.id,
            date: dateStr,
            completed: true,
            completedAt: new Date(
              entryDate.getTime() + Math.random() * 24 * 60 * 60 * 1000
            ).toISOString(),
          });
        }
      }
    }
  });

  // Load the demo data
  habitTracker.habits = demoHabits;
  habitTracker.habitEntries = demoEntries;

  // Save to localStorage
  habitTracker.saveHabits();
  habitTracker.saveHabitEntries();

  // Refresh the UI
  habitTracker.renderHabits();
  habitTracker.updateStats();
  habitTracker.renderHistory();

  console.log("Demo data loaded successfully!");
  console.log(
    `Loaded ${demoHabits.length} habits and ${demoEntries.length} completion entries`
  );

  // Show success message
  habitTracker.showMessage(
    "Demo data loaded! You now have sample habits with completion history.",
    "success"
  );
}

// Export function for use in console
window.loadDemoData = loadDemoData;

console.log(
  "Demo data loader ready! Type loadDemoData() in the console to populate with sample habits."
);
