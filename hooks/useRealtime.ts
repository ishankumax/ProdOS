
import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

type TableName = "goals" | "habits" | "habit_logs";

export function useRealtime(tables: TableName[], onUpdate: () => void) {
  useEffect(() => {
    const supabase = createClient();
    
    // Use a unique channel name to avoid conflicts if multiple components use this hook
    const channelId = `realtime-${tables.join("-")}-${Math.random().toString(36).slice(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on(

        "postgres_changes",
        { event: "*", schema: "public" },
        (payload) => {
          if (tables.includes(payload.table as TableName)) {
            onUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tables, onUpdate]);
}
