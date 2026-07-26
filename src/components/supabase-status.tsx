"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function SupabaseStatus() {
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("[Supabase] Error de conexión:", error.message);
        return;
      }
      console.log("[Supabase] Conectado correctamente ✅", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        session: data.session,
      });
    });
  }, []);

  return null;
}
