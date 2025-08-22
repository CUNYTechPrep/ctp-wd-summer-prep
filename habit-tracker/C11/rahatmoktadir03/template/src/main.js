// Habit Tracker - Week 1 Implementation
// Vanilla JavaScript with Local Storage

class HabitTracker {
  constructor() {
    this.habits = this.loadHabits();
    this.habitEntries = this.loadHabitEntries();
    this.init();
  }

  // Initialize the application
  init() {
    this.setupEventListeners();
    this.updateCurrentDate();
    this.renderHabits();
    this.updateStats();
    this.renderHistory();
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Add habit form
    document
      .getElementById("add-habit-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addHabit(e);
      });

    // Edit habit form
    document
      .getElementById("edit-habit-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveEditHabit(e);
      });

    // Frequency change handler
    document
      .getElementById("habit-frequency")
      .addEventListener("change", (e) => {
        this.toggleCustomCount(
          "custom-count-group",
          e.target.value === "custom"
        );
      });

    document
      .getElementById("edit-habit-frequency")
      .addEventListener("change", (e) => {
        this.toggleCustomCount(
          "edit-custom-count-group",
          e.target.value === "custom"
        );
      });

    // Modal controls
    document
      .getElementById("close-edit-modal")
      .addEventListener("click", () => {
        this.closeModal();
      });

    document.getElementById("cancel-edit").addEventListener("click", () => {
      this.closeModal();
    });

    // History filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterHistory(e.target.dataset.period);
      });
    });

    // Close modal on outside click
    document.getElementById("edit-modal").addEventListener("click", (e) => {
      if (e.target.id === "edit-modal") {
        this.closeModal();
      }
    });
  }

  // Toggle custom count field visibility
  toggleCustomCount(groupId, show) {
    const group = document.getElementById(groupId);
    group.style.display = show ? "flex" : "none";
  }

  // Add new habit
  addHabit(event) {
    const formData = new FormData(event.target);
    const habitData = {
      id: this.generateId(),
      name: formData.get("habitName").trim(),
      category: formData.get("category"),
      frequency: formData.get("frequency"),
      targetCount:
        formData.get("frequency") === "custom"
          ? parseInt(formData.get("targetCount"))
          : null,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    if (!habitData.name) {
      this.showMessage("Please enter a habit name", "error");
      return;
    }

    this.habits.push(habitData);
    this.saveHabits();
    this.renderHabits();
    this.updateStats();
    event.target.reset();
    this.showMessage("Habit added successfully!", "success");
  }

  // Edit habit
  editHabit(habitId) {
    const habit = this.habits.find((h) => h.id === habitId);
    if (!habit) return;

    // Populate edit form
    document.getElementById("edit-habit-id").value = habit.id;
    document.getElementById("edit-habit-name").value = habit.name;
    document.getElementById("edit-habit-category").value = habit.category;
    document.getElementById("edit-habit-frequency").value = habit.frequency;

    if (habit.frequency === "custom") {
      document.getElementById("edit-habit-count").value =
        habit.targetCount || 3;
      this.toggleCustomCount("edit-custom-count-group", true);
    } else {
      this.toggleCustomCount("edit-custom-count-group", false);
    }

    this.showModal();
  }

  // Save edited habit
  saveEditHabit(event) {
    const formData = new FormData(event.target);
    const habitId =
      formData.get("habitId") || document.getElementById("edit-habit-id").value;

    const habitIndex = this.habits.findIndex((h) => h.id === habitId);
    if (habitIndex === -1) return;

    const updatedHabit = {
      ...this.habits[habitIndex],
      name: formData.get("habitName").trim(),
      category: formData.get("category"),
      frequency: formData.get("frequency"),
      targetCount:
        formData.get("frequency") === "custom"
          ? parseInt(formData.get("targetCount"))
          : null,
    };

    if (!updatedHabit.name) {
      this.showMessage("Please enter a habit name", "error");
      return;
    }

    this.habits[habitIndex] = updatedHabit;
    this.saveHabits();
    this.renderHabits();
    this.updateStats();
    this.closeModal();
    this.showMessage("Habit updated successfully!", "success");
  }

  // Delete habit
  deleteHabit(habitId) {
    if (
      !confirm(
        "Are you sure you want to delete this habit? This action cannot be undone."
      )
    ) {
      return;
    }

    this.habits = this.habits.filter((h) => h.id !== habitId);
    this.habitEntries = this.habitEntries.filter((e) => e.habitId !== habitId);
    this.saveHabits();
    this.saveHabitEntries();
    this.renderHabits();
    this.updateStats();
    this.renderHistory();
    this.showMessage("Habit deleted successfully!", "success");
  }

  // Toggle habit completion for today
  toggleHabitCompletion(habitId) {
    const today = this.formatDate(new Date());
    const existingEntry = this.habitEntries.find(
      (e) => e.habitId === habitId && e.date === today
    );

    if (existingEntry) {
      existingEntry.completed = !existingEntry.completed;
      existingEntry.completedAt = existingEntry.completed
        ? new Date().toISOString()
        : null;
    } else {
      this.habitEntries.push({
        id: this.generateId(),
        habitId: habitId,
        date: today,
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }

    this.saveHabitEntries();
    this.renderHabits();
    this.updateStats();
    this.renderHistory();
  }

  // Calculate streak for a habit
  calculateStreak(habitId) {
    const entries = this.habitEntries
      .filter((e) => e.habitId === habitId && e.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (entries.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    let checkDate = new Date(today);

    // Calculate current streak (consecutive days from today backwards)
    for (let i = 0; i < 365; i++) {
      // Check up to a year back
      const dateStr = this.formatDate(checkDate);
      const hasEntry = entries.some((e) => e.date === dateStr);

      if (hasEntry) {
        if (i === 0 || currentStreak > 0) {
          // Today or continuing streak
          currentStreak++;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === 0) {
          // No entry for today, check yesterday
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        } else {
          // Streak broken
          tempStreak = 0;
          if (currentStreak === 0) break; // No current streak to maintain
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { current: currentStreak, longest: longestStreak };
  }

  // Calculate completion rate for a habit
  calculateCompletionRate(habitId, days = 30) {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const totalDays = days;
    const completedDays = this.habitEntries.filter(
      (e) =>
        e.habitId === habitId &&
        e.completed &&
        new Date(e.date) >= startDate &&
        new Date(e.date) <= endDate
    ).length;

    return Math.round((completedDays / totalDays) * 100);
  }

  // Check if habit is completed today
  isHabitCompletedToday(habitId) {
    const today = this.formatDate(new Date());
    const entry = this.habitEntries.find(
      (e) => e.habitId === habitId && e.date === today
    );
    return entry ? entry.completed : false;
  }

  // Render all habits
  renderHabits() {
    const container = document.getElementById("habits-container");
    const noHabitsMsg = document.getElementById("no-habits");

    if (this.habits.length === 0) {
      noHabitsMsg.style.display = "block";
      return;
    }

    noHabitsMsg.style.display = "none";
    container.innerHTML = "";

    this.habits.forEach((habit) => {
      const habitCard = this.createHabitCard(habit);
      container.appendChild(habitCard);
    });
  }

  // Create habit card element
  createHabitCard(habit) {
    const isCompleted = this.isHabitCompletedToday(habit.id);
    const streak = this.calculateStreak(habit.id);
    const completionRate = this.calculateCompletionRate(habit.id);

    const card = document.createElement("div");
    card.className = "habit-card fade-in";

    const categoryEmojis = {
      health: "🏃",
      productivity: "💼",
      mindfulness: "🧘",
      social: "👥",
      learning: "📚",
      creativity: "🎨",
      other: "📝",
    };

    card.innerHTML = `
      <div class="habit-header">
        <div class="habit-info">
          <h3>${this.escapeHtml(habit.name)}</h3>
          <span class="habit-category">
            ${categoryEmojis[habit.category] || "📝"} 
            ${this.capitalizeFirst(habit.category)}
          </span>
        </div>
        <div class="habit-actions">
          <button class="btn btn-small btn-secondary" onclick="habitTracker.editHabit('${
            habit.id
          }')">
            ✏️ Edit
          </button>
          <button class="btn btn-small btn-danger" onclick="habitTracker.deleteHabit('${
            habit.id
          }')">
            🗑️ Delete
          </button>
        </div>
      </div>

      <div class="habit-stats">
        <div class="stat-item">
          <span class="value">${streak.current}</span>
          <span class="label">Current Streak</span>
        </div>
        <div class="stat-item">
          <span class="value">${streak.longest}</span>
          <span class="label">Best Streak</span>
        </div>
        <div class="stat-item">
          <span class="value">${completionRate}%</span>
          <span class="label">30-Day Rate</span>
        </div>
        <div class="stat-item">
          <span class="value">${this.capitalizeFirst(habit.frequency)}</span>
          <span class="label">Target</span>
        </div>
      </div>

      <div class="habit-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${completionRate}%"></div>
        </div>
      </div>

      <button class="completion-toggle ${isCompleted ? "completed" : ""}" 
              onclick="habitTracker.toggleHabitCompletion('${habit.id}')">
        <span>${isCompleted ? "✅" : "⭕"}</span>
        <span>${isCompleted ? "Completed Today" : "Mark as Complete"}</span>
      </button>
    `;

    return card;
  }

  // Update statistics
  updateStats() {
    const totalHabits = this.habits.length;
    const today = this.formatDate(new Date());

    const todaysCompletions = this.habitEntries.filter(
      (e) => e.date === today && e.completed
    ).length;

    const activeStreaks = this.habits.filter((habit) => {
      const streak = this.calculateStreak(habit.id);
      return streak.current > 0;
    }).length;

    const completionRate =
      totalHabits > 0 ? Math.round((todaysCompletions / totalHabits) * 100) : 0;

    document.getElementById("total-habits").textContent = totalHabits;
    document.getElementById("active-streaks").textContent = activeStreaks;
    document.getElementById(
      "completion-rate"
    ).textContent = `${completionRate}%`;
  }

  // Update current date display
  updateCurrentDate() {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    document.getElementById("current-date-display").textContent =
      today.toLocaleDateString("en-US", options);
  }

  // Render history
  renderHistory(period = "week") {
    const container = document.getElementById("history-container");
    const days = this.getHistoryDays(period);

    container.innerHTML = "";

    days.forEach((date) => {
      const historyItem = this.createHistoryItem(date);
      container.appendChild(historyItem);
    });

    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.period === period);
    });
  }

  // Get days for history based on period
  getHistoryDays(period) {
    const days = [];
    const today = new Date();
    let daysCount;

    switch (period) {
      case "week":
        daysCount = 7;
        break;
      case "month":
        daysCount = 30;
        break;
      case "all":
        daysCount = 90; // Show last 3 months for "all"
        break;
      default:
        daysCount = 7;
    }

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(this.formatDate(date));
    }

    return days;
  }

  // Create history item
  createHistoryItem(dateStr) {
    const date = new Date(dateStr);
    const dayEntries = this.habitEntries.filter((e) => e.date === dateStr);
    const habitsForDay = this.habits.filter((h) => {
      const habitCreatedDate = new Date(h.createdAt);
      return habitCreatedDate <= date;
    });

    const item = document.createElement("div");
    item.className = "history-item slide-up";

    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const completedCount = dayEntries.filter((e) => e.completed).length;
    const totalCount = habitsForDay.length;

    item.innerHTML = `
      <div class="history-date">
        <strong>${formattedDate}</strong>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">
          ${completedCount}/${totalCount} completed
        </div>
      </div>
      <div class="history-habits">
        ${this.renderHistoryHabits(dayEntries, habitsForDay)}
      </div>
    `;

    return item;
  }

  // Render habits for history item
  renderHistoryHabits(dayEntries, habitsForDay) {
    if (habitsForDay.length === 0) {
      return '<span style="color: var(--text-secondary);">No habits yet</span>';
    }

    return habitsForDay
      .map((habit) => {
        const entry = dayEntries.find((e) => e.habitId === habit.id);
        const completed = entry ? entry.completed : false;

        return `
        <span class="history-habit ${completed ? "completed" : "missed"}">
          ${this.escapeHtml(habit.name)}
        </span>
      `;
      })
      .join("");
  }

  // Filter history
  filterHistory(period) {
    this.renderHistory(period);
  }

  // Modal controls
  showModal() {
    const modal = document.getElementById("edit-modal");
    modal.classList.add("show");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    const modal = document.getElementById("edit-modal");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }, 300);
  }

  // Show success/error messages
  showMessage(message, type = "success") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    const messageEl = document.createElement("div");
    messageEl.className =
      type === "success" ? "success-message" : "error-message";
    messageEl.textContent = message;

    const container = document.querySelector(".container");
    container.insertBefore(messageEl, container.firstChild);

    // Auto-remove message after 3 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 3000);
  }

  // Utility functions
  generateId() {
    return (
      "habit_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Local Storage functions
  loadHabits() {
    try {
      const habits = localStorage.getItem("habitTracker_habits");
      return habits ? JSON.parse(habits) : [];
    } catch (error) {
      console.error("Error loading habits:", error);
      return [];
    }
  }

  saveHabits() {
    try {
      localStorage.setItem("habitTracker_habits", JSON.stringify(this.habits));
    } catch (error) {
      console.error("Error saving habits:", error);
    }
  }

  loadHabitEntries() {
    try {
      const entries = localStorage.getItem("habitTracker_entries");
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error("Error loading habit entries:", error);
      return [];
    }
  }

  saveHabitEntries() {
    try {
      localStorage.setItem(
        "habitTracker_entries",
        JSON.stringify(this.habitEntries)
      );
    } catch (error) {
      console.error("Error saving habit entries:", error);
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    if (
      confirm("Are you sure you want to clear all data? This cannot be undone.")
    ) {
      localStorage.removeItem("habitTracker_habits");
      localStorage.removeItem("habitTracker_entries");
      this.habits = [];
      this.habitEntries = [];
      this.renderHabits();
      this.updateStats();
      this.renderHistory();
      this.showMessage("All data cleared!", "success");
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.habitTracker = new HabitTracker();
});

// Export for testing purposes
if (typeof module !== "undefined" && module.exports) {
  module.exports = HabitTracker;
}
