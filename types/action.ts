export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: "VALIDATION_ERROR" | "DATABASE_ERROR" | "UNAUTHORIZED" | "NOT_FOUND";
    message: string;
    details?: { field: string; issue: string }[];
  };
}
