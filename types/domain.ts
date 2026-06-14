export type DomainStatus = "active" | "paused" | "archived";
export type DomainPriority = "critical" | "high" | "medium" | "low";

export interface Domain {
  id: string; // UUID
  userId: string; // UUID
  name: string;
  description: string | null;
  iconKey: string;
  colorHex: string;
  status: DomainStatus;
  priority: DomainPriority;
  createdAt: string; // ISO timestamptz
  updatedAt: string; // ISO timestamptz
  archivedAt: string | null; // ISO timestamptz or null
}
