# 07. Business Logic & Progress Rollup Pseudocode

This document details the algorithms and logic flow for executing task completions, progress rollups, and cache evictions.

---

## 1. Task Completion & Cache Invalidation

When a user toggles a task's completion status, the system must update Supabase and clear the cached analytics in Redis.

```typescript
/**
 * Toggles task status and invalidates analytics cache
 */
async function toggleTaskStatus(taskId: string, isCompleted: boolean, userId: string) {
  // 1. Start database transaction
  const dbResult = await supabase
    .from('tasks')
    .update({ 
      completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null 
    })
    .eq('id', taskId)
    .eq('user_id', userId) // Ensure tenant safety
    .select('goal_id');

  if (dbResult.error) throw new Error("Failed to update task");

  // 2. Identify if this task is linked to a goal
  const goalId = dbResult.data[0]?.goal_id;

  // 3. Evict user analytics from Redis
  const redisCacheKey = `user:${userId}:analytics`;
  await redis.del(redisCacheKey);

  // 4. Trigger Realtime update event
  window.dispatchEvent(new CustomEvent('version-change', { detail: 'Mark 1' })); // Sync layout state

  return { success: true };
}
```

---

## 2. Dynamic Progress Rollup Calculation

Since we avoid duplicating state in the database, we fetch and aggregate goals dynamically. If the front-end requests a goal's progress, the API queries database views. The hierarchy is evaluated as follows:

```typescript
/**
 * Logic to calculate progress recursively for a specific goal
 */
async function getGoalProgressRecursive(goalId: string): Promise<number> {
  const goal = await fetchGoalFromDB(goalId);

  // Case A: Weekly Goal (Leaf nodes linked directly to tasks)
  if (goal.goalLevel === 'weekly') {
    const tasks = await fetchTasksForGoal(goalId);
    if (tasks.length === 0) return 0.00;

    const completedWeight = tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + Number(t.weight), 0);

    const totalWeight = tasks.reduce((sum, t) => sum + Number(t.weight), 0);
    return Math.round((completedWeight / totalWeight) * 100);
  }

  // Case B: Monthly Goal (Aggregates Weekly Target progress)
  if (goal.goalLevel === 'monthly') {
    const childWeeklyGoals = await fetchChildGoals(goalId);
    if (childWeeklyGoals.length === 0) return 0.00;

    const totalProgress = await Promise.all(
      childWeeklyGoals.map(cg => getGoalProgressRecursive(cg.id))
    );

    const sum = totalProgress.reduce((s, p) => s + p, 0);
    return Math.round(sum / childWeeklyGoals.length);
  }

  // Case C: Yearly Goal (Aggregates Monthly Target progress)
  if (goal.goalLevel === 'yearly') {
    const childMonthlyGoals = await fetchChildGoals(goalId);
    if (childMonthlyGoals.length === 0) return 0.00;

    const totalProgress = await Promise.all(
      childMonthlyGoals.map(cg => getGoalProgressRecursive(cg.id))
    );

    const sum = totalProgress.reduce((s, p) => s + p, 0);
    return Math.round(sum / childMonthlyGoals.length);
  }

  return 0.00;
}
```

---

## 3. Dynamic KPI Logging & Boundary Checks

Users can log daily values for KPIs. To guarantee logical consistency, the system enforces constraints:

```typescript
/**
 * Records a new value for a KPI
 */
async function logKpiMetric(userId: string, kpiId: string, value: number, logDate: string) {
  // 1. Prevent logging future dates
  const today = new Date().toISOString().split('T')[0];
  if (logDate > today) {
    return { success: false, error: "Cannot log values for future dates." };
  }

  // 2. Validate KPI definition exists and belongs to user
  const definition = await supabase
    .from('kpi_definitions')
    .select('id')
    .eq('id', kpiId)
    .eq('user_id', userId)
    .single();

  if (!definition.data) {
    return { success: false, error: "Metric definition not found." };
  }

  // 3. Upsert data to enforce 'kpi_definition_id + log_date' uniqueness
  const upsertResult = await supabase
    .from('kpi_logs')
    .upsert({
      kpi_definition_id: kpiId,
      value: value,
      log_date: logDate
    }, {
      onConflict: 'kpi_definition_id,log_date'
    });

  if (upsertResult.error) {
    return { success: false, error: "Failed to save metric value." };
  }

  // 4. Invalidate Redis analytics cache
  await redis.del(`user:${userId}:analytics`);

  return { success: true };
}
```
