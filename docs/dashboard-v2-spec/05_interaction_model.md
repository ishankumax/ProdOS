# 05. Dashboard Interaction Model

To deliver a premium, tool-like experience (similar to Raycast or a Bloomberg Terminal), ProdOS V2 employs keyboard-driven navigation, global visual hover-linking, and fast task completion pathways.

---

## 1. Keyboard Shortcuts (Command Center Shortcuts)

All primary actions can be driven by keyboard hotkeys. A global listener catches these events:

| Key Binding | Target Operation | UI feedback |
| :--- | :--- | :--- |
| `E` | Toggle Workspace Mode | Switches between Execution and Configuration Mode. |
| `C` | Toggle Calendar Sidebar | Slides out the Windows-style Calendar panel. |
| `N` | Quick Add Task | Launches a minimal floating inline prompt in the center. |
| `1` | Select Execution Tab | Switches to Execution Tab (on mobile/tablet layouts). |
| `2` | Select Strategy Tab | Switches to Strategy Tab (on mobile/tablet layouts). |
| `3` | Select Telemetry Tab | Switches to Telemetry Tab (on mobile/tablet layouts). |
| `Ctrl + K` or `Cmd + K` | Command Palette Launcher | Fades in a search-driven launcher overlays. |
| `Esc` | Close Overlay / Reset | Dismisses floating prompts, panels, or configuration modes. |

---

## 2. Interactive Visual Hover-Linking

To help users connect their metrics and focus areas, hovering over an element triggers a **Highlight Cascade** across columns:

```
[Hover: Domain Card (Right Col)]
       │
       ├──> Highlight all tasks belonging to this Domain (Center Col)
       │
       └──> Highlight the Domain's portion of the Goal Contribution stacked bar (Left Col)
```

### Visual Styling of Highlights:
* Non-related elements: Dim opacity to `20%` (fade out).
* Highlighted elements: Scale up by `1.02` with an emerald glow box shadow (`shadow-[0_0_15px_rgba(16,185,129,0.2)]`) and border color transition to brand green.

---

## 3. Inline Metric Logging Interactions

For KPI inputs (Section 8), the user logs progress via direct increment actions or hover panels:
* **One-Click Increments:** Hovering over an Input KPI (e.g., "Outreach") reveals `+` and `-` characters. Clicking them makes a fast POST update, triggering cache invalidation.
* **Inline Notes:** Double-clicking a logged value opens a monospace mini-textarea to attach log notes.
