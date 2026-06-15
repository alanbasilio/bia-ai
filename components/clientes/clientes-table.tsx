"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2, Plus, Search, Phone, ShoppingBag } from "lucide-react";
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
import { ClienteDialog } from "./cliente-dialog";
import { DeleteClienteDialog } from "./delete-cliente-dialog";
import { useClientes } from "@/hooks/use-clientes";
import { PageHeader } from "@/components/layout/page-header";
import type { ClienteComContagem } from "@/lib/types";

function getValue(cliente: ClienteComContagem, column: string): string | number {
  switch (column) {
    case "nome":      return cliente.nome;
    case "instagram": return cliente.instagram ?? "";
    case "whatsapp":  return cliente.whatsapp ?? "";
    case "endereco":  return cliente.endereco ?? "";
    case "pedidos":   return cliente.pedidos?.[0]?.count ?? 0;
    default:          return "";
  }
}

export function ClientesTable() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState<SortState>(null);
  const { handleSort } = useSort();
  const { data: clientes = [], isLoading, isError } = useClientes(search);

  function onSort(column: string) {
    setSort((prev) => handleSort(prev, column));
  }

  const sorted = useMemo(() => {
    if (!sort) return clientes;
    return [...clientes].sort((a, b) => {
      const va = getValue(a, sort.column);
      const vb = getValue(b, sort.column);
      if (va === "" || va == null) return 1;
      if (vb === "" || vb == null) return -1;
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb), "pt-BR");
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [clientes, sort]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Clientes"
        description={`${clientes.length} cliente${clientes.length !== 1 ? "s" : ""} encontrado${clientes.length !== 1 ? "s" : ""}`}
        action={
          <ClienteDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4 mr-2" />
                Novo Cliente
              </Button>
            }
          />
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex-1 overflow-auto min-h-0 rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <SortableHead column="nome"      sort={sort} onSort={onSort}>Nome</SortableHead>
              <SortableHead column="instagram" sort={sort} onSort={onSort}>Instagram</SortableHead>
              <SortableHead column="whatsapp"  sort={sort} onSort={onSort}>WhatsApp</SortableHead>
              <SortableHead column="endereco"  sort={sort} onSort={onSort}>Endereço</SortableHead>
              <TableHead>Observações</TableHead>
              <SortableHead column="pedidos"   sort={sort} onSort={onSort} className="text-center">Pedidos</SortableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-destructive">
                  Erro ao carregar clientes.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">{cliente.nome}</TableCell>
                <TableCell>
                  {cliente.instagram ? (
                    <span className="text-sm text-muted-foreground">{cliente.instagram}</span>
                  ) : "—"}
                </TableCell>
                <TableCell>
                  {cliente.whatsapp ? (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="size-3.5" />
                      {cliente.whatsapp}
                    </span>
                  ) : "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {cliente.endereco ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {cliente.observacoes ?? "—"}
                </TableCell>
                <TableCell className="text-center">
                  {(() => {
                    const count = cliente.pedidos?.[0]?.count ?? 0;
                    return count > 0 ? (
                      <Link
                        href={`/pedidos?cliente_id=${cliente.id}&cliente_nome=${encodeURIComponent(cliente.nome)}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        <ShoppingBag className="size-3.5" />
                        {count}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">0</span>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ClienteDialog
                      cliente={cliente}
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8">
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                    />
                    <DeleteClienteDialog
                      id={cliente.id}
                      nome={cliente.nome}
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
