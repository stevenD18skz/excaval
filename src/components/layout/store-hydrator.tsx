"use client";

import { useEffect } from "react";
import { useExcavlaStore } from "@/lib/excavla/store";

/**
 * Rehidrata el store desde sessionStorage después del mount, para que el
 * primer render del cliente coincida con el del servidor (seed) y no haya
 * desajuste de hidratación. Se monta una sola vez en el layout de (app).
 */
export function StoreHydrator() {
  useEffect(() => {
    useExcavlaStore.persist.rehydrate();
  }, []);

  return null;
}
