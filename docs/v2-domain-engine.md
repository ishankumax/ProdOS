# ProdOS V2 — Phase 2 Domain Engine Specification

This document details the architecture, schemas, and API validation layers for the **ProdOS V2 Domain Engine**. 

Domains in ProdOS V2 are not static tags or categories; they are **operational environments** (mini operating systems) where the user invests effort, time, and attention. All downstream entities (goals, tasks, KPIs, and analytics) attach directly to domains.

---

## 1. Domain Architecture Diagram

This diagram displays the relational and dependency boundaries of the Domain Engine. Domains function as the root node for all secondary features.

```mermaid
graph TD
    %% Global Root
    User[USER (auth.users)] --> Domains[DOMAINS]

    %% Bounded Attachments
    Domains --> Goals[GOALS (Phase 3)]
    Domains --> Tasks[TASKS (Phase 4)]
    Domains --> KPIs[KPI SYSTEM (Phase 5)]
    Domains --> Analytics[ANALYTICS (Phase 6)]

    %% Active Workspace Context
    Context[Active Domain Context] -. filter queries .-> Goals
    Context -. filter queries .-> Tasks
    Context -. filter queries .-> KPIs
    Context -. filter queries .-> Analytics

    classDef default fill:#121214,stroke:#3F3F46,stroke-width:1px,color:#F4F4F5;
    classDef context fill:#064E3B,stroke:#10B981,stroke-width:1px,color:#10B981;
    class Context context;
```

---

## 2. Domain Database Schema (Supabase DDL)

We define the PostgreSQL structure for domains, supporting soft deletion (`archived_at`), status states, and priority weights.

```sql
-- ── Custom Enums ──────────────────────────────────────────────
CREATE TYPE domain_status AS ENUM ('active', 'paused', 'archived');
CREATE TYPE domain_priority AS ENUM ('critical', 'high', 'medium', 'low');

-- ── Domains Table ─────────────────────────────────────────────
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_key VARCHAR(100) NOT NULL DEFAULT 'circle', -- reference key to icon library
    color_hex VARCHAR(7) NOT NULL DEFAULT '#10B981',  -- semantic tech green
    status domain_status NOT NULL DEFAULT 'active',
    priority domain_priority NOT NULL DEFAULT 'medium',
    
    -- Audit Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ, -- soft delete flag (null if active/paused)

    -- Constraints
    CONSTRAINT check_archived_date CHECK (
        (status = 'archived' AND archived_at IS NOT NULL) OR
        (status != 'archived' AND archived_at IS NULL)
    ),
    -- Unique domain names per user
    UNIQUE (user_id, name)
);

-- ── Auto-Update Timestamp Trigger ─────────────────────────────
CREATE TRIGGER set_timestamp_domains
    BEFORE UPDATE ON domains
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- ── Indexes Strategy ──────────────────────────────────────────
-- Optimize user filtering, ignoring archived domains by default (Partial Index)
CREATE INDEX idx_domains_user_active 
    ON domains (user_id, priority DESC) 
    WHERE status != 'archived';

-- Optimize name lookups to check uniqueness quickly
CREATE INDEX idx_domains_user_name 
    ON domains (user_id, name);

-- ── Row Level Security (RLS) Policies ─────────────────────────
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "domains_owner_access" ON domains 
    FOR ALL USING (auth.uid() = user_id);
```

---

## 3. Domain Entity Definition & Rationales

The Domain Entity consists of the following parameters, selected for operational efficiency:
1. **`status` (Enum: active, paused, archived):**
   * *Active:* The domain is in the active execution loop.
   * *Paused:* The domain remains visible but does not contribute to active notifications.
   * *Archived:* The domain is soft-deleted.
2. **`priority` (Enum: critical, high, medium, low):**
   * Maps straight to sorting algorithms on the dashboard. Critical domains (like "ReadNovaStory") rise to the top of execution lists.
3. **`icon_key` (Reference Key):**
   * **Do NOT store raw SVG blobs.** Storing raw blobs inflates database query payloads and makes styling changes impossible. Instead, we store a string key (e.g., `'rns-logo'`, `'dumbbell'`) mapped to a frontend component resolver (Lucide or custom vector mapping).
4. **`color_hex` (Semantic Hex):**
   * Allows the stacked goal charts to render color coordinates dynamically.

---

## 4. Validation Architecture (Zod Schemas)

Inputs are strictly validated on entry. String inputs are trimmed to prevent leading/trailing whitespace insertion.

