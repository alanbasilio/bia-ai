"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortableHead, useSort, type SortState } from "@/components/ui/sortable-head";
import { StatusBadge } from "./status-badge";
import { PedidoDialog } from "./pedido-dialog";
import { DeletePedidoDialog } from "./delete-pedido-dialog";
import { usePedidos } from "@/hooks/use-pedidos";
import { PageHeader } from "@/components/layout/page-header";
import type { Pedido } from "@/lib/types";

const PGTO_LABEL: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
  transferencia: "Transferência",
};

function getValue(pedido: Pedido, column: string): string | number {
  switch (column) {
    case "cliente":  return pedido.clientes?.nome ?? "";
    case "produto":  return pedido.produto;
    case "quantidade": return pedido.quantidade;
    case "valor":    return pedido.valor;
    case "status":   return pedido.status;
    case "data":     return pedido.data_pedido;
    case "pagamento": return pedido.forma_pagamento ?? "";
    default:         return "";
  }
}

export function PedidosTable() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const { handleSort } = useSort();
  const searchParams = useSearchParams();
  const router = useRouter();
  const clienteId = searchParams.get("cliente_id") ?? "";
  const clienteNome = searchParams.get("cliente_nome") ?? "";
  const { data: pedidos = [], isLoading, isError } = usePedidos(search, clienteId);

  function onSort(column: string) {
    setSort((prev) => handleSort(prev, column));
  }

  const sorted = useMemo(() => {
    if (!sort) return pedidos;
    return [...pedidos].sort((a, b) => {
      const va = getValue(a, sort.column);
      const vb = getValue(b, sort.column);
      if (va === "" || va == null) return 1;
      if (vb === "" || vb == null) return -1;
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "pt-BR", { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [pedidos, sort]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Pedidos"
        description={`${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""} encontrado${pedidos.length !== 1 ? "s" : ""}`}
        action={
          <PedidoDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4 mr-2" />
                Novo Pedido
              </Button>
            }
          />
        }
      />

      {clienteId && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-muted-foreground">Filtrando por cliente:</span>
          <span className="font-medium">{clienteNome || clienteId}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => router.push("/pedidos")}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por produto ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex-1 overflow-auto min-h-0 rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <SortableHead column="cliente"    sort={sort} onSort={onSort}>Cliente</SortableHead>
              <SortableHead column="produto"    sort={sort} onSort={onSort}>Produto</SortableHead>
              <SortableHead column="quantidade" sort={sort} onSort={onSort} className="text-center">Qtd</SortableHead>
              <SortableHead column="valor"      sort={sort} onSort={onSort} className="text-right">Valor</SortableHead>
              <SortableHead column="status"     sort={sort} onSort={onSort}>Status</SortableHead>
              <SortableHead column="data"       sort={sort} onSort={onSort}>Data</SortableHead>
              <SortableHead column="pagamento"  sort={sort} onSort={onSort}>Pagamento</SortableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-destructive">
                  Erro ao carregar pedidos.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-medium">
                  {pedido.clientes ? (
                    <Link
                      href={`/clientes?cliente_id=${pedido.clientes.id}`}
                      className="hover:underline text-primary"
                    >
                      {pedido.clientes.nome}
                    </Link>
                  ) : "—"}
                </TableCell>
                <TableCell>{pedido.produto}</TableCell>
                <TableCell className="text-center">{pedido.quantidade}</TableCell>
                <TableCell className="text-right">
                  {pedido.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={pedido.status} />
                </TableCell>
                <TableCell>
                  {new Date(pedido.data_pedido + "T12:00:00").toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  {pedido.forma_pagamento ? PGTO_LABEL[pedido.forma_pagamento] : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <PedidoDialog
                      pedido={pedido}
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8">
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                    />
                    <DeletePedidoDialog
                      id={pedido.id}
                      produto={pedido.produto}
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
