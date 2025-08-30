# Habit Tracker & Wellness Dashboard

A progressive 3-week project where you'll build a comprehensive habit tracking and wellness dashboard application, learning JavaScript, TypeScript, and React along the way.

## 🎯 Project Overview

Create a personal wellness application that helps users track daily habits, monitor their progress, and visualize their journey toward better health and productivity. By the end of this project, you'll have a fully functional web application with data persistence, interactive charts, and a polished user interface.

## 📚 Learning Objectives

By completing this project, you will:

- Master JavaScript fundamentals through practical application
- Understand the benefits of TypeScript's type system in real-world development
- Build interactive user interfaces with React components and hooks
- Implement data persistence and state management
- Create data visualizations for user analytics
- Practice modern web development workflows and best practices

## 🗓️ Weekly Breakdown

### Week 1: JavaScript Foundation
**Focus**: Core functionality with vanilla JavaScript

**Key Concepts**: DOM manipulation, event handling, local storage, date/time operations, array methods

**Starting Point**: Use the provided `template/` directory which includes a basic Vite setup with HTML structure, CSS foundation, and development tooling.

**Deliverables**:
- Basic HTML structure with forms for adding habits (extend the template) Done
- JavaScript functions for habit CRUD operations Done
- Streak calculation and progress tracking logic Done 
- Local storage implementation for data persistence Done 
- Enhanced CSS styling building on the template foundation Done

**Core Features to Implement**:
- Add new habits with custom names and target frequencies Done
- Mark habits as complete for specific dates 
- Calculate current streaks and longest streaks Done 
- View habit completion history 
- Delete or edit existing habits Done 

### Week 2: TypeScript Enhancement
**Focus**: Adding type safety and advanced features

**Key Concepts**: Interfaces, types, enums, generic functions, type guards

**Deliverables**:
- Convert existing JavaScript to TypeScript
- Define comprehensive type definitions
- Implement advanced habit analytics
- Add user preferences and settings
- Create habit categories and difficulty levels

**New Features to Add**:
- Habit categories (Health, Productivity, Social, etc.)
- Difficulty levels and point systems
- Weekly/monthly goal setting
- Statistics calculations (completion rates, trends)
- Data export functionality

### Week 3: React User Interface
**Focus**: Modern, interactive user interface

**Key Concepts**: Components, props, state hooks, effect hooks, conditional rendering, event handling

**Deliverables**:
- Fully functional React application
- Component-based architecture
- Interactive data visualizations
- Responsive design
- Enhanced user experience features

**UI Components to Build**:
- Dashboard with habit overview cards
- Interactive calendar for habit tracking
- Progress charts and analytics
- Habit creation and editing modals
- Settings and preferences panel
- Achievement/milestone celebrations

## 🛠️ Technical Requirements

### Technology Stack
- **Week 1**: HTML5, CSS3, Vanilla JavaScript
- **Week 2**: TypeScript, Advanced CSS
- **Week 3**: React, TypeScript, Modern CSS/Styled Components

### Development Tools
- Git for version control
- GitHub Codespace for this repo
- npm for package management
- TypeScript compiler
- Browser developer tools

## 🚀 Getting Started

### Fork and Clone Setup

1. **Fork this repository** to your GitHub account
2. **Clone your fork** to your local machine or GitHub Codespace
3. **Create your working directory**:
   ```bash
   # Navigate to the habit-tracker directory
   cd habit-tracker
   
   # Create your personal working directory
   mkdir -p <your-cohort>/<your-github-username>
   # Example: mkdir -p C11/johndoe
   
   # Copy the template to your directory
   cp -r template/ <your-cohort>/<your-github-username>/
   cd <your-cohort>/<your-github-username>/
   ```

### Submitting Your Work

1. **Commit your changes** regularly to your fork
2. **Push to your fork** on GitHub
3. **Create a Pull Request** from your fork back to the main repository
4. **Title your PR**: `[Your Cohort] Your Name - Week X Submission`
   - Example: `[C11] John Doe - Week 1 Submission`

### Project Template

This repository includes a `template/` directory with a pre-configured Vite project that provides:
- Modern development environment with hot reloading
- Basic HTML structure and CSS setup
- Package.json with useful development scripts
- Clean starting point for Week 1 implementation

### Week 1 Setup
```bash
# From your personal directory (e.g., C11/johndoe/)
# Install dependencies
npm install

# Start development server
npm run dev
```

**Alternative manual setup** (if you prefer to start from scratch):
```bash
# From your personal directory (e.g., C11/johndoe/)
# Create basic file structure
mkdir css js
touch index.html css/styles.css js/app.js
```

