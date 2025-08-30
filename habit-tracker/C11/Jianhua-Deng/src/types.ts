export enum Category {
  Health = 'Health',
  Productivity = 'Productivity',
  Social = 'Social',
}
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Habit {
  id: number;
  name: string;
  category: Category;
  difficulty: Difficulty;
  target: number;         // times per week
  history: string[];      // ISO dates
}

export interface Preferences {
  exportCsv: boolean;
}