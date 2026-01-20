# Petal Path - Feature & Page Documentation

Welcome to the comprehensive feature and system documentation for **Petal Path**, a premium, Zen-inspired mindfulness and productivity dashboard. Petal Path blends task management, habit building, focus coaching, financial logging, and emotional journaling into a unified workspace.

---

## 1. Authentication & Onboarding

### 🔐 Authentication (`Login.tsx`)
- **Dual-Method Login**: Supports Google One-Tap/Sign-In integration and email-based password authentication.
- **Visual Design**: Sleek glassmorphism container overlaying a soft pink-purple ambient background gradient.

### 🌸 Guided Onboarding (`OnboardingView.tsx`)
- Triggered automatically for first-time users.
- Collects personal parameters:
  - **Wake & Sleep Times**: Personalizes reminders and daily planner schedules.
  - **Core Areas of Improvement**: Tailors AI recommendations (e.g., Focus, Hydration, Sleep, Budget).
  - **Reminders Opt-in**: Toggles daily hydration, posture, and journal notifications.
  - **Onboarding Skip Option**: Users can skip the onboarding and finish it later via a persistent toast reminder.

---

## 2. Shell & Core Interface

### ⚓ Floating Navigation Dock (`Dashboard.tsx`)
- Floating at the bottom of the viewport with a blurred translucent backing (`backdrop-blur-lg`) and custom spring micro-animations.
- **Navigation Tabs**:
  - `Home`: Drag-and-drop widget center.
  - `Goals`: Long-term milestone planner.
  - `Wellness`: Quantitative health telemetry.
  - `Focus`: Deep work timer with soundscapes.
  - `Finance`: Budget tracker.
- **Quick Controls**:
  - **Theme Toggle**: Switch between Light Mode (warm, pastel tones) and Dark Mode (sleek, high-contrast, muted colors).
  - **Lofi Player**: Direct volume control and play/pause for chill beats.
  - **Avatar Menu**: Offers quick access to the user profile, Settings, and Sign Out.

---

## 3. Core Workspace Tabs

### 🏡 Home View (`HomeView.tsx`)
- **Modular Drag-and-Drop**: Built using `@dnd-kit/core` and `@dnd-kit/sortable` with distance-constraint pointer sensors.
- **Dynamic Sizing**: Drag-handles double as context menus allowing widgets to be resized (`small`, `medium`, `large`).
- **User-Scoped Persistence**: Stores layout arrangements and widget sizes in local storage under a unique key containing the user's ID (`petal-home-layout-[userId]`), keeping configurations separate between user accounts.
- **Widget Picker**: Enables toggling widgets in/out of the layout using an intuitive categorised sheet.

### 🎯 Goals View (`GoalsView.tsx`)
- Supports defining high-level goals.
- Groups goals into categorized cards (e.g., Health, Career, Mindfulness) with visual progress sliders.

### 🧘 Wellness View (`WellnessView.tsx`)
- Tracks daily wellness metrics:
  - Water intake tracking.
  - Sleep cycles, workout logging, and healthy eating meals.
  - Interactive charts illustrating weekly and monthly health patterns.

### ⏳ Focus View (`FocusView.tsx`)
- **Pomodoro Timer**: Custom interval timer (Focus, Short Break, Long Break) with sound effects upon completion.
- **Relaxing Sounds**: Toggleable ambient noise loops (e.g., Lofi, gentle rain, forest wind).

### 🪙 Finance View (`FinanceView.tsx`)
- Logs income, expenses, and savings goals.
- **Privacy Blur (Zen Mode)**: Automatically blurs sensitive figures (balances and accounts) until the user hovers over them to prevent accidental exposures.

### 👤 Profile View (`ProfileView.tsx`)
- Displays user statistics, onboarding selections, and achievements.
- **Personalized AI Insights**: Displays custom recommendations generated based on the user's focus goals, water intake, sleep, and budget logs.

---

## 4. Primary Interactive Widgets

- **Todo List (`TodoList.tsx`)**: Organize daily tasks with check-off lists and priority tags.
- **Habit Tracker (`HabitTracker.tsx`)**: Check off habits to build daily and weekly consistency streaks.
- **Daily Planner (`DailyPlanner.tsx`)**: Hourly scheduler for micro-managing tasks throughout the day.
- **Digital Journal (`DigitalJournal.tsx`)**:
  - **Highlights**: Intention setting, biggest win, and highlight of the day.
  - **Tone & Mood**: Select a daily emoji and label the emotional tone of the writing.
  - **Gratitude Tracker**: Input three things you are grateful for each day to build a gratitude streak.
  - **Resets**: Weekly review and monthly reflection panels for mindfulness check-ins.
- **Micro Trackers**: Separate visual cards for `WaterTracker`, `SleepTracker`, `MoodTracker`, `ExerciseTracker`, `MealTracker`, and `EnergyTracker`.

---

## 5. Global Settings Modal (`SettingsView.tsx`)

- **Personalization Tab**:
  - **Accent Colors**: Circular buttons to switch the global primary brand accent immediately (`Rose`, `Lavender`, `Mint`, `Peach`, `Sky`, `Gold`).
  - **Typography Fonts**: Instantly preview and apply fonts globally (`Inter`, `Nunito`, `Outfit`, `Quicksand`, `Comfortaa`).
  - **Time & Date Layout**: Set 12-hour/24-hour modes and change the first day of the week (Sunday/Monday).
- **Notifications Tab**: Turn on/off audio chimes and system reminders.
- **Privacy Tab**: Toggle global Privacy Blur (Zen Mode).
- **Data Management Tab**:
  - **JSON Backup Export**: Download a full JSON file containing the user's local habits, planner tasks, journal entries, and preferences.
  - **Danger Zone**: Wipe all user data and local storage settings by typing `DELETE`.
