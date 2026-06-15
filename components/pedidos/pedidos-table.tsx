"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
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
import { StatusBadge } from "./status-badge";
import { PedidoDialog } from "./pedido-dialog";
import { DeletePedidoDialog } from "./delete-pedido-dialog";
import { usePedidos } from "@/hooks/use-pedidos";
import { PageHeader } from "@/components/layout/page-header";

const PGTO_LABEL: Record<string, string> = {
  pix: "PIX",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
  transferencia: "Transferência",
};

export function PedidosTable() {
  const [search, setSearch] = useState("");
  const { data: pedidos = [], isLoading, isError } = usePedidos(search);

  return (
    <div>
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

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por produto ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Qtd</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
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
            {!isLoading && pedidos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-medium">
                  {pedido.clientes?.nome ?? "—"}
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
                  {pedido.forma_pagamento
                    ? PGTO_LABEL[pedido.forma_pagamento]
                    : "—"}
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
