import { Habit } from './types';

export function isoDate(d: Date = new Date()): string {
  return d.toISOString().split('T')[0];
}

// completion rate = #completions / (weeks * target)
export function calculateCompletionRate(habit: Habit): number {
  const weeks = Math.max(
    1,
    new Set(habit.history.map(date => date.slice(0, 7))).size
  );
  return habit.history.length / (weeks * habit.target);
}