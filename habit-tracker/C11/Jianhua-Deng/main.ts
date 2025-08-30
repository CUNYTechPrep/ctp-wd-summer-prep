import { Habit, Category, Difficulty, Preferences } from './src/types';
import { isoDate, calculateCompletionRate } from './src/utils';

// Storage key
type HabitList = Habit[];
const HABITS_KEY = 'habits';

// Load/save
function load<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) as T : null;
}
function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize
const habits: HabitList = load<HabitList>(HABITS_KEY) || [];

// DOM refs
const form = document.getElementById('habit-form') as HTMLFormElement;
const listEl = document.getElementById('habits') as HTMLUListElement;

// Render
export default function render(): void {
  listEl.innerHTML = '';
  habits.forEach(h => {
    const rate = Math.round(calculateCompletionRate(h) * 100);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${h.name}</strong> [${h.category}/${h.difficulty}] Rate: ${rate}%
      <button class="mark">✓</button>
      <button class="delete">✗</button>
    `;

    // Mark up to target times/day
    li.querySelector('.mark')!.addEventListener('click', () => {
      const today = isoDate();
      const count = h.history.filter(d => d === today).length;
      if (count < h.target) {
        h.history.push(today);
        save(HABITS_KEY, habits);
        render();
      }
    });

    // Delete
    li.querySelector('.delete')!.addEventListener('click', () => {
      const idx = habits.findIndex(x => x.id === h.id);
      if (idx !== -1) {
        habits.splice(idx, 1);
        save(HABITS_KEY, habits);
        render();
      }
    });

    listEl.appendChild(li);
  });
}

// Add
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = (document.getElementById('name') as HTMLInputElement).value.trim();
  const cat = (document.getElementById('category') as HTMLSelectElement).value as Category;
  const diff = (document.getElementById('difficulty') as HTMLSelectElement).value as Difficulty;
  const target = parseInt((document.getElementById('target') as HTMLInputElement).value, 10);
  if (!name || isNaN(target) || target < 1) return;
  habits.push({ id: Date.now(), name, category: cat, difficulty: diff, target, history: [] });
  save(HABITS_KEY, habits);
  form.reset();
  render();
});

// Init
window.addEventListener('load', () => render());