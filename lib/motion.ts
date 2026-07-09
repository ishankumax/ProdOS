/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           PRODUCTIVITY OS — MOTION / ANIMATION SYSTEM            ║
 * ║                                                                  ║
 * ║  Philosophy: macOS Genie Effect                                  ║
 * ║  ─────────────────────────────────────────────────────────────   ║
 * ║  UI elements should MORPH, STRETCH, COMPRESS and FLOW between   ║
 * ║  states. Never just fade or pop. Every transition is:           ║
 * ║    • destination-aware  (grows FROM its source point)           ║
 * ║    • elastic            (spring physics, never linear)          ║
 * ║    • physically responsive (squish on enter, spring on release) ║
 * ║    • staggered          (each property has its own timing)      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { Transition, Variants, TargetAndTransition } from "framer-motion";

// ─── Spring Presets ───────────────────────────────────────────────────────────
// Use these instead of duration-based easing EVERYWHERE.

/** Fast, snappy — buttons, small badges, chips */
export const SPRING_SNAPPY: Transition = {
  type: "spring", stiffness: 480, damping: 32, mass: 0.5,
};

/** Default fluid — panels, cards, drawers */
export const SPRING_FLUID: Transition = {
  type: "spring", stiffness: 340, damping: 28, mass: 0.7,
};

/** Slow, heavy — large panels, full-height overlays */
export const SPRING_LAZY: Transition = {
  type: "spring", stiffness: 220, damping: 24, mass: 1.0,
};

/** Extra bouncy — active states, selection highlights */
export const SPRING_BOUNCE: Transition = {
  type: "spring", stiffness: 500, damping: 22, mass: 0.5,
};

/** Near-instant — opacity only (never animate opacity with spring) */
export const FADE_FAST: Transition = { duration: 0.08, ease: "easeOut" };
export const FADE_NORMAL: Transition = { duration: 0.18, ease: "easeOut" };

// ─── Genie Panel (full-height overlays like CalendarOverlay) ──────────────────
// Grows FROM the bottom-right corner (the trigger button), squishing horizontally
// first, then expanding upward like liquid pouring out of a bottle.

export const GENIE_PANEL_VARIANTS: Variants = {
  hidden: {
    opacity:  0,
    scaleY:   0.05,
    scaleX:   0.55,
    y:        40,
    clipPath: "inset(94% 0% 0% 15% round 24px)",
  },
  visible: {
    opacity:  1,
    scaleY:   1,
    scaleX:   1,
    y:        0,
    clipPath: "inset(0% 0% 0% 0% round 16px)",
  },
  exit: {
    opacity:  0,
    scaleY:   0.05,
    scaleX:   0.55,
    y:        40,
    clipPath: "inset(94% 0% 0% 15% round 24px)",
  },
};

export const GENIE_PANEL_TRANSITION = {
  scaleY:   { type: "spring", stiffness: 380, damping: 28, mass: 0.7 },
  scaleX:   { type: "spring", stiffness: 440, damping: 33, mass: 0.55 },
  y:        { type: "spring", stiffness: 380, damping: 28, mass: 0.7 },
  clipPath: { type: "spring", stiffness: 300, damping: 28, mass: 0.85 },
  opacity:  FADE_FAST,
};

// ─── Genie Card (floating widgets, modals, dropdowns) ─────────────────────────
// Pops from its trigger — scales from 0 at the origin corner, springs to full.

export const GENIE_CARD_VARIANTS: Variants = {
  hidden: {
    opacity:  0,
    scale:    0.82,
    y:        12,
    clipPath: "inset(8% 8% 8% 8% round 20px)",
  },
  visible: {
    opacity:  1,
    scale:    1,
    y:        0,
    clipPath: "inset(0% 0% 0% 0% round 12px)",
  },
  exit: {
    opacity:  0,
    scale:    0.82,
    y:        12,
    clipPath: "inset(8% 8% 8% 8% round 20px)",
  },
};

export const GENIE_CARD_TRANSITION = {
  scale:    SPRING_FLUID,
  y:        SPRING_FLUID,
  clipPath: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 },
  opacity:  FADE_FAST,
};

// ─── Genie Drawer (side panels like CompletedDrawer, GoalsRail) ───────────────
// Slides in from the edge with a clipPath wipe, slight compression on enter.

export const GENIE_DRAWER_LEFT: Variants = {
  hidden:  { opacity: 0, x: -20, scaleX: 0.92, clipPath: "inset(0% 100% 0% 0% round 0px)" },
  visible: { opacity: 1, x: 0,   scaleX: 1,    clipPath: "inset(0% 0% 0% 0% round 0px)"   },
  exit:    { opacity: 0, x: -20, scaleX: 0.92, clipPath: "inset(0% 100% 0% 0% round 0px)" },
};

export const GENIE_DRAWER_TRANSITION = {
  x:        SPRING_FLUID,
  scaleX:   { type: "spring", stiffness: 400, damping: 35, mass: 0.6 },
  clipPath: { type: "spring", stiffness: 280, damping: 26, mass: 0.9 },
  opacity:  FADE_FAST,
};

