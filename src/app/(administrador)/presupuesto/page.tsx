import { Suspense } from "react";
import { PresupuestoView } from "./presupuesto-view";

export default function PresupuestoPage() {
  return (
    <Suspense>
      <PresupuestoView />
    </Suspense>
  );
}
