import { Suspense } from "react";
import { ClientesView } from "./clientes-view";

export default function ClientesPage() {
  return (
    <Suspense>
      <ClientesView />
    </Suspense>
  );
}
