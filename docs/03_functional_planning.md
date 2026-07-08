# Phase 3: Functional Planning

This document defines the strict functional requirements and behaviors (CRUD operations) for every core entity in ProdOS. It serves as the blueprint for the Database Schema (Phase 5) and API Design (Phase 6).

---

## 1. Workspaces
*The root container for context switching.*
- **Create:** Users can create custom workspaces (e.g., "Side Hustle").
- **Read:** Users can view a list of all their workspaces in the sidebar.
- **Update:** Users can rename workspaces or change their associated icon/color.
- **Delete/Archive:** Users can hide workspaces they no longer need.
- **Behavior:** Switching workspaces immediately updates the central widget context without reloading the page.

---

## 2. Goals
*The overarching objectives that filter daily tasks.*
- **Create:** Users can create a goal (e.g., "Learn Next.js", "Marathon Prep").
- **Read:** Goals appear in the left-hand Goals Rail as selectable icons.
- **Update:** Users can edit the title, description, and target date.
- **Delete:** Users can archive or delete completed/abandoned goals.
- **Assign:** Goals must be assigned to a specific Workspace.
- **Track Progress:** Goal progress is calculated based on completed sub-tasks/habits linked to it.

---

## 3. Tasks (Today's Execution)
*The atomic units of work.*
- **Create:** Users can quickly add a task via an inline input.
- **Read:** Tasks are displayed in the active workspace's widget.
- **Update:** Users can edit the text of a task.
- **Complete:** Clicking the checkbox immediately marks it done and moves it to the Completed Drawer.
- **Schedule:** (Future) Assign tasks to future dates.
- **Filter:** Clicking a Goal in the rail filters the task list to only show tasks linked to that goal.
- **Drag/Drop:** (Future) Reorder tasks by priority.

---

## 4. Habits
*Daily recurring actions linked to the Personal Life workspace.*
- **Create:** Users can define a habit (e.g., "Read 10 pages").
- **Log:** Users can mark a habit as done for the current day.
- **Maintain Streak:** The system calculates and displays consecutive days completed.
- **Stats:** Show simple weekly/monthly completion graphs.
- **Reset:** Habits automatically reset their status at midnight.

---

## 5. Finance Records
*The ledger for the Financial Dashboard workspace.*
- **Create:** Users can log investments, expenses, or income.
- **AI Log:** Users can write natural language ("Invested ₹500 in SBI") which is parsed and saved as a structured record.
- **Read:** Records are aggregated into "Net Worth" and displayed by Asset type.
- **Update/Delete:** Users can correct or remove erroneous logs.
- **Behavior:** Net Worth recalculates automatically upon any ledger update.

---

## 6. Global Features
- **Completed Drawer:** Automatically archives completed tasks. Resets visually every Sunday (while keeping data in the backend history).
- **Progress Bar:** The header progress bar calculates `(Completed Tasks / Total Tasks for Today) * 100`.
