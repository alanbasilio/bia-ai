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
    case "cliente":    return pedido.clientes?.nome ?? "";
    case "produto":    return pedido.produtos?.nome ?? "";
    case "quantidade": return pedido.quantidade;
    case "valor":      return pedido.valor;
    case "status":     return pedido.status;
    case "data":       return pedido.data_pedido;
    case "pagamento":  return pedido.forma_pagamento ?? "";
    default:           return "";
  }
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(datePedido: string) {
  return new Date(datePedido + "T12:00:00").toLocaleDateString("pt-BR");
}

export function PedidosTable() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ column: "data", dir: "desc" });
  const { handleSort } = useSort();
  const searchParams = useSearchParams();
  const router = useRouter();
  const clienteId = searchParams.get("cliente_id") ?? "";
  const clienteNome = searchParams.get("cliente_nome") ?? "";
  const produtoId = searchParams.get("produto_id") ?? "";
  const { data: pedidos = [], isLoading, isError } = usePedidos(search, clienteId, produtoId);

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

  const filterBanner = (clienteId || produtoId) && (
    <div className="flex items-center gap-2 mb-4 text-sm">
      <span className="text-muted-foreground">
        {clienteId ? "Filtrando por cliente:" : "Filtrando por produto:"}
      </span>
      <span className="font-medium">
        {clienteId
          ? clienteNome || clienteId
          : pedidos[0]?.produtos?.nome ?? produtoId}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        onClick={() => router.push("/pedidos")}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );

  const searchBar = (
    <div className="relative mb-4 w-full sm:max-w-sm">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por produto ou cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  );

  const actionButtons = (pedido: Pedido) => (
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
        produto={pedido.produtos?.nome ?? "—"}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        }
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Pedidos"
        description={`${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""} encontrado${pedidos.length !== 1 ? "s" : ""}`}
        action={
          <PedidoDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4 mr-1.5" />
                Novo Pedido
              </Button>
            }
          />
        }
      />

      {filterBanner}
      {searchBar}

      <div className="flex-1 overflow-auto min-h-0">
        {/* Mobile card view */}
        <div className="md:hidden space-y-2 pb-2">
          {isLoading && (
            <p className="text-center py-10 text-sm text-muted-foreground">
              Carregando...
            </p>
          )}
          {isError && (
            <p className="text-center py-10 text-sm text-destructive">
              Erro ao carregar pedidos.
            </p>
          )}
          {!isLoading && sorted.length === 0 && (
            <p className="text-center py-10 text-sm text-muted-foreground">
              Nenhum pedido encontrado.
            </p>
          )}
          {sorted.map((pedido) => (
            <div
              key={pedido.id}
              className="rounded-lg border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {pedido.produtos?.nome}
                  </p>
                  {pedido.clientes ? (
                    <Link
                      href={`/clientes?cliente_id=${pedido.clientes.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {pedido.clientes.nome}
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sem cliente
                    </span>
                  )}
                </div>
                <div className="shrink-0">{actionButtons(pedido)}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold">{formatBRL(pedido.valor)}</span>
                <StatusBadge status={pedido.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span>{formatDate(pedido.data_pedido)}</span>
                {pedido.forma_pagamento && (
                  <>
                    <span>·</span>
                    <span>{PGTO_LABEL[pedido.forma_pagamento]}</span>
                  </>
                )}
                <span>·</span>
                <span>
                  {pedido.quantidade}{" "}
                  {pedido.quantidade === 1 ? "unid." : "unids."}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-md border">
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
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-destructive"
                  >
                    Erro ao carregar pedidos.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
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
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{pedido.produtos?.nome}</TableCell>
                  <TableCell className="text-center">{pedido.quantidade}</TableCell>
                  <TableCell className="text-right">
                    {formatBRL(pedido.valor)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={pedido.status} />
                  </TableCell>
                  <TableCell>{formatDate(pedido.data_pedido)}</TableCell>
                  <TableCell>
                    {pedido.forma_pagamento
                      ? PGTO_LABEL[pedido.forma_pagamento]
                      : "—"}
                  </TableCell>
                  <TableCell>{actionButtons(pedido)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
