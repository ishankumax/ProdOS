# 09. Design System Requirements

ProdOS V2 is built around a **high-density, command-center visual language** inspired by Raycast, Linear, and Bloomberg terminals. Decorative colors are banned; color is used strictly to represent system state.

---

## 1. Color Rules (Functional Palette Only)

All surface and typography values utilize deep neutrals, reserving vibrant colors exclusively for data telemetry statuses.

### Neutral Base
* **Primary Background (Surface):** `#09090B` (Pitch Black)
* **Secondary Card Surface:** `rgba(255, 255, 255, 0.02)` / `#18181B` (Deep Charcoal)
* **Borders / Separators:** `rgba(255, 255, 255, 0.08)` (Tech Gray border)
* **Typography - Primary:** `#F4F4F5` (High Contrast White)
* **Typography - Secondary:** `#A1A1AA` (Medium Contrast Gray)
* **Typography - Muted:** `#52525B` (Low Contrast Slate)

### Functional Telemetry Colors
* **Green (On Track / Healthy):** `#10B981` (Tech Green)
  * Used for: Completed tasks, streak milestones, target acceleration, positive insights.
* **Amber (Needs Attention / Caution):** `#F59E0B` (Warn Amber)
  * Used for: Progress lag, domain inactivity warnings, minor targets missed.
* **Red (Critical Deficit / Blocked):** `#EF4444` (Alert Red)
  * Used for: Overdue tasks, critical pace deficits, workflow failures.

---

## 2. Typography Guidelines

We use a dual-font structure to balance readability with a technical aesthetic:
* **Interface Copy (Sans-serif):** `Inter` or `Outfit` (clean, high legibility for task names and descriptions).
* **Metrics & Aggregates (Monospace):** `JetBrains Mono` or standard system monospace (used for all numbers, scoring percentages, dates, logs, and delta trends).

---

## 3. Glassmorphic Surface Specifications

Every panel or card component utilizes Tailwind opacity scales and backdrop filters to create depth:

```css
.prodos-v2-card {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 4px; /* Sharp, tool-like corners */
}

/* Edit Mode border override */
.prodos-v2-card-edit-mode {
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.02);
}
```

---

## 4. Scanline Layout Overlay

To capture the terminal feeling, a floating viewport overlay is rendered:

```css
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.animate-scanline {
  animation: scanline 8s linear infinite;
}
```
* **HTML Element:** A fixed `<div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">` containing a full-width, `1px` high line colored `rgba(255, 255, 255, 0.03)`.
