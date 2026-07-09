/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              PRODUCTIVITY OS — GLOBAL THEME                  ║
 * ║  Single source of truth for all design tokens.               ║
 * ║  Import from here instead of hardcoding values in components.║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─── Brand Accent (maps to CSS --brand-* vars) ────────────────────────────────
// The base accent is teal-green. All accent usages should pull from here.
export const BRAND = {
  /** Tailwind class fragments — use as: `bg-brand-500`, `text-brand-400`, etc. */
  tw: {
    bg:          "bg-brand-500",
    bgMuted:     "bg-brand-500/15",
    bgHover:     "hover:bg-brand-500/20",
    text:        "text-brand-400",
    textStrong:  "text-brand-300",
    border:      "border-brand-500/30",
    borderHover: "hover:border-brand-500/50",
    ring:        "ring-brand-500/40",
    shadow:      "shadow-[0_0_20px_rgba(var(--brand-500-rgb),0.25)]",
    glow:        "shadow-[0_0_32px_rgba(var(--brand-500-rgb),0.35)]",
  },
  /** Raw CSS var references for inline styles */
  css: {
    color:       "hsl(var(--brand-500))",
    colorLight:  "hsl(var(--brand-400))",
    colorDim:    "hsl(var(--brand-500) / 0.4)",
    bg:          "hsl(var(--brand-500) / 0.15)",
    border:      "hsl(var(--brand-500) / 0.3)",
  },
} as const;

// ─── Surface / Background ──────────────────────────────────────────────────────
export const SURFACE = {
  /** App background */
  base:    "#0d0d14",
  /** Slightly elevated cards/panels */
  raised:  "#12121c",
  /** Overlays, dropdowns */
  overlay: "#16162a",
  /** Glass panel (used in Shell, CalendarOverlay, etc.) */
  glass:   "rgba(13,13,26,0.96)",

  tw: {
    base:    "bg-[#0d0d14]",
    raised:  "bg-[#12121c]",
    overlay: "bg-[#16162a]/96",
    glass:   "bg-[#0d0d1a]/96",
  },
} as const;

// ─── Border ────────────────────────────────────────────────────────────────────
export const BORDER = {
  subtle:  "border-white/[0.06]",
  default: "border-white/[0.09]",
  strong:  "border-white/[0.15]",
  active:  "border-brand-500/30",

  /** CSS values for inline SVG / non-Tailwind use */
  css: {
    subtle:  "rgba(255,255,255,0.06)",
    default: "rgba(255,255,255,0.09)",
    strong:  "rgba(255,255,255,0.15)",
  },
} as const;

// ─── Border Radius ─────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   "rounded-lg",      // 8px  — small buttons, chips
  md:   "rounded-xl",      // 12px — cards, inputs
  lg:   "rounded-2xl",     // 16px — panels, modals
  full: "rounded-full",    // pills, avatars
} as const;

// ─── Typography ────────────────────────────────────────────────────────────────
export const TEXT = {
  /** Labels, section headings */
  label:   "text-[9px] font-bold uppercase tracking-widest text-white/35",
  caption: "text-[10px] text-white/40",
  body:    "text-[12px] text-white/70",
  title:   "text-sm font-semibold text-white/85",
  heading: "text-base font-bold text-white",

  /** Muted levels */
  dim:    "text-white/20",
  muted:  "text-white/40",
  subtle: "text-white/60",
  base:   "text-white/80",
  strong: "text-white",
} as const;

// ─── Shadow / Glow ─────────────────────────────────────────────────────────────
export const SHADOW = {
  /** Panel drop shadow */
  panel:  "shadow-[0_8px_64px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.05)]",
  /** Card elevation */
  card:   "shadow-[0_4px_24px_rgba(0,0,0,0.5)]",
  /** Floating button */
  button: "shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
  /** Brand glow — active state */
  brand:  "shadow-[0_0_24px_rgba(var(--brand-500-rgb),0.35)]",

  /** Inline CSS values */
  css: {
    panel: "0 8px 64px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)",
    card:  "0 4px 24px rgba(0,0,0,0.5)",
  },
} as const;

