# 08. Responsive Grid Strategy

To maintain high density and readability across varying device form factors, ProdOS V2 uses a responsive layout strategy that transitions from a **fixed viewport desktop terminal** to a **multi-tab mobile panel stack**.

---

## 1. Breakpoint Layout Matrix

| Viewport Width | Device Target | Layout Structure | Scroll Behavior |
| :--- | :--- | :--- | :--- |
| **$\ge$ 1024px (`lg`)** | Desktop / 1080p Monitor | 3-Column Split (25% / 50% / 25%) | **Fixed.** No vertical body scrolling. Columns scroll independently if content overflows. |
| **768px - 1023px (`md`)** | Tablet (Landscape/Portrait) | 2-Column Grid (Left: Execution, Right: Strategy & Telemetry) | **Scrollable.** Standard page-scroll enabled. |
| **< 768px** | Mobile Devices | Single-Column Tabbed Stack | **Independent.** Each tab viewport scrolls independently, header/footer remain sticky. |

---

## 2. Tailwind Implementation Strategy

The grid wraps the layout in flex and grid utility structures configured to trigger on screen changes:

```tsx
export default function DashboardLayoutGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden bg-surface flex flex-col">
      {/* Pinned Header */}
      <Header className="h-12 shrink-0" />
      
      {/* Responsive Columns Container */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:overflow-hidden p-4 gap-4 pb-24 lg:pb-4">
        {/* Left Column (Strategy) */}
        <aside className="w-full md:col-span-1 lg:w-1/4 lg:h-full lg:overflow-y-auto hidden md:block">
          {/* Goal Widgets */}
        </aside>
        
        {/* Center Column (Execution) */}
        <main className="w-full md:col-span-1 lg:w-1/2 lg:h-full lg:overflow-y-auto">
          {/* Task Lists */}
        </main>
        
        {/* Right Column (Intelligence) */}
        <aside className="w-full md:col-span-2 lg:w-1/4 lg:h-full lg:overflow-y-auto hidden lg:block">
          {/* KPI Analytics */}
        </aside>
      </div>
    </div>
  );
}
```

---

## 3. Font and Density Adjustments

To fit the Bloomberg Terminal style above the fold on desktops, spacing and typography adapt dynamically:
* **Desktop (`lg`):** Font sizes set to `text-xs` (12px) and `text-[11px]`, padding `p-3`, lines capped to prevent vertical overflow.
* **Tablet/Mobile:** Font sizes scale back up to `text-sm` (14px), padding increases to `p-4` to support fat-finger touch targets ($\ge 44\text{px}$).
