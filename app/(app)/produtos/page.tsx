import { Suspense } from "react";
import { ProdutosTable } from "@/components/produtos/produtos-table";

export default function ProdutosPage() {
  return (
    <Suspense>
      <ProdutosTable />
    </Suspense>
  );
}