// ─── Spacing / Layout constants ────────────────────────────────────────────────
export const LAYOUT = {
  /** Global page margin (matches Tailwind right-6 / bottom-6 = 24px) */
  margin: 24,
  /** Top header height */
  headerH: 64,
  /** Bottom-right floating button strip width (w-11 = 44px) */
  btnStripW: 44,
  /** Gap between calendar panel and buttons */
  btnGap: 12,
  /** Content area horizontal padding (p-8 = 32px) */
  contentPadding: 32,
} as const;

// ─── Transition / Animation ────────────────────────────────────────────────────
export const TRANSITION = {
  /** Default UI transition */
  default: "transition-all duration-200",
  /** Smooth panel slide */
  panel:   "transition-all duration-300",
  /** Fast micro-interaction */
  fast:    "transition-all duration-150",

  /** Framer Motion easings */
  ease: {
    smooth:  [0.4, 0, 0.2, 1]  as [number,number,number,number],
    snappy:  [0.32, 0.72, 0, 1] as [number,number,number,number],
    bounce:  [0.34, 1.56, 0.64, 1] as [number,number,number,number],
  },

  /** Framer Motion durations (seconds) */
  dur: {
    fast:   0.15,
    normal: 0.25,
    slow:   0.35,
  },
} as const;

// ─── Backdrop Blur ─────────────────────────────────────────────────────────────
export const BLUR = {
  sm:  "backdrop-blur-sm",
  md:  "backdrop-blur-md",
  lg:  "backdrop-blur-xl",
  xl:  "backdrop-blur-2xl",
} as const;

// ─── Workspace Icons ───────────────────────────────────────────────────────────
export const WORKSPACE_ICONS: Record<string, string> = {
  "Personal Life":       "fi fi-sr-home",
  "Skill Check":         "fi fi-sr-laptop",
  "Financial Dashboard": "fi fi-sr-chart-histogram",
  "InTheBox":            "fi fi-sr-box",
} as const;

// ─── UI Icons (FlatIcon Uicons) ────────────────────────────────────────────────
export const ICONS = {
  // Navigation & Actions
  add:       "fi fi-sr-plus",
  check:     "fi fi-sr-check",
  close:     "fi fi-sr-cross",
  edit:      "fi fi-sr-pencil",
  delete:    "fi fi-sr-trash",
  settings:  "fi fi-sr-settings",
  search:    "fi fi-sr-search",
  filter:    "fi fi-sr-filter",
  sort:      "fi fi-sr-sort",
  more:      "fi fi-sr-menu-dots",

  // Chevrons / Arrows
  chevronDown:  "fi fi-sr-angle-down",
  chevronUp:    "fi fi-sr-angle-up",
  chevronLeft:  "fi fi-sr-angle-left",
  chevronRight: "fi fi-sr-angle-right",
  arrowLeft:    "fi fi-sr-arrow-left",
  arrowRight:   "fi fi-sr-arrow-right",

  // Time & Calendar
  calendar:  "fi fi-sr-calendar",
  clock:     "fi fi-sr-clock",
  timer:     "fi fi-sr-stopwatch",

  // Productivity
  task:      "fi fi-sr-check-circle",
  taskList:  "fi fi-sr-list-check",
  goal:      "fi fi-sr-target",
  habit:     "fi fi-sr-repeat",
  focus:     "fi fi-sr-bullseye",
  note:      "fi fi-sr-document",
  bookmark:  "fi fi-sr-bookmark",

  // Finance
  chart:     "fi fi-sr-chart-histogram",
  trending:  "fi fi-sr-trending-up",
  wallet:    "fi fi-sr-wallet",
  calculator:"fi fi-sr-calculator",
  coins:     "fi fi-sr-coins",

  // Health
  health:    "fi fi-sr-heart",
  activity:  "fi fi-sr-person-running",
  sleep:     "fi fi-sr-bed",
  water:     "fi fi-sr-water",

  // Social / People
  users:     "fi fi-sr-users",
  user:      "fi fi-sr-user",

  // Misc
  star:      "fi fi-sr-star",
  globe:     "fi fi-sr-globe",
  home:      "fi fi-sr-home",
  laptop:    "fi fi-sr-laptop",
  box:       "fi fi-sr-box",
} as const;

