export interface Task {
  id: string; // UUID
  userId: string; // UUID
  domainId: string | null; // UUID or null (Global Task)
  weeklyTargetId: string | null; // UUID or null
  title: string;
  completed: boolean;
  completedAt: string | null; // ISO timestamptz or null
  dueDate: string; // YYYY-MM-DD
  weight: number;
  createdAt: string; // ISO timestamptz
  updatedAt: string; // ISO timestamptz
}
