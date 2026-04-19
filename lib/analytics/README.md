# Derived Data & Analytics Architecture

This layer provides a single source of truth for all computed metrics in the application, moving complex logic from the UI to a centralized server-side logic layer.

## Structure

- `lib/analytics/index.ts`: Pure functions for computing streaks, stats, and progress.
- `lib/queries/analytics.ts`: High-level data aggregator that fetches raw DB data and runs analytical computations.
- `types/analytics.ts`: Data contracts for processed analytics.

## Data Flow

1.  **Request**: UI calls a server-side query (e.g., `getUserAnalytics`).
2.  **Fetch**: Raw data is fetched from the database (Goals, Habits, Logs).
3.  **Compute**: The analytics layer processes raw data into derived metrics (streaks, percentages).
4.  **Response**: UI receives a single, validated `UserAnalytics` object.
5.  **Sync**: When a mutation occurs (e.g., toggling a habit), `useRealtime` triggers a `router.refresh()`, forcing the server to re-compute all derived metrics.

## Optimization

-   **Server-Side Only**: Critical metrics are calculated once on the server, avoiding "flash of incorrect stats" or inconsistent UI logic.
-   **Batching**: Data is fetched in parallel using `Promise.all` to minimize waterfall delays.
-   **Single Source of Truth**: UI components no longer calculate their own counts; they purely reflect the server's analysis.