// ─── Genie List Item (tasks, investments, goals entering/leaving a list) ───────
// Items spring in from above with a slight squish; exit by compressing downward.

export const GENIE_LIST_ITEM: Variants = {
  hidden:  { opacity: 0, y: -12, scaleY: 0.7, scaleX: 0.96 },
  visible: { opacity: 1, y: 0,   scaleY: 1,   scaleX: 1    },
  exit:    { opacity: 0, y:  8,  scaleY: 0.7, scaleX: 0.96, height: 0, marginBottom: 0 },
};

export const GENIE_LIST_TRANSITION = {
  y:      SPRING_FLUID,
  scaleY: { type: "spring", stiffness: 420, damping: 30, mass: 0.55 },
  scaleX: SPRING_SNAPPY,
  height: { type: "spring", stiffness: 360, damping: 30 },
  opacity: FADE_FAST,
};

/** Stagger children by this delay (seconds) */
export const LIST_STAGGER = 0.04;

// ─── Genie Collapse (inline expand/collapse sections like CalendarWidget) ──────
// Height animates via spring; content clips from top as it collapses.

export const GENIE_COLLAPSE: Variants = {
  hidden:  { opacity: 0, height: 0, scaleY: 0.95, clipPath: "inset(0% 0% 100% 0% round 12px)" },
  visible: { opacity: 1, height: "auto", scaleY: 1, clipPath: "inset(0% 0% 0% 0% round 12px)" },
  exit:    { opacity: 0, height: 0, scaleY: 0.95, clipPath: "inset(0% 0% 100% 0% round 12px)" },
};

export const GENIE_COLLAPSE_TRANSITION = {
  height:   { type: "spring", stiffness: 360, damping: 30, mass: 0.7 },
  scaleY:   SPRING_FLUID,
  clipPath: { type: "spring", stiffness: 320, damping: 28, mass: 0.8 },
  opacity:  FADE_NORMAL,
};

// ─── Genie Toast / Notification ───────────────────────────────────────────────
// Drops from top with a squish, bounces into place, then reverses on exit.

export const GENIE_TOAST: Variants = {
  hidden:  { opacity: 0, y: -32, scaleX: 0.85, scaleY: 0.7  },
  visible: { opacity: 1, y: 0,   scaleX: 1,    scaleY: 1    },
  exit:    { opacity: 0, y: -16, scaleX: 0.9,  scaleY: 0.85 },
};

export const GENIE_TOAST_TRANSITION = {
  y:      SPRING_BOUNCE,
  scaleX: { type: "spring", stiffness: 460, damping: 28, mass: 0.5 },
  scaleY: { type: "spring", stiffness: 460, damping: 28, mass: 0.5 },
  opacity: FADE_FAST,
};

// ─── Genie Button / Active State ──────────────────────────────────────────────
// For scale-on-press and active indicator morphing.

export const pressAnimation: TargetAndTransition = {
  scale: 0.93,
  transition: SPRING_SNAPPY,
};

export const activeScaleAnimation: TargetAndTransition = {
  scale: 1.08,
  transition: SPRING_BOUNCE,
};

// ─── Workspace Transition (switching between workspaces) ──────────────────────
// Content exits by compressing toward center; new content springs in from edge.

export const WORKSPACE_ENTER: Variants = {
  hidden:  { opacity: 0, x: 32,  scaleX: 0.96, clipPath: "inset(0% 0% 0% 4% round 0px)" },
  visible: { opacity: 1, x: 0,   scaleX: 1,    clipPath: "inset(0% 0% 0% 0% round 0px)" },
};

export const WORKSPACE_EXIT: Variants = {
  visible: { opacity: 1, x: 0,   scaleX: 1    },
  hidden:  { opacity: 0, x: -24, scaleX: 0.96 },
};

export const WORKSPACE_TRANSITION = {
  x:        SPRING_FLUID,
  scaleX:   { type: "spring", stiffness: 380, damping: 32, mass: 0.65 },
  clipPath: { type: "spring", stiffness: 320, damping: 28, mass: 0.8  },
  opacity:  FADE_FAST,
};

// ─── View Switch (calendar month/year/decade view changes) ────────────────────
// Slides and fades between calendar views.

export const VIEW_SWITCH_ENTER = (direction: 1 | -1): Variants => ({
  hidden:  { opacity: 0, x: direction * 20, scaleX: 0.94 },
  visible: { opacity: 1, x: 0,              scaleX: 1    },
});

export const VIEW_SWITCH_EXIT = (direction: 1 | -1): Variants => ({
  visible: { opacity: 1, x: 0,               scaleX: 1    },
  hidden:  { opacity: 0, x: direction * -20, scaleX: 0.94 },
});

export const VIEW_SWITCH_TRANSITION = {
  x:       SPRING_SNAPPY,
  scaleX:  { type: "spring", stiffness: 460, damping: 34, mass: 0.5 },
  opacity: FADE_FAST,
};
