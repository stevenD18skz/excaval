"use client";

import { useEffect } from "react";
import { useExcavalStore } from "@/lib/excaval/store";

/**
 * Rehidrata el store desde sessionStorage después del mount, para que el
 * primer render del cliente coincida con el del servidor (seed) y no haya
 * desajuste de hidratación. Se monta una sola vez en el layout de (app).
 */
export function StoreHydrator() {
  useEffect(() => {
    useExcavalStore.persist.rehydrate();
  }, []);

  return null;
}
