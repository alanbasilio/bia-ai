import { Suspense } from "react";
import { ClientesTable } from "@/components/clientes/clientes-table";

export default function ClientesPage() {
  return (
    <Suspense>
      <ClientesTable />
    </Suspense>
  );
}
