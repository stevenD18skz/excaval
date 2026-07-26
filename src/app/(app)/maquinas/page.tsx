import { Suspense } from "react";
import { MaquinasView } from "./maquinas-view";

export default function MaquinasPage() {
  return (
    <Suspense>
      <MaquinasView />
    </Suspense>
  );
}
