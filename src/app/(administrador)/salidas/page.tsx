import { Suspense } from "react";
import { SalidasView } from "./salidas-view";

export default function SalidasPage() {
  return (
    <Suspense>
      <SalidasView />
    </Suspense>
  );
}
