import { Suspense } from "react";
import { PedidosTable } from "@/components/pedidos/pedidos-table";

export default function PedidosPage() {
  return (
    <Suspense>
      <PedidosTable />
    </Suspense>
  );
}
