// Habit Tracker Application
class HabitTracker {
  constructor() {
    this.habits = JSON.parse(localStorage.getItem('habits')) || [];
    this.currentWeek = this.getWeekNumber(new Date());
    
    this.initializeEventListeners();
    this.renderHabits();
    this.updateStats();
  }

  // Initialize event listeners
  initializeEventListeners() {
    const habitForm = document.getElementById('habitForm');
    habitForm.addEventListener('submit', (e) => this.handleAddHabit(e));
  }

  // Handle adding a new habit
  handleAddHabit(e) {
    e.preventDefault();
    
    const habitName = document.getElementById('habitName').value.trim();
    const targetFrequency = parseInt(document.getElementById('targetFrequency').value);
    
    if (!habitName) return;
    
    const newHabit = {
      id: Date.now(),
      name: habitName,
      targetFrequency: targetFrequency,
      completions: [],
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0
    };
    
    this.habits.push(newHabit);
    this.saveHabits();
    this.renderHabits();
    this.updateStats();
    
    // Reset form
    document.getElementById('habitForm').reset();
    
    // Show success message
    this.showNotification('Habit added successfully!', 'success');
  }

  // Mark habit as complete for today
  toggleHabitCompletion(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toDateString();
    const existingCompletion = habit.completions.find(c => c.date === today);
    
    if (existingCompletion) {
      // Remove completion
      habit.completions = habit.completions.filter(c => c.date !== today);
    } else {
      // Add completion
      habit.completions.push({
        date: today,
        timestamp: new Date().toISOString()
      });
    }
    
    this.updateStreaks(habit);
    this.saveHabits();
    this.renderHabits();
    this.updateStats();
    
    const action = existingCompletion ? 'removed from' : 'marked as complete for';
    this.showNotification(`Habit ${action} today!`, 'info');
  }

  // Update streak calculations
  updateStreaks(habit) {
    const sortedCompletions = habit.completions
      .map(c => new Date(c.date))
      .sort((a, b) => b - a);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    if (sortedCompletions.length > 0) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Calculate current streak
      let checkDate = new Date(today);
      for (let i = 0; i < 365; i++) { // Check up to a year back
        const dateString = checkDate.toDateString();
        const hasCompletion = habit.completions.some(c => c.date === dateString);
        
        if (hasCompletion) {
          currentStreak++;
        } else {
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      // Calculate longest streak
      let lastDate = null;
      for (const completionDate of sortedCompletions) {
        if (lastDate === null) {
          tempStreak = 1;
        } else {
          const diffTime = Math.abs(lastDate - completionDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        lastDate = completionDate;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;
  }

  // Delete a habit
  deleteHabit(habitId) {
    
      this.habits = this.habits.filter(h => h.id !== habitId);
      this.saveHabits();
      this.renderHabits();
      this.updateStats();
      this.showNotification('Habit deleted successfully!', 'success');
    
  }

  // Render all habits
  renderHabits() {
    const habitsList = document.getElementById('habitsList');
    
    if (this.habits.length === 0) {
      habitsList.innerHTML = `
        <div class="empty-state">
          <h3>No habits yet!</h3>
          <p>Add your first habit to get started on building better routines.</p>
        </div>
      `;
      return;
    }
    
    habitsList.innerHTML = this.habits.map(habit => this.renderHabitCard(habit)).join('');
    
    // Add event listeners to the newly rendered elements
    this.habits.forEach(habit => {
      const completeBtn = document.getElementById(`complete-${habit.id}`);
      const deleteBtn = document.getElementById(`delete-${habit.id}`);
      
      if (completeBtn) {
        completeBtn.addEventListener('click', () => this.toggleHabitCompletion(habit.id));
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteHabit(habit.id));
      }
    });
  }

  // Render individual habit card
  renderHabitCard(habit) {
    const today = new Date().toDateString();
    const isCompletedToday = habit.completions.some(c => c.date === today);
    const thisWeekCompletions = this.getWeekCompletions(habit);
    const progressPercentage = Math.min((thisWeekCompletions / habit.targetFrequency) * 100, 100);
    
    return `
      <div class="habit-card">
        <div class="habit-header">
          <div class="habit-name">${habit.name}</div>
          <button class="delete-btn" id="delete-${habit.id}">🗑️</button>
        </div>
        
        <div class="habit-info">
          <p><strong>Target:</strong> ${habit.targetFrequency} times per week</p>
          <p><strong>This week:</strong> ${thisWeekCompletions}/${habit.targetFrequency}</p>
          <p><strong>Total completions:</strong> ${habit.completions.length}</p>
        </div>
        
        <div class="streak-info">
          <p>🔥 Current streak: ${habit.currentStreak} days</p>
          <p>🏆 Longest streak: ${habit.longestStreak} days</p>
        </div>
        
        <div class="completion-controls">
          <button 
            class="complete-btn ${isCompletedToday ? 'completed' : ''}" 
            id="complete-${habit.id}"
          >
            ${isCompletedToday ? '✓ Completed Today' : 'Mark Complete'}
          </button>
        </div>
        
        <div style="margin-top: 15px;">
          <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #48bb78; height: 100%; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
          </div>
          <small style="color: #718096;">${Math.round(progressPercentage)}% of weekly goal</small>
        </div>
      </div>
    `;
  }

  // Get completions for current week
  getWeekCompletions(habit) {
    const currentWeek = this.getWeekNumber(new Date());
    return habit.completions.filter(completion => {
      const completionDate = new Date(completion.date);
      return this.getWeekNumber(completionDate) === currentWeek;
    }).length;
  }

  // Get week number of the year
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  // Update statistics
  updateStats() {
    const totalHabits = this.habits.length;
    const today = new Date().toDateString();
    const completedToday = this.habits.filter(habit => 
      habit.completions.some(c => c.date === today)
    ).length;
    
    let weeklyProgress = 0;
    if (totalHabits > 0) {
      const totalWeeklyTarget = this.habits.reduce((sum, habit) => sum + habit.targetFrequency, 0);
      const totalWeeklyCompletions = this.habits.reduce((sum, habit) => 
        sum + this.getWeekCompletions(habit), 0
      );
      weeklyProgress = Math.round((totalWeeklyCompletions / totalWeeklyTarget) * 100);
    }
    
    document.getElementById('totalHabits').textContent = totalHabits;
    document.getElementById('completedToday').textContent = completedToday;
    document.getElementById('weeklyProgress').textContent = `${weeklyProgress}%`;
  }

  // Save habits to localStorage
  saveHabits() {
    localStorage.setItem('habits', JSON.stringify(this.habits));
  }

  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#3182ce'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize the habit tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new HabitTracker();
}); 