```typescript
import { z } from "zod";

// Create Domain Validation
export const CreateDomainSchema = z.object({
  name: z
    .string()
    .min(1, "Domain name is required")
    .max(100, "Domain name must be under 100 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be under 1000 characters")
    .trim()
    .optional(),
  iconKey: z.string().min(1).max(100).default("circle"),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid Hex format (e.g. #10B981)"),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  status: z.enum(["active", "paused"]).default("active") // Cannot create directly as archived
});

// Update Domain Validation
export const UpdateDomainSchema = CreateDomainSchema.partial().extend({
  id: z.string().uuid("Invalid Domain ID")
});

// Archive / Toggle Validation
export const ArchiveDomainSchema = z.object({
  id: z.string().uuid("Invalid Domain ID"),
  archive: z.boolean() // true = archive, false = restore
});

// Context Selector Validation
export const SetActiveDomainSchema = z.object({
  domainId: z.string().uuid("Invalid Domain ID").nullable() // Nullable represents 'Global View' (All Domains)
});
```

---

## 5. Server Actions Contracts

Mutations are executed as Server Actions returning unified API envelopes:

```typescript
// features/domains/actions/createDomain.ts
"use server";
import { CreateDomainSchema } from "../validation";
import { ActionResponse } from "@/types";

export async function createDomain(rawInput: unknown): Promise<ActionResponse<Domain>> {
  // 1. Authorize session
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };

  // 2. Validate input
  const validation = CreateDomainSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Input validation failed",
        details: validation.error.issues.map(i => ({ field: i.path.join('.'), issue: i.message }))
      }
    };
  }

  // 3. Database Insert
  const { data, error } = await supabase
    .from("domains")
    .insert({ ...validation.data, user_id: user.id })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") { // Unique violation
      return { success: false, error: { code: "DATABASE_ERROR", message: "A domain with this name already exists." } };
    }
    return { success: false, error: { code: "DATABASE_ERROR", message: error.message } };
  }

  // 4. Invalidate cache
  await evictDomainsCache(user.id);

  return { success: true, data };
}
```

---

## 6. Active Domain Context Design

The dashboard supports focusing on a **single domain** or viewing a **global summary** ("All Domains").

* **State Persistence:** The active domain selection is persisted via **cookies** instead of local storage. This allows Server Components to read the selection on the initial load and pre-filter SQL queries, preventing visual flicker.
* **Fallback:** A null value represents the "Global View".

---

## 7. Redis Cache Strategy

### Cache Scopes
* **DO CACHE:** `user:{userId}:domains` - List of all active/paused domains for the sidebar menu. Highly read, rarely written.
* **DO NOT CACHE:** Active domain context. Cookies handle this dynamically with zero query overhead.
* **Invalidation:** Any mutation action (`createDomain`, `updateDomain`, `archiveDomain`) triggers a `DEL user:{userId}:domains` eviction.

---

## 8. TypeScript Types

Strict TS models mapped to schemas and database structures:

```typescript
export type DomainStatus = "active" | "paused" | "archived";
export type DomainPriority = "critical" | "high" | "medium" | "low";

export interface Domain {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  iconKey: string;
  colorHex: string;
  status: DomainStatus;
  priority: DomainPriority;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface DomainContext {
  activeDomainId: string | null; // Null represents 'Global View' (All Domains)
}
```

---

## 9. Extensible Health Score Model

Domains are designed to support future health calculations dynamically. The health equation should evaluate three telemetry factors:

$$\text{Health}_{\text{Domain}} = \left( W_{\text{Task}} \times \text{Task Completion Rate} \right) + \left( W_{\text{Goal}} \times \text{Goal Progress Rate} \right) + \left( W_{\text{KPI}} \times \text{KPI Performance} \right)$$

* **Extensibility:** The factors will be calculated using database joins in queries, avoiding any stored column state in the `domains` table.

---

## 10. Testing Strategy

* **Unit Tests:** Validate Zod schema string trims, color hex regex constraints, and edge values.
* **Integration Tests:** Execute Server Actions and verify Redis cache eviction keys are deleted.
* **Database Tests:** Validate `CHECK` constraints on soft deletes (`archived_at` not null only when `status = 'archived'`).

---

## Risks & Tradeoffs

* **Soft Deletion Cascade Tradeoff:** When a domain is archived, its tasks and goals are kept intact to preserve historical analytics. If the user later completes a task linked to an archived domain, this will still update weekly stats. This is the desired behavior for historical integrity, but developers must ensure tasks belonging to archived domains are filtered out of active execution lists.

---

### **Final Review Answer:**
### **Is the Domain Engine production-ready and prepared for Phase 3 Goal Engine integration?**
### **YES.**
The database layout, validation schemas, context persistent hooks, and API actions conform to all criteria. The foundation is locked. Do not proceed to any Goals or Tasks UI implementation yet.
