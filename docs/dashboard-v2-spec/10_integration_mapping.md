# 10. Integration & Version Switcher Connection

This document defines how the new V2 Command Center Dashboard integrates with the existing ProdOS codebase, linking into the version switcher hooks and layout components.

---

## 1. App Integration Map

The entry point for rendering the V2 Dashboard is the [TodayExecutionMark2.tsx](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/components/mark2/TodayExecutionMark2.tsx) component, which is conditionally mounted inside [DashboardContent.tsx](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/components/dashboard/DashboardContent.tsx):

```
[app/dashboard/page.tsx] (Server Component)
       │
       └──> [DashboardContent.tsx] (Client Wrapper)
                  │
                  ├──> Version === "Mark 1" ──> [TodayExecution.tsx] (Mark 1 UI)
                  │
                  └──> Version === "Mark 2" ──> [TodayExecutionMark2.tsx] (Mark 2 Entry)
```

---

## 2. V2 Entry Component Skeleton

To set up the V2 command center layout, [TodayExecutionMark2.tsx](file:///c:/Users/I2005/OneDrive/Desktop/Ishankumax/prod%20OS/components/mark2/TodayExecutionMark2.tsx) should be implemented with the following parent grid and provider structures:

```tsx
"use client";

import React from "react";
import { UserAnalytics } from "@/types/analytics";
import { Goal } from "@/types/goals";
import { HabitWithStats } from "@/types/habits";
import { EditModeProvider } from "@/context/edit-mode-context"; // Future edit mode hook
import LeftColumn from "./LeftColumn";
import CenterColumn from "./CenterColumn";
import RightColumn from "./RightColumn";
import ControlCenter from "./ControlCenter";

interface TodayExecutionMark2Props {
  analytics: UserAnalytics;
  goals: Goal[];
  habits: HabitWithStats[];
}

export default function TodayExecutionMark2({ analytics, goals, habits }: TodayExecutionMark2Props) {
  return (
    <EditModeProvider>
      {/* 3-Column Command Grid Viewport */}
      <div className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-140px)] lg:overflow-hidden gap-6 font-sans">
        
        {/* Left Column (25%) - Strategy */}
        <section className="w-full lg:w-1/4 flex flex-col gap-6 lg:overflow-y-auto">
          <LeftColumn goals={goals} />
        </section>

        {/* Center Column (50%) - Execution */}
        <section className="w-full lg:w-1/2 flex flex-col gap-6 lg:overflow-y-auto">
          <CenterColumn analytics={analytics} goals={goals} />
        </section>

        {/* Right Column (25%) - Intelligence */}
        <section className="w-full lg:w-1/4 flex flex-col gap-6 lg:overflow-y-auto">
          <RightColumn analytics={analytics} habits={habits} />
        </section>

        {/* Floating Controls */}
        <ControlCenter />
      </div>
    </EditModeProvider>
  );
}
```

---

## 3. Version Synchronizations

* **Real-time Eviction:** When a user switches versions (from "Mark 1" to "Mark 2"), the standard `VersionProvider` triggers a state change in local storage.
* **Component Unmounting:** This unmounts all Mark 1 components cleanly, freeing up browser memory, and mounts the high-density grid.
* **Cache Integrity:** If the user toggles tasks in either version, the underlying Supabase hooks sync data changes, invalidating any cached layouts in Redis.
