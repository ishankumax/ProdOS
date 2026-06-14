# 06. API Contracts Design

ProdOS Mark 2 uses Next.js Route Handlers (REST endpoints) and Next.js Server Actions for UI operations. All write payloads are validated using **Zod** schemas. 

---

## 1. Task Operations API

### Create a Task (Server Action / POST `/api/tasks`)
Creates a task under a specific domain, optionally linking it to a goal.

* **Zod Validation Schema:**
```typescript
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  domainId: z.string().uuid().nullable(), // Nullable = Global Task
  goalId: z.string().uuid().nullable(),   // Nullable = No goal contribution
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  weight: z.number().positive().default(1.0)
});
```
* **Response Payload (Success - 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "b3c95973-eb89-49ea-96b6-cd5c74293f0b",
    "title": "Complete code review",
    "domainId": "5fa23d8c-4f76-47e2-8822-26154b5dfd4f",
    "goalId": null,
    "completed": false,
    "completedAt": null,
    "dueDate": "2026-06-15",
    "weight": 1.0,
    "createdAt": "2026-06-14T19:15:00Z"
  }
}
```

### Toggle Task Completion (PATCH `/api/tasks/[id]`)
* **Request Body:**
```json
{
  "completed": true
}
```
* **Response Payload (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "b3c95973-eb89-49ea-96b6-cd5c74293f0b",
    "completed": true,
    "completedAt": "2026-06-14T19:20:00Z"
  }
}
```

---

## 2. Goal Cascades API

### Create a Goal (POST `/api/goals`)
Creates a goal and positions it in the hierarchy.

* **Zod Validation Schema:**
```typescript
export const CreateGoalSchema = z.object({
  title: z.string().min(1).max(255),
  goalLevel: z.enum(['yearly', 'monthly', 'weekly']),
  parentId: z.string().uuid().nullable(), // Must match hierarchy logic (e.g. Monthly points to Yearly)
  targetValue: z.number().positive(),
  unit: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});
```
* **Response Payload (Success - 201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "e4f61f7d-2bda-45c1-92b1-5be098e94a8f",
    "parentId": "d13504fb-16cf-448e-9de9-528eeea313c4",
    "title": "500 Contributions Monthly",
    "goalLevel": "monthly",
    "targetValue": 500.00,
    "unit": "Contributions",
    "startDate": "2026-06-01",
    "endDate": "2026-06-30"
  }
}
```

---

## 3. Dynamic KPI API

### Define a KPI (POST `/api/kpis`)
Defines a custom runtime metric tracker for a domain.

* **Zod Validation Schema:**
```typescript
export const DefineKpiSchema = z.object({
  domainId: z.string().uuid(),
  name: z.string().min(1).max(50), // e.g. "Revenue", "Books"
  metricType: z.enum(['input', 'output', 'outcome']),
  unit: z.string().min(1).max(20),  // e.g. "USD", "count"
  targetValue: z.number().positive().nullable()
});
```
* **Response Payload (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ca1f2373-ab89-49ea-96b6-cd5c74293f0b",
    "domainId": "5fa23d8c-4f76-47e2-8822-26154b5dfd4f",
    "name": "Revenue",
    "metricType": "outcome",
    "unit": "USD",
    "targetValue": 10000.00
  }
}
```

### Log a KPI Value (POST `/api/kpis/logs`)
Logs a daily metric value. Uses upsert constraints to overwrite values recorded for the same date.

* **Zod Validation Schema:**
```typescript
export const LogKpiSchema = z.object({
  kpiDefinitionId: z.string().uuid(),
  value: z.number(),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).nullable()
});
```
* **Response Payload (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "18ac2cfb-22fa-48ef-be99-231ba6e9ac98",
    "kpiDefinitionId": "ca1f2373-ab89-49ea-96b6-cd5c74293f0b",
    "value": 250.00,
    "logDate": "2026-06-14",
    "notes": "Stripe payout processed"
  }
}
```

---

## 4. Standard Error Structure
For any validation, authorization, or internal error, the API will return a structured JSON response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR", // e.g., "UNAUTHORIZED", "NOT_FOUND", "INTERNAL_SERVER_ERROR"
    "message": "The provided date format is invalid.",
    "details": [
      {
        "field": "dueDate",
        "issue": "Format must be YYYY-MM-DD"
      }
    ]
  }
}
```