// ─── Emojis ────────────────────────────────────────────────────────────────────
export const EMOJI = {
  // Productivity
  fire:       "🔥",
  rocket:     "🚀",
  checkmark:  "✅",
  target:     "🎯",
  lightning:  "⚡",
  trophy:     "🏆",
  medal:      "🥇",
  crown:      "👑",
  gem:        "💎",
  star:       "⭐",
  sparkle:    "✨",

  // Mood / Status
  great:      "🟢",
  ok:         "🟡",
  bad:        "🔴",
  warning:    "⚠️",
  info:       "ℹ️",
  lock:       "🔒",
  key:        "🔑",

  // Time
  clock:      "🕐",
  calendar:   "📅",
  hourglass:  "⏳",
  alarm:      "⏰",

  // Finance
  money:      "💰",
  chart:      "📈",
  chartDown:  "📉",
  bank:       "🏦",
  coin:       "🪙",

  // Health
  heart:      "❤️",
  muscle:     "💪",
  sleep:      "😴",
  run:        "🏃",
  water:      "💧",
  food:       "🥗",
  brain:      "🧠",

  // Skills / Learning
  book:       "📚",
  code:       "💻",
  idea:       "💡",
  tools:      "🛠️",
  graduation: "🎓",
  pen:        "✍️",

  // Nature / Vibe
  sun:        "☀️",
  moon:       "🌙",
  leaf:       "🌿",
  wave:       "🌊",

  // Misc
  inbox:      "📥",
  link:       "🔗",
  pin:        "📌",
  trash:      "🗑️",
  plus:       "➕",
  minus:      "➖",
} as const;

// ─── Event / Tag Colors ────────────────────────────────────────────────────────
export const EVENT_COLORS = {
  task:    "#3bf651",
  meeting: "#5cf6e9",
  event:   "#daf50b",
  goal:    "hsl(var(--brand-500))",
  health:  "#ef4444",
  finance: "#f59e0b",
  habit:   "#8b5cf6",
} as const;

// ─── Health metric colors ─────────────────────────────────────────────────────
export const HEALTH_COLORS = {
  steps:   "#3b82f6",   // blue
  sleep:   "#8b5cf6",   // purple
  screen:  "#ef4444",   // red
  water:   "#06b6d4",   // cyan
  calories:"#f59e0b",   // amber
} as const;

// ─── Status variants ───────────────────────────────────────────────────────────
export const STATUS = {
  success: { bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/30"  },
  warning: { bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/30"  },
  error:   { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30"    },
  info:    { bg: "bg-brand-500/15",  text: "text-brand-400",  border: "border-brand-500/30"  },
  neutral: { bg: "bg-white/[0.05]",  text: "text-white/60",   border: "border-white/[0.10]"  },
} as const;

// ─── Reusable class bundles ────────────────────────────────────────────────────
/**
 * Use these as className building blocks to keep components consistent.
 * e.g.  className={`${CLASSES.panel} ${CLASSES.panelBorder}`}
 */
export const CLASSES = {
  // Glassmorphic floating panel
  panel:        "backdrop-blur-2xl bg-[#0d0d1a]/96 border border-white/[0.09] rounded-2xl shadow-[0_8px_64px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.05)]",

  // Standard widget / card
  card:         "bg-white/[0.04] border border-white/[0.08] rounded-xl",
  cardHover:    "bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200",

  // Floating pill buttons (like Shell bottom-right buttons)
  floatBtn:     "w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border backdrop-blur-md bg-white/[0.08] border-white/[0.15] text-white/60 hover:text-white hover:bg-white/[0.15] hover:border-white/30",
  floatBtnActive:"w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border backdrop-blur-md",

  // Inline icon button
  iconBtn:      "w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all duration-150",

  // Section label
  sectionLabel: "text-[9px] font-bold uppercase tracking-widest text-white/35",

  // Divider
  divider:      "border-t border-white/[0.06]",

  // Input field
  input:        "w-full bg-brand-500/10 border border-brand-500/30 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-500/60 text-white placeholder:text-white/25 transition-all",

  // Scrollable area
  scroll:       "overflow-y-auto",
  scrollStyle:  { scrollbarWidth: "thin" as const, scrollbarColor: "rgba(var(--brand-500-rgb),0.2) transparent" },
} as const;
