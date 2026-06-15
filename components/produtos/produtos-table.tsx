"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, ShoppingBag } from "lucide-react";
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
import { ProdutoDialog } from "./produto-dialog";
import { DeleteProdutoDialog } from "./delete-produto-dialog";
import { useProdutos } from "@/hooks/use-produtos";
import { PageHeader } from "@/components/layout/page-header";
import type { ProdutoComContagem } from "@/lib/types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getValue(produto: ProdutoComContagem, column: string): string | number {
  switch (column) {
    case "nome":     return produto.nome;
    case "preco":    return produto.preco ?? -1;
    case "pedidos":  return produto.pedidos?.[0]?.count ?? 0;
    default:         return "";
  }
}

export function ProdutosTable() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ column: "nome", dir: "asc" });
  const { handleSort } = useSort();
  const { data: produtos = [], isLoading, isError } = useProdutos(search);

  function onSort(column: string) {
    setSort((prev) => handleSort(prev, column));
  }

  const sorted = useMemo(() => {
    if (!sort) return produtos;
    return [...produtos].sort((a, b) => {
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
  }, [produtos, sort]);

  const actionButtons = (produto: ProdutoComContagem) => (
    <div className="flex items-center gap-1">
      <ProdutoDialog
        produto={produto}
        trigger={
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-3.5" />
          </Button>
        }
      />
      <DeleteProdutoDialog
        id={produto.id}
        nome={produto.nome}
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
        title="Produtos"
        description={`${produtos.length} produto${produtos.length !== 1 ? "s" : ""} cadastrado${produtos.length !== 1 ? "s" : ""}`}
        action={
          <ProdutoDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4 mr-1.5" />
                Novo Produto
              </Button>
            }
          />
        }
      />

      <div className="relative mb-4 w-full sm:max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

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
              Erro ao carregar produtos.
            </p>
          )}
          {!isLoading && sorted.length === 0 && (
            <p className="text-center py-10 text-sm text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          )}
          {sorted.map((produto) => {
            const count = produto.pedidos?.[0]?.count ?? 0;
            return (
              <div
                key={produto.id}
                className="rounded-lg border bg-card p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{produto.nome}</p>
                    {produto.preco != null && (
                      <p className="text-sm text-muted-foreground">
                        {formatBRL(produto.preco)}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">{actionButtons(produto)}</div>
                </div>

                {produto.descricao && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {produto.descricao}
                  </p>
                )}

                {count > 0 ? (
                  <Link
                    href={`/pedidos?produto_id=${produto.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <ShoppingBag className="size-3" />
                    {count} pedido{count !== 1 ? "s" : ""}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Sem pedidos
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <SortableHead column="nome"    sort={sort} onSort={onSort}>Nome</SortableHead>
                <SortableHead column="preco"   sort={sort} onSort={onSort}>Preço</SortableHead>
                <TableHead>Descrição</TableHead>
                <SortableHead column="pedidos" sort={sort} onSort={onSort} className="text-center">Pedidos</SortableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-destructive">
                    Erro ao carregar produtos.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
              {sorted.map((produto) => {
                const count = produto.pedidos?.[0]?.count ?? 0;
                return (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>
                      {produto.preco != null ? formatBRL(produto.preco) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[280px]">
                      <span className="line-clamp-2">{produto.descricao ?? "—"}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {count > 0 ? (
                        <Link
                          href={`/pedidos?produto_id=${produto.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          <ShoppingBag className="size-3.5" />
                          {count}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>{actionButtons(produto)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