### Week 2 Setup
```bash
# Initialize npm project
npm init -y

# Install TypeScript
npm install -g typescript
npm install --save-dev typescript @types/node

# Create TypeScript config
tsc --init
```

### Week 3 Setup
```bash
# Create React app with TypeScript
npx create-react-app habit-tracker-react --template typescript
cd habit-tracker-react

# Install additional dependencies
npm install recharts date-fns lucide-react
```

## 📋 Core Features

### Essential Features (Must Have)
- ✅ Add, edit, and delete habits
- ✅ Mark habits complete/incomplete for any date
- ✅ Calculate and display current streaks
- ✅ View completion history and statistics
- ✅ Data persistence across browser sessions
- ✅ Responsive design for mobile and desktop

### Enhanced Features (Should Have)
- 📊 Visual progress charts and graphs
- 🎯 Goal setting and tracking
- 🏆 Achievement system and milestones
- 🏷️ Habit categories and tags
- 📱 Daily/weekly summary views
- 🎨 Customizable themes and colors

### Bonus Features (Nice to Have)
- 🔔 Reminder notifications
- 📈 Trend analysis and insights
- 📤 Data export (JSON/CSV)
- 🌙 Dark mode toggle
- 📅 Calendar integration
- 👥 Social sharing capabilities

## 📈 Sample Data Structure

```typescript
interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  targetFrequency: 'daily' | 'weekly' | 'custom';
  targetCount?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
  createdAt: Date;
  isActive: boolean;
}

interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
  completedAt?: Date;
}

interface UserStats {
  totalHabits: number;
  activeStreaks: number;
  longestStreak: number;
  completionRate: number;
  pointsEarned: number;
}
```

## 🎨 Design Guidelines

### Week 1: Functional Design
- Clean, minimal HTML structure
- Basic CSS for readability
- Focus on functionality over aesthetics

### Week 2: Enhanced Styling
- Improved CSS with modern techniques
- Better typography and spacing
- Introduction of color schemes

### Week 3: Modern UI/UX
- Component-based design system
- Smooth animations and transitions
- Professional, polished appearance
- Mobile-first responsive design

## 🧪 Testing Your Application

### Week 1 Testing
- Test all CRUD operations manually
- Verify local storage persistence
- Check streak calculations with various scenarios
- Test edge cases (leap years, month boundaries)

### Week 2 Testing
- Verify TypeScript compilation with no errors
- Test type safety with invalid inputs
- Validate new feature functionality
- Check data migration from Week 1

### Week 3 Testing
- Test all React components individually
- Verify state management and updates
- Check responsive design on different screens
- Test user interaction flows

## 📚 Learning Resources

### JavaScript Resources
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/)
- [Array Methods Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

### React Resources
- [React Documentation](https://react.dev/)
- [React Tutorial](https://react.dev/learn)
- [Hooks Reference](https://react.dev/reference/react)

## 🏆 Project Milestones

### Week 1 Milestones
- [ ] Basic HTML structure complete
- [ ] Habit CRUD operations working
- [ ] Streak calculation implemented
- [ ] Local storage integration
- [ ] Basic styling applied

### Week 2 Milestones
- [ ] All code converted to TypeScript
- [ ] Type definitions created
- [ ] Advanced features implemented
- [ ] No TypeScript compilation errors
- [ ] Enhanced styling complete

### Week 3 Milestones
- [ ] React application structure built
- [ ] All components functional
- [ ] Data visualization working
- [ ] Responsive design implemented
- [ ] Final polish and testing complete

## 🎯 Success Criteria

Your project will be considered successful if:

1. **Functionality**: All core features work as expected
2. **Code Quality**: Clean, readable, and well-organized code
3. **Type Safety**: Proper TypeScript implementation with minimal `any` types
4. **User Experience**: Intuitive and responsive interface
5. **Data Persistence**: Reliable data storage and retrieval
6. **Visual Design**: Professional and appealing appearance

## 🤝 Getting Help

- Use browser developer tools for debugging
- Check the console for error messages
- Read documentation for unfamiliar concepts
- Ask questions during class or office hours
- Collaborate with classmates on understanding concepts (not copying code)

## 📝 Submission Guidelines

1. **Work Location**: All your code should be in `/habit-tracker/<your-cohort>/<your-github-username>/`
2. **Pull Request**: Submit a PR from your fork to the main repository
3. **PR Title Format**: `[Your Cohort] Your Name - Week X Submission`
4. **PR Description**: Include:
   - Brief summary of what you implemented
   - Any challenges you faced
   - Features you're most proud of
5. **Demo**: Be prepared to demonstrate your application during class
6. **Code Quality**: Ensure your code is well-commented and organized

---

**Good luck, and happy coding!** 🚀

Remember: The goal is learning, not perfection. Focus on understanding the concepts and building something you're proud of.