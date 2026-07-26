import { Suspense } from "react";
import { CuentasView } from "./cuentas-view";

export default function CuentasPage() {
  return (
    <Suspense>
      <CuentasView />
    </Suspense>
  );
}
