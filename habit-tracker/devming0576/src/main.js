// HABIT TRACKER APPLICATION
class HabitTracker {
  constructor() {
    this.habits = [];
    this.completions = new Map();
    this.currentView = 'home';
    this.editingHabitId = null;
    this.charts = {};
    this.init();
  }
  
  init() {
    this.loadFromStorage();
    this.initializeEventListeners();
    this.initializeDarkMode();
    this.switchView('home');
    this.updateTodayDate();
    this.renderAllViews();
  }
  
  initializeEventListeners() {
    document.querySelectorAll('.nav-link, .mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.currentTarget.dataset.view);
      });
    });
    
    document.getElementById('add-habit-btn').addEventListener('click', () => this.showAddHabitModal());
    document.getElementById('add-first-habit-btn').addEventListener('click', () => this.showAddHabitModal());
    document.getElementById('habit-form').addEventListener('submit', (e) => this.handleHabitSubmit(e));
    document.getElementById('cancel-habit-btn').addEventListener('click', () => this.hideHabitModal());
    document.getElementById('close-habit-modal').addEventListener('click', () => this.hideHabitModal());
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => this.toggleDarkMode(e.target.checked));
    document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
    document.getElementById('import-data-btn').addEventListener('click', () => this.importData());
    document.getElementById('delete-all-data-btn').addEventListener('click', () => this.confirmDeleteAllData());
    document.getElementById('confirmation-cancel').addEventListener('click', () => this.hideConfirmationModal());
    document.getElementById('file-input').addEventListener('change', (e) => this.handleFileImport(e));
    
    document.getElementById('habit-modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('habit-modal')) this.hideHabitModal();
    });
    
    document.getElementById('confirmation-modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('confirmation-modal')) this.hideConfirmationModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideHabitModal();
        this.hideConfirmationModal();
      }
    });
  }
  
  switchView(viewName) {
    document.querySelectorAll('.view-content').forEach(view => view.classList.add('hidden'));
    document.getElementById(`${viewName}-view`).classList.remove('hidden');
    document.getElementById(`${viewName}-view`).classList.add('fade-in');
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('text-apple-blue');
      link.classList.add('text-gray-700', 'dark:text-gray-300');
    });
    
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.remove('text-apple-blue');
      btn.classList.add('text-gray-400');
    });
    
    document.querySelectorAll(`[data-view="${viewName}"]`).forEach(element => {
      element.classList.add('text-apple-blue');
      element.classList.remove('text-gray-700', 'dark:text-gray-300', 'text-gray-400');
    });
    
    this.currentView = viewName;
    
    if (viewName === 'home') {
      this.renderTodayHabits();
    } else if (viewName === 'habits') {
      this.renderHabitsList();
    } else if (viewName === 'analytics') {
      this.renderAnalytics();
    }
  }
  
  showAddHabitModal() {
    this.editingHabitId = null;
    document.getElementById('habit-modal-title').textContent = 'Add New Habit';
    document.getElementById('habit-submit-text').textContent = 'Add Habit';
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-description').value = '';
    document.getElementById('habit-time').value = '';
    document.getElementById('interval-days').value = '3';
    document.getElementById('interval-preview').textContent = '3';
    
    // Reset schedule type to weekly
    document.querySelector('input[name="scheduleType"][value="weekly"]').checked = true;
    document.querySelectorAll('input[name="days"]').forEach(input => input.checked = false);
    
    // Update schedule display
    document.querySelectorAll('.schedule-option').forEach(option => option.classList.add('hidden'));
    document.getElementById('weekly-schedule').classList.remove('hidden');
    
    document.getElementById('habit-modal').classList.remove('hidden');
  }
  
  showEditHabitModal(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    this.editingHabitId = habitId;
    document.getElementById('habit-modal-title').textContent = 'Edit Habit';
    document.getElementById('habit-submit-text').textContent = 'Save Changes';
    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-description').value = habit.description || '';
    document.getElementById('habit-time').value = habit.time || '';
    
    // Set schedule type
    const scheduleType = habit.scheduleType || 'weekly';
    document.querySelector(`input[name="scheduleType"][value="${scheduleType}"]`).checked = true;
    
    if (scheduleType === 'weekly') {
      document.querySelectorAll('input[name="days"]').forEach(input => {
        input.checked = habit.days.includes(parseInt(input.value));
      });
    } else if (scheduleType === 'interval') {
      document.getElementById('interval-days').value = habit.intervalDays || 3;
      document.getElementById('interval-preview').textContent = habit.intervalDays || 3;
    }
    
    // Update schedule display
    document.querySelectorAll('.schedule-option').forEach(option => option.classList.add('hidden'));
    document.getElementById(`${scheduleType}-schedule`).classList.remove('hidden');
    
    document.getElementById('habit-modal').classList.remove('hidden');
  }
  
  hideHabitModal() {
    document.getElementById('habit-modal').classList.add('hidden');
    this.editingHabitId = null;
  }
  
  handleHabitSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('habitName').trim();
    const description = formData.get('habitDescription').trim();
    const time = formData.get('habitTime');
    const scheduleType = formData.get('scheduleType');
    
    if (!name) {
      alert('Please enter a habit name');
      return;
    }
    
    let days = [];
    let intervalDays = null;
    
    if (scheduleType === 'weekly') {
      const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
        .map(input => parseInt(input.value));
      
      if (selectedDays.length === 0) {
        alert('Please select at least one day of the week');
        return;
      }
      days = selectedDays;
    } else if (scheduleType === 'daily') {
      days = [0, 1, 2, 3, 4, 5, 6]; // All days
    } else if (scheduleType === 'interval') {
      intervalDays = parseInt(formData.get('intervalDays') || '3');
      if (intervalDays < 1 || intervalDays > 30) {
        alert('Interval days must be between 1 and 30');
        return;
      }
      // For interval habits, we'll calculate which days they should appear
      days = this.calculateIntervalDays(intervalDays);
    }
    
    const habitData = {
      name,
      description,
      time,
      scheduleType,
      days,
      intervalDays
    };
    
    if (this.editingHabitId) {
      const habitIndex = this.habits.findIndex(h => h.id === this.editingHabitId);
      if (habitIndex !== -1) {
        this.habits[habitIndex] = {
          ...this.habits[habitIndex],
          ...habitData
        };
      }
    } else {
      const habit = {
        id: Date.now().toString(),
        ...habitData,
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString().split('T')[0] // For interval tracking
      };
      this.habits.push(habit);
    }
    
    this.saveToStorage();
    this.hideHabitModal();
    this.renderAllViews();
  }
  
  calculateIntervalDays(intervalDays) {
    // For interval habits, we'll use a different approach
    // We'll check if today matches the interval from the start date
    return [0, 1, 2, 3, 4, 5, 6]; // Show on all days, but filter in shouldShowHabitToday
  }
  
  shouldShowHabitToday(habit, date = null) {
    if (!date) {
      date = new Date();
    }
    
    const dayOfWeek = date.getDay();
    
    if (habit.scheduleType === 'daily') {
      return true;
    } else if (habit.scheduleType === 'weekly') {
      return habit.days.includes(dayOfWeek);
    } else if (habit.scheduleType === 'interval') {
      // Calculate days since habit was created
      const startDate = new Date(habit.startDate || habit.createdAt);
      const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
      return daysDiff % habit.intervalDays === 0;
    }
    
    return false;
  }
  
  deleteHabit(habitId) {
    this.showConfirmationModal(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      () => {
        this.habits = this.habits.filter(h => h.id !== habitId);
        
        for (const [date, habitCompletions] of this.completions.entries()) {
          habitCompletions.delete(habitId);
          if (habitCompletions.size === 0) {
            this.completions.delete(date);
          }
        }
        
        this.saveToStorage();
        this.renderAllViews();
        this.hideConfirmationModal();
      }
    );
  }
  
  toggleHabitCompletion(habitId, date = null) {
    if (!date) {
      date = this.formatDate(new Date());
    }
    
    if (!this.completions.has(date)) {
      this.completions.set(date, new Map());
    }
    
    const dayCompletions = this.completions.get(date);
    const isCompleted = dayCompletions.get(habitId) || false;
    dayCompletions.set(habitId, !isCompleted);
    
    this.saveToStorage();
    this.renderAllViews();
  }
  
  renderAllViews() {
    this.renderTodayHabits();
    this.renderHabitsList();
    if (this.currentView === 'analytics') {
      setTimeout(() => this.renderAnalytics(), 100);
    }
  }
  
  renderTodayHabits() {
    const container = document.getElementById('today-habits');
    const noHabitsMessage = document.getElementById('no-habits-today');
    const today = this.formatDate(new Date());
    const todayDate = new Date();
    
    const todayHabits = this.habits.filter(habit => this.shouldShowHabitToday(habit, todayDate));
    
    if (todayHabits.length === 0) {
      container.innerHTML = '';
      noHabitsMessage.classList.remove('hidden');
      return;
    }
    
    noHabitsMessage.classList.add('hidden');
    
    container.innerHTML = todayHabits.map(habit => {
      const isCompleted = this.completions.get(today)?.get(habit.id) || false;
      const streak = this.calculateStreak(habit.id);
      
      return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm card-hover">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button onclick="habitTracker.toggleHabitCompletion('${habit.id}')" 
                      class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-apple-green border-apple-green text-white' 
                          : 'border-gray-300 dark:border-slate-600 hover:border-apple-green'
                      }">
                ${isCompleted ? '✓' : ''}
              </button>
              <div class="flex-1">
                <h3 class="font-medium ${isCompleted ? 'line-through text-gray-500' : ''}">${habit.name}</h3>
                ${habit.description ? `<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${habit.description}</p>` : ''}
                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>Current streak: ${streak} day${streak !== 1 ? 's' : ''}</span>
                  ${habit.time ? `<span>⏰ ${this.formatTime(habit.time)}</span>` : ''}
                </div>
              </div>
            </div>
            <div class="text-2xl">
              ${isCompleted ? '🎉' : '⏳'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  renderHabitsList() {
    const container = document.getElementById('habits-list');
    const noHabitsMessage = document.getElementById('no-habits');
    
    if (this.habits.length === 0) {
      container.innerHTML = '';
      noHabitsMessage.classList.remove('hidden');
      return;
    }
    
    noHabitsMessage.classList.add('hidden');
    
    container.innerHTML = this.habits.map(habit => {
      const streak = this.calculateStreak(habit.id);
      const longestStreak = this.calculateLongestStreak(habit.id);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      let scheduleText = '';
      if (habit.scheduleType === 'daily') {
        scheduleText = 'Every day';
      } else if (habit.scheduleType === 'interval') {
        scheduleText = `Every ${habit.intervalDays} day${habit.intervalDays !== 1 ? 's' : ''}`;
      } else {
        scheduleText = habit.days.map(day => dayNames[day]).join(', ');
      }
      
      return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm card-hover">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-2">${habit.name}</h3>
              ${habit.description ? `<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${habit.description}</p>` : ''}
              <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center space-x-4">
                  <span>📅 ${scheduleText}</span>
                  ${habit.time ? `<span>⏰ ${this.formatTime(habit.time)}</span>` : ''}
                </div>
                <div class="flex space-x-4">
                  <span class="text-apple-green font-medium">
                    Current: ${streak} day${streak !== 1 ? 's' : ''}
                  </span>
                  <span class="text-apple-blue font-medium">
                    Best: ${longestStreak} day${longestStreak !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex space-x-2 ml-4">
              <button onclick="habitTracker.showEditHabitModal('${habit.id}')" 
                      class="p-2 text-apple-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button onclick="habitTracker.deleteHabit('${habit.id}')" 
                      class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  renderAnalytics() {
    if (this.habits.length === 0) {
      document.getElementById('no-analytics-data').classList.remove('hidden');
      return;
    }
    
    document.getElementById('no-analytics-data').classList.add('hidden');
    
    // Cleanup existing charts
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
    
    this.renderCompletionChart();
    this.renderWeeklyChart();
    this.renderStreaksChart();
  }
  
  renderCompletionChart() {
    const canvas = document.getElementById('completion-chart');
    const ctx = canvas.getContext('2d');
    
    let completed = 0;
    let total = 0;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const dayOfWeek = date.getDay();
      
      const dayHabits = this.habits.filter(habit => habit.days.includes(dayOfWeek));
      total += dayHabits.length;
      
      const dayCompletions = this.completions.get(dateStr) || new Map();
      completed += dayHabits.filter(habit => dayCompletions.get(habit.id)).length;
    }
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const missedRate = 100 - completionRate;
    
    this.charts.completion = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Missed'],
        datasets: [{
          data: [completionRate, missedRate],
          backgroundColor: ['#34C759', '#FF3B30'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }
  
  renderWeeklyChart() {
    const canvas = document.getElementById('weekly-chart');
    const ctx = canvas.getContext('2d');
    
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const dayOfWeek = date.getDay();
      
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      const dayHabits = this.habits.filter(habit => habit.days.includes(dayOfWeek));
      const dayCompletions = this.completions.get(dateStr) || new Map();
      const completedCount = dayHabits.filter(habit => dayCompletions.get(habit.id)).length;
      
      data.push(completedCount);
    }
    
    this.charts.weekly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Completed Habits',
          data,
          backgroundColor: '#007AFF',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
            }
          },
          x: {
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  
  renderStreaksChart() {
    const canvas = document.getElementById('streaks-chart');
    const ctx = canvas.getContext('2d');
    
    const habitStreaks = this.habits.map(habit => ({
      name: habit.name,
      streak: this.calculateLongestStreak(habit.id)
    }));
    
    habitStreaks.sort((a, b) => b.streak - a.streak);
    const top5 = habitStreaks.slice(0, 5);
    
    this.charts.streaks = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top5.map(h => h.name.length > 15 ? h.name.substring(0, 15) + '...' : h.name),
        datasets: [{
          label: 'Longest Streak (days)',
          data: top5.map(h => h.streak),
          backgroundColor: '#FF9500',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
            }
          },
          y: {
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  
  calculateStreak(habitId) {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const dayOfWeek = date.getDay();
      
      const habit = this.habits.find(h => h.id === habitId);
      if (!habit || !habit.days.includes(dayOfWeek)) {
        continue;
      }
      
      const dayCompletions = this.completions.get(dateStr);
      if (dayCompletions && dayCompletions.get(habitId)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  calculateLongestStreak(habitId) {
    let longestStreak = 0;
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);
      const dayOfWeek = date.getDay();
      
      const habit = this.habits.find(h => h.id === habitId);
      if (!habit || !habit.days.includes(dayOfWeek)) {
        continue;
      }
      
      const dayCompletions = this.completions.get(dateStr);
      if (dayCompletions && dayCompletions.get(habitId)) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak;
  }
  
  formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  formatTime(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour12 = ((parseInt(hours) + 11) % 12) + 1;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  updateTodayDate() {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    document.getElementById('today-date').textContent = today.toLocaleDateString('en-US', options);
  }
  
  showConfirmationModal(title, message, onConfirm) {
    document.getElementById('confirmation-title').textContent = title;
    document.getElementById('confirmation-message').textContent = message;
    
    const confirmBtn = document.getElementById('confirmation-confirm');
    confirmBtn.onclick = onConfirm;
    
    document.getElementById('confirmation-modal').classList.remove('hidden');
  }
  
  hideConfirmationModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
  }
  
  initializeDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.getElementById('dark-mode-toggle').checked = isDark;
    this.setDarkMode(isDark);
  }
  
  toggleDarkMode(enabled) {
    this.setDarkMode(enabled);
    localStorage.setItem('darkMode', enabled.toString());
    
    if (this.currentView === 'analytics') {
      setTimeout(() => this.renderAnalytics(), 100);
    }
  }
  
  setDarkMode(enabled) {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  exportData() {
    const data = {
      habits: this.habits,
      completions: Array.from(this.completions.entries()).map(([date, habitMap]) => [
        date,
        Array.from(habitMap.entries())
      ]),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${this.formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }
  
  importData() {
    document.getElementById('file-input').click();
  }
  
  handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.habits || !Array.isArray(data.habits)) {
          alert('Invalid backup file format');
          return;
        }
        
        this.showConfirmationModal(
          'Import Data',
          'This will replace all your current habits and data. Are you sure?',
          () => {
            this.habits = data.habits;
            
            if (data.completions) {
              this.completions = new Map(
                data.completions.map(([date, habitArray]) => [
                  date,
                  new Map(habitArray)
                ])
              );
            }
            
            this.saveToStorage();
            this.renderAllViews();
            this.hideConfirmationModal();
            
            alert('Data imported successfully!');
          }
        );
      } catch (error) {
        alert('Error reading backup file: ' + error.message);
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  }
  
  confirmDeleteAllData() {
    this.showConfirmationModal(
      'Delete All Data',
      'This will permanently delete all your habits and progress data. This action cannot be undone.',
      () => {
        this.habits = [];
        this.completions = new Map();
        this.saveToStorage();
        this.renderAllViews();
        this.hideConfirmationModal();
      }
    );
  }
  
  saveToStorage() {
    const data = {
      habits: this.habits,
      completions: Array.from(this.completions.entries()).map(([date, habitMap]) => [
        date,
        Array.from(habitMap.entries())
      ])
    };
    
    localStorage.setItem('habitTracker', JSON.stringify(data));
  }
  
  loadFromStorage() {
    try {
      const data = JSON.parse(localStorage.getItem('habitTracker') || '{}');
      
      this.habits = data.habits || [];
      
      if (data.completions) {
        this.completions = new Map(
          data.completions.map(([date, habitArray]) => [
            date,
            new Map(habitArray)
          ])
        );
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
      this.habits = [];
      this.completions = new Map();
    }
  }
}

function switchView(viewName) {
  habitTracker.switchView(viewName);
}

let habitTracker;

document.addEventListener('DOMContentLoaded', () => {
  habitTracker = new HabitTracker();
